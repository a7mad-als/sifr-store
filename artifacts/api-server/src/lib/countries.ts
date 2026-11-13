import { isIP } from "node:net";
import { destinationRegions, fallbackCountries, shippingZoneFor, type StoreCountry } from "@workspace/sifr-data";

const CACHE_MS = 6 * 60 * 60 * 1000;
let cached: { countries: StoreCountry[]; expiresAt: number } | null = null;
const preferred = [
  "KW", "SA", "AE", "QA", "BH", "OM", "SY", "JO", "LB", "IQ", "PS", "YE",
  "EG", "SD", "LY", "TN", "DZ", "MA", "MR", "SO", "DJ", "KM", "TR", "RU",
];

type ApiCountry = {
  alpha2Code?: string;
  name?: string;
  currencies?: { code?: string }[];
  callingCodes?: string[];
};

export async function getCountries() {
  if (cached && cached.expiresAt > Date.now()) return { countries: cached.countries, fallback: false };
  try {
    // REST Countries v3.1 was retired. countries.dev provides the same
    // public country/currency/calling-code data without a key or paid tier.
    const response = await fetch("https://countries.dev/countries?fields=name,alpha2Code,callingCodes,currencies", {
      signal: AbortSignal.timeout(8_000),
      headers: { accept: "application/json" },
    });
    if (!response.ok) throw new Error("Country service is unavailable");
    const data: unknown = await response.json();
    if (!Array.isArray(data)) throw new Error("Invalid country response");
    const arabicNames = new Intl.DisplayNames(["ar"], { type: "region" });
    const countries = data.flatMap((entry: ApiCountry): StoreCountry[] => {
      const code = typeof entry.alpha2Code === "string" ? entry.alpha2Code.toUpperCase() : "";
      const en = entry.name;
      if (!/^[A-Z]{2}$/.test(code) || typeof en !== "string" || en.length > 100) return [];
      const localized = arabicNames.of(code);
      const currency = entry.currencies?.find(item => typeof item.code === "string" && /^[A-Z]{3}$/.test(item.code))?.code ?? "KWD";
      const callingCode = entry.callingCodes?.find(item => /^\d{1,4}$/.test(item));
      return [{
          code,
          name: { ar: localized && localized !== code ? localized : en, en },
          callingCode: callingCode ? `+${callingCode}` : "",
          currency,
          shippingZone: shippingZoneFor(code),
        }];
    });
    if (countries.length < 150) throw new Error("Country list is incomplete");
    countries.push(...destinationRegions);
    countries.sort((a, b) => {
      const ai = a.code === "RU-DA" ? 24 : a.code === "RU-CE" ? 25 : preferred.indexOf(a.code);
      const bi = b.code === "RU-DA" ? 24 : b.code === "RU-CE" ? 25 : preferred.indexOf(b.code);
      if (ai >= 0 && bi >= 0) return ai - bi;
      if (ai >= 0) return -1;
      if (bi >= 0) return 1;
      return a.name.en.localeCompare(b.name.en);
    });
    cached = { countries, expiresAt: Date.now() + CACHE_MS };
    return { countries, fallback: false };
  } catch {
    return { countries: [...fallbackCountries, ...destinationRegions], fallback: true };
  }
}

export async function getVisitorCountry(ip: string | undefined) {
  if (!ip || isIP(ip) === 0 || ip.startsWith("127.") || ip === "::1" || ip.startsWith("10.") || ip.startsWith("192.168.") || ip.startsWith("172.16.")) return null;
  const response = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}?fields=success,country_code`, {
    signal: AbortSignal.timeout(4_000),
    headers: { accept: "application/json" },
  });
  if (!response.ok) return null;
  const data: unknown = await response.json();
  if (!data || typeof data !== "object") return null;
  const result = data as { success?: boolean; country_code?: unknown };
  if (!result.success || typeof result.country_code !== "string" || !/^[A-Z]{2}$/.test(result.country_code)) return null;
  return result.country_code;
}
