import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  getGetExchangeRatesQueryKey, getListCountriesQueryKey, getSuggestVisitorCountryQueryKey,
  useListCountries, useSuggestVisitorCountry, useGetExchangeRates, type Country, type ExchangeRates,
} from "@workspace/api-client-react";
import { currencyOptions, destinationRegions, fallbackCountries, type StoreCountry } from "@workspace/sifr-data";
import { useI18n, type Lang } from "@/lib/i18n";

const PREFS_KEY = "sifr.market";
const GEO_SEEN_KEY = "sifr.geo-prompt-seen";
type Currency = typeof currencyOptions[number]["code"];
type Suggestion = { country: StoreCountry; currency: Currency; language: Lang };
type MarketContext = {
  country: string; currency: Currency; countries: StoreCountry[];
  rates?: ExchangeRates; ratesLoading: boolean; ratesUnavailable: boolean;
  suggestion: Suggestion | null; applySuggestion: () => void; dismissSuggestion: () => void;
  setCountry: (code: string) => void; setCurrency: (code: string) => void;
  formatPrice: (kwd: number) => string;
};
const MarketCtx = createContext<MarketContext | null>(null);

function readPrefs() {
  try {
    const value = JSON.parse(localStorage.getItem(PREFS_KEY) ?? "null") as Partial<{ country: string; currency: string }> | null;
    if (!value) return null;
    return {
      country: typeof value.country === "string" ? value.country : "KW",
      currency: currencyOptions.some(item => item.code === value.currency) ? value.currency as Currency : "KWD",
    };
  } catch { return null; }
}

function asStoreCountry(country: Country): StoreCountry {
  return { ...country, shippingZone: country.shippingZone as StoreCountry["shippingZone"] };
}

export function MarketProvider({ children }: { children: ReactNode }) {
  const { lang, setLang } = useI18n();
  const [initialPrefs] = useState(readPrefs);
  const [countryValue, setCountryValue] = useState(initialPrefs?.country ?? "KW");
  const [currencyValue, setCurrencyValue] = useState<Currency>(initialPrefs?.currency ?? "KWD");
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const suggestionHandled = useRef(false);
  const [geoEnabled] = useState(() => {
    if (initialPrefs || localStorage.getItem(GEO_SEEN_KEY)) return false;
    localStorage.setItem(GEO_SEEN_KEY, "1");
    return true;
  });
  const countryQuery = useListCountries({ query: { queryKey: getListCountriesQueryKey(), staleTime: 6 * 60 * 60 * 1000, retry: false } });
  const rateQuery = useGetExchangeRates({ query: { queryKey: getGetExchangeRatesQueryKey(), staleTime: 10 * 60 * 1000, retry: false } });
  const geoQuery = useSuggestVisitorCountry({ query: { queryKey: getSuggestVisitorCountryQueryKey(), enabled: geoEnabled, staleTime: Infinity, retry: false } });
  const countries = useMemo(() => {
    const live = (countryQuery.data?.countries ?? fallbackCountries).map(asStoreCountry);
    const merged = new Map(live.map(item => [item.code, item]));
    destinationRegions.forEach(item => merged.set(item.code, item));
    return [...merged.values()];
  }, [countryQuery.data]);

  useEffect(() => {
    localStorage.setItem(PREFS_KEY, JSON.stringify({ country: countryValue, currency: currencyValue }));
    localStorage.setItem("sifr.lang", lang);
  }, [countryValue, currencyValue, lang]);

  useEffect(() => {
    if (rateQuery.isError && currencyValue !== "KWD") setCurrencyValue("KWD");
  }, [currencyValue, rateQuery.isError]);

  useEffect(() => {
    const code = geoQuery.data?.countryCode;
    if (!code || suggestion || suggestionHandled.current) return;
    const found = countries.find(item => item.code === code);
    if (!found) return;
    const currency = currencyOptions.some(item => item.code === found.currency) ? found.currency as Currency : "USD";
    setSuggestion({ country: found, currency, language: lang });
  }, [countries, geoQuery.data, lang, suggestion]);

  const setCountry = (code: string) => {
    if (!countries.some(item => item.code === code)) return;
    suggestionHandled.current = true;
    setSuggestion(null);
    setCountryValue(code);
    const found = countries.find(item => item.code === code);
    if (found) setCurrencyValue(currencyOptions.some(item => item.code === found.currency) ? found.currency as Currency : "USD");
  };
  const setCurrency = (code: string) => {
    if (currencyOptions.some(item => item.code === code)) setCurrencyValue(code as Currency);
  };
  const applySuggestion = () => {
    if (!suggestion) return;
    suggestionHandled.current = true;
    setCountryValue(suggestion.country.code);
    setCurrencyValue(suggestion.currency);
    setLang(suggestion.language);
    setSuggestion(null);
  };
  const formatPrice = (kwd: number) => {
    const rates = rateQuery.data?.rates ?? {};
    const chosen = rates[currencyValue] ? currencyValue : "KWD";
    const value = kwd * (chosen === "KWD" ? 1 : rates[chosen]);
    return new Intl.NumberFormat(lang === "ar" ? "ar-KW" : "en-US", {
      style: "currency", currency: chosen, currencyDisplay: "symbol",
    }).format(value);
  };
  const value: MarketContext = {
    country: countryValue, currency: currencyValue, countries,
    rates: rateQuery.data, ratesLoading: rateQuery.isLoading, ratesUnavailable: rateQuery.isError,
    suggestion, applySuggestion, dismissSuggestion: () => { suggestionHandled.current = true; setSuggestion(null); },
    setCountry, setCurrency, formatPrice,
  };
  return <MarketCtx.Provider value={value}>{children}</MarketCtx.Provider>;
}

