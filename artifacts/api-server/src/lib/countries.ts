import { isIP } from "node:net";
import { destinationRegions, fallbackCountries, shippingZoneFor, type StoreCountry } from "@workspace/sifr-data";

const CACHE_MS = 6 * 60 * 60 * 1000;
let cached: { countries: StoreCountry[]; expiresAt: number } | null = null;
const preferred = [
  "KW", "SA", "AE", "QA", "BH", "OM", "SY", "JO", "LB", "IQ", "PS", "YE",
  "EG", "SD", "LY", "TN", "DZ", "MA", "MR", "SO", "DJ", "KM", "TR", "RU",
];

type ApiCountry = {
  cca2?: string;
  name?: { common?: string };
  translations?: { ara?: { common?: string } };
  currencies?: Record<string, unknown>;
  idd?: { root?: string; suffixes?: string[] };
};

export async function getCountries() {
  if (cached && cached.expiresAt > Date.now()) return { countries: cached.countries, fallback: false };
  try {
    const response = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,translations,currencies,idd", {
      signal: AbortSignal.timeout(8_000),
      headers: { accept: "application/json" },
    });
    if (!response.ok) throw new Error("Country service is unavailable");
    const data: unknown = await response.json();
    if (!Array.isArray(data)) throw new Error("Invalid country response");
    const countries = data.flatMap((entry: ApiCountry): StoreCountry[] => {
      const code = typeof entry.cca2 === "string" ? entry.cca2.toUpperCase() : "";
      const en = entry.name?.common;
      if (!/^[A-Z]{2}$/.test(code) || typeof en !== "string" || en.length > 100) return [];
      const currency = Object.keys(entry.currencies ?? {}).find(c => /^[A-Z]{3}$/.test(c)) ?? "KWD";
      const root = typeof entry.idd?.root === "string" ? entry.idd.root : "";
      const suffix = Array.isArray(entry.idd?.suffixes) && typeof entry.idd.suffixes[0] === "string" ? entry.idd.suffixes[0] : "";
      const callingCode = `${root}${suffix}`;
      return [{
        code,
        name: { ar: entry.translations?.ara?.common || en, en },
        callingCode: /^\+\d{1,4}$/.test(callingCode) ? callingCode : "",
        currency,
        shippingZone: shippingZoneFor(code),
      }];
    });
    if (countries.length < 150) throw new Error("Country list is incomplete");
    countries.push(...destinationRegions);
    countries.sort((a, b) => {
      const ai = a.code === "RU-DA" ? 24 : a.code === "RU-CE" ? 25 : preferred.indexOf(a.code);
      const bi = b.code === "RU-DA" ? 24 : b.code === "RU-CE" ? 25 : preferred.indexOf(b.code);
      if (ai >= 0 || bi >= 0) return (ai < 0 ? Infinity : ai) - (bi < 0 ? Infinity : bi);
      return a.name.en.localeCompare(b.name.en);
    });
    cached = { countries, expiresAt: Date.now() + CACHE_MS };
    return { countries, fallback: false };
  } catch {
    return { countries: [...fallbackCountries, ...destinationRegions], fallback: true };
  }
}

export async function getVisitorCountry(ip: string | undefined) {
  if (!ip || isIP(ip) === 0 || ip.startsWith("127.") || ip === "::1" || ip.startsWith("10.") || ip.startsWith("192.168.")) return null;
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
