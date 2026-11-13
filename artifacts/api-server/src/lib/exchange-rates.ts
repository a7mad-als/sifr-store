const CACHE_MS = 10 * 60 * 1000;
let cached: { rates: Record<string, number>; updatedAt: string; expiresAt: number } | null = null;

export async function getKwdRates() {
  if (cached && cached.expiresAt > Date.now()) return { base: "KWD" as const, rates: cached.rates, updatedAt: cached.updatedAt };
  const response = await fetch("https://open.er-api.com/v6/latest/KWD", {
    signal: AbortSignal.timeout(8_000),
    headers: { accept: "application/json" },
  });
  if (!response.ok) throw new Error("Exchange-rate service is unavailable");
  const data: unknown = await response.json();
  if (!data || typeof data !== "object") throw new Error("Invalid exchange-rate response");
  const record = data as Record<string, unknown>;
  const raw = record.rates;
  if (record.result !== "success" || !raw || typeof raw !== "object") throw new Error("Invalid exchange-rate response");
  const rates: Record<string, number> = {};
  for (const [code, value] of Object.entries(raw)) {
    if (/^[A-Z]{3}$/.test(code) && typeof value === "number" && Number.isFinite(value) && value > 0) rates[code] = value;
  }
  if (rates.KWD !== 1) throw new Error("Exchange-rate base is not KWD");
  const timestamp = typeof record.time_last_update_unix === "number"
    ? new Date(record.time_last_update_unix * 1000).toISOString()
    : new Date().toISOString();
  cached = { rates, updatedAt: timestamp, expiresAt: Date.now() + CACHE_MS };
  return { base: "KWD" as const, rates, updatedAt: timestamp };
}