export function useMarket() {
  const context = useContext(MarketCtx);
  if (!context) throw new Error("useMarket outside MarketProvider");
  return context;
}

export function MarketNotice() {
  const { t, pick } = useI18n();
  const { suggestion, applySuggestion, dismissSuggestion, ratesLoading, ratesUnavailable } = useMarket();
  return (
    <>
      {ratesLoading && <p className="bg-[#EFE7D6] px-4 py-2 text-center text-xs text-[#1B2A41]/70" role="status" data-testid="status-rates-loading">{t("market.loading")}</p>}
      {ratesUnavailable && <p className="bg-[#EFE7D6] px-4 py-2 text-center text-xs text-[#1B2A41]/70" role="status" data-testid="status-rates-unavailable">{t("market.rateFallback")}</p>}
      {suggestion && (
        <div className="flex flex-wrap items-center justify-center gap-3 bg-[#1B2A41] px-4 py-3 text-sm text-[#F6F1E7]" role="status" data-testid="banner-location-suggestion">
          <span>{t("market.visiting")} {pick(suggestion.country.name)}? {t("market.currencySuggested")}: {suggestion.currency} · {t(suggestion.language === "ar" ? "market.arabic" : "market.english")}</span>
          <button type="button" onClick={applySuggestion} className="bg-[#B8893B] px-3 py-1.5 text-[#1B2A41]" data-testid="button-location-yes">{t("market.yes")}</button>
          <button type="button" onClick={dismissSuggestion} className="border border-[#F6F1E7]/35 px-3 py-1.5" data-testid="button-location-change">{t("market.change")}</button>
        </div>
      )}
    </>
  );
}

export function MarketSelectors({ mobile = false }: { mobile?: boolean }) {
  const { t, pick } = useI18n();
  const { country, currency, countries, setCountry, setCurrency, ratesLoading } = useMarket();
  const common = "h-9 border border-[#1B2A41]/20 bg-[#F6F1E7] px-2 text-xs text-[#1B2A41] outline-none focus:border-[#B8893B]";
  return (
    <div className={mobile ? "grid grid-cols-2 gap-3" : "flex items-center gap-1.5"}>
      <label className={mobile ? "block text-xs text-[#F6F1E7]/60" : "block"}>
        <span className={mobile ? "mb-1 block" : "sr-only"}>{t("market.country")}</span>
        <select value={country} onChange={event => setCountry(event.target.value)} className={`${common} ${mobile ? "w-full" : "w-[112px]"}`} aria-label={t("market.country")} data-testid={mobile ? "select-mobile-country" : "select-nav-country"}>
          {countries.map(item => <option key={item.code} value={item.code}>{pick(item.name)}</option>)}
        </select>
      </label>
      <label className={mobile ? "block text-xs text-[#F6F1E7]/60" : "block"}>
        <span className={mobile ? "mb-1 block" : "sr-only"}>{t("market.currency")}</span>
        <select value={currency} onChange={event => setCurrency(event.target.value)} className={`${common} ${mobile ? "w-full" : "w-[92px]"}`} aria-label={t("market.currency")} data-testid={mobile ? "select-mobile-currency" : "select-nav-currency"}>
          {currencyOptions.map(item => <option key={item.code} value={item.code}>{item.code} — {pick(item.name)}</option>)}
        </select>
      </label>
      {ratesLoading && !mobile && <span className="sr-only" role="status">{t("market.loading")}</span>}
    </div>
  );
}
