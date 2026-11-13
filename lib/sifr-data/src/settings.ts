import type { Localized } from "./taxonomy";
const l = (ar: string, en: string): Localized => ({ ar, en });
// Rates are illustrative KWD. One editable table drives checkout estimates
// and authoritative order totals; the first 0.5 kg is included in each base.
export const shippingZones = [
  { id: "gulf", name: l("الخليج", "Gulf"), baseKwd: 5, perExtraKgKwd: 1.5, minDays: 3, maxDays: 7 },
  { id: "levantEgypt", name: l("بلاد الشام ومصر", "Levant & Egypt"), baseKwd: 8, perExtraKgKwd: 2, minDays: 7, maxDays: 14 },
  { id: "maghreb", name: l("المغرب العربي", "Maghreb"), baseKwd: 10, perExtraKgKwd: 2.5, minDays: 10, maxDays: 18 },
  { id: "arabOther", name: l("بقية الدول العربية", "Other Arab countries"), baseKwd: 9, perExtraKgKwd: 2, minDays: 8, maxDays: 16 },
  { id: "turkey", name: l("تركيا", "Türkiye"), baseKwd: 9, perExtraKgKwd: 2, minDays: 5, maxDays: 10 },
  { id: "russiaCaucasus", name: l("روسيا ودول القوقاز الروسية", "Russia & Russian Caucasus"), baseKwd: 12, perExtraKgKwd: 3, minDays: 10, maxDays: 21 },
  { id: "restWorld", name: l("بقية العالم", "Rest of world"), baseKwd: 15, perExtraKgKwd: 3, minDays: 12, maxDays: 25 },
] as const;

export type ShippingZoneId = typeof shippingZones[number]["id"];
export type StoreCountry = {
  code: string;
  name: Localized;
  callingCode: string;
  currency: string;
  shippingZone: ShippingZoneId;
  region?: boolean;
};

const gcc = new Set(["KW", "SA", "AE", "QA", "BH", "OM"]);
const levantEgypt = new Set(["SY", "JO", "LB", "IQ", "PS", "EG"]);
const maghreb = new Set(["LY", "TN", "DZ", "MA", "MR"]);
const otherArab = new Set(["YE", "SD", "SO", "DJ", "KM"]);
export function shippingZoneFor(code: string): ShippingZoneId {
  if (gcc.has(code)) return "gulf";
  if (levantEgypt.has(code)) return "levantEgypt";
  if (maghreb.has(code)) return "maghreb";
  if (otherArab.has(code)) return "arabOther";
  if (code === "TR") return "turkey";
  if (code === "RU" || code === "RU-DA" || code === "RU-CE") return "russiaCaucasus";
  return "restWorld";
}

export function estimateShipping(code: string, weightKg: number) {
  const zoneId = shippingZoneFor(code);
  const zone = shippingZones.find(item => item.id === zoneId)!;
  const weight = Number.isFinite(weightKg) ? Math.max(0.5, weightKg) : 0.5;
  const extraKg = Math.ceil(Math.max(0, weight - 0.5));
  return {
    amountKwd: Math.round((zone.baseKwd + extraKg * zone.perExtraKgKwd) * 1000) / 1000,
    zone: zoneId,
    minDays: zone.minDays,
    maxDays: zone.maxDays,
    weightKg: Math.round(weight * 100) / 100,
  };
}

const fallbackRows: [string, string, string, string, string][] = [
  ["KW", "الكويت", "Kuwait", "+965", "KWD"], ["SA", "السعودية", "Saudi Arabia", "+966", "SAR"],
  ["AE", "الإمارات", "United Arab Emirates", "+971", "AED"], ["QA", "قطر", "Qatar", "+974", "QAR"],
  ["BH", "البحرين", "Bahrain", "+973", "BHD"], ["OM", "عُمان", "Oman", "+968", "OMR"],
  ["SY", "سوريا", "Syria", "+963", "SYP"], ["JO", "الأردن", "Jordan", "+962", "JOD"],
  ["LB", "لبنان", "Lebanon", "+961", "LBP"], ["IQ", "العراق", "Iraq", "+964", "IQD"],
  ["PS", "فلسطين", "Palestine", "+970", "ILS"], ["YE", "اليمن", "Yemen", "+967", "YER"],
  ["EG", "مصر", "Egypt", "+20", "EGP"], ["SD", "السودان", "Sudan", "+249", "SDG"],
  ["LY", "ليبيا", "Libya", "+218", "LYD"], ["TN", "تونس", "Tunisia", "+216", "TND"],
  ["DZ", "الجزائر", "Algeria", "+213", "DZD"], ["MA", "المغرب", "Morocco", "+212", "MAD"],
  ["MR", "موريتانيا", "Mauritania", "+222", "MRU"], ["SO", "الصومال", "Somalia", "+252", "SOS"],
  ["DJ", "جيبوتي", "Djibouti", "+253", "DJF"], ["KM", "جزر القمر", "Comoros", "+269", "KMF"],
  ["TR", "تركيا", "Türkiye", "+90", "TRY"], ["RU", "روسيا", "Russia", "+7", "RUB"],
];
export const fallbackCountries: StoreCountry[] = fallbackRows.map(([code, ar, en, callingCode, currency]) => ({
  code, name: l(ar, en), callingCode, currency, shippingZone: shippingZoneFor(code),
}));
// Backwards-compatible destination aliases for Russian republics.
export const destinationRegions: StoreCountry[] = [
  { code: "RU-DA", name: l("داغستان (روسيا)", "Dagestan (Russia)"), callingCode: "+7", currency: "RUB", shippingZone: "russiaCaucasus", region: true },
  { code: "RU-CE", name: l("الشيشان (روسيا)", "Chechnya (Russia)"), callingCode: "+7", currency: "RUB", shippingZone: "russiaCaucasus", region: true },
];
// All public currencies, fallback countries, demo shipping and contact details
// live in this file so the storefront can be updated without editing components.
export const currencyOptions = [
  ["KWD", "د.ك", "Kuwaiti Dinar", "دينار كويتي"], ["SAR", "ر.س", "Saudi Riyal", "ريال سعودي"],
  ["AED", "د.إ", "UAE Dirham", "درهم إماراتي"], ["QAR", "ر.ق", "Qatari Riyal", "ريال قطري"],
  ["BHD", "د.ب", "Bahraini Dinar", "دينار بحريني"], ["OMR", "ر.ع", "Omani Rial", "ريال عُماني"],
  ["YER", "ر.ي", "Yemeni Rial", "ريال يمني"], ["IQD", "د.ع", "Iraqi Dinar", "دينار عراقي"],
  ["JOD", "د.أ", "Jordanian Dinar", "دينار أردني"], ["LBP", "ل.ل", "Lebanese Pound", "ليرة لبنانية"],
  ["SYP", "ل.س", "Syrian Pound", "ليرة سورية"], ["EGP", "ج.م", "Egyptian Pound", "جنيه مصري"],
  ["SDG", "ج.س", "Sudanese Pound", "جنيه سوداني"], ["LYD", "د.ل", "Libyan Dinar", "دينار ليبي"],
  ["TND", "د.ت", "Tunisian Dinar", "دينار تونسي"], ["DZD", "د.ج", "Algerian Dinar", "دينار جزائري"],
  ["MAD", "د.م", "Moroccan Dirham", "درهم مغربي"], ["MRU", "أ.م", "Mauritanian Ouguiya", "أوقية موريتانية"],
  ["SOS", "Sh", "Somali Shilling", "شلن صومالي"], ["DJF", "Fdj", "Djiboutian Franc", "فرنك جيبوتي"],
  ["KMF", "CF", "Comorian Franc", "فرنك قمري"], ["ILS", "₪", "Israeli New Shekel", "شيكل إسرائيلي"],
  ["TRY", "₺", "Turkish Lira", "ليرة تركية"], ["RUB", "₽", "Russian Ruble", "روبل روسي"],
  ["USD", "$", "US Dollar", "دولار أمريكي"], ["EUR", "€", "Euro", "يورو"],
].map(([code, symbol, en, ar]) => ({ code, symbol, name: l(ar, en) }));

export const destinations = [...fallbackCountries, ...destinationRegions].map(country => ({
  ...country,
  demoShipping: estimateShipping(country.code, 0.5).amountKwd,
}));

export function shippingFor(code: string) {
  if (!/^[A-Z]{2}(-[A-Z]{2})?$/.test(code)) throw new Error("Unsupported shipping destination");
  return estimateShipping(code, 0.5).amountKwd;
}

export const partnerTracks = [
  { id: "bookshop", name: l("المكتبات ومنافذ البيع", "Bookshops & Retailers"), title: l("ضع إصداراتنا على رفوفك", "Put our editions on your shelves"), body: l("توزيع وشراء بالجملة بأسعار خاصة.", "Distribution and wholesale purchasing at special rates.") },
  { id: "publisher", name: l("دور النشر", "Publishers"), title: l("وزّع إصداراتك عبرنا، أو وزّع إصداراتنا في بلدك", "Distribute your editions through us, or ours in your country"), body: l("آفاق للتوزيع المتبادل والنشر المشترك.", "Opportunities for reciprocal distribution and co-publishing.") },
  { id: "education", name: l("الجامعات والمعاهد والمدارس الشرعية", "Universities, Institutes & Islamic Schools"), title: l("مقرراتكم بطبعات محققة، تصل قاعاتكم", "Verified course texts, delivered to your classrooms"), body: l("تعاون لتوفير كتب المقررات وبناء مكتبات الطلاب.", "Work with us to supply course texts and build student libraries.") },
  { id: "charity", name: l("الجوامع والأوقاف والجهات الخيرية", "Mosques, Endowments & Charities"), title: l("كتابٌ في كل محراب: مشاريع وقف الكتب وتوزيعها", "A book in every mihrab: book endowments and distribution"), body: l("شراكات تعين على نشر العلم وإدامة نفع الكتاب.", "Partnerships that spread knowledge and sustain the benefit of books.") },
  { id: "research", name: l("مراكز الأبحاث والمكتبات العامة", "Research Centres & Public Libraries"), title: l("نزوّد مكتبتكم بما يليق بباحثيها", "Equip your library for its researchers"), body: l("اختيار علمي مدروس يلائم احتياجات الباحثين.", "Thoughtfully selected scholarly works for research needs.") },
  { id: "distributor", name: l("الموزعون والمعارض الدولية", "Distributors & International Book Fairs"), title: l("كن وكيلنا في بلدك", "Become our representative in your country"), body: l("لنوصل إصدارات سِفْر إلى قراء جدد معًا.", "Bring Sifr editions to new readers together.") },
] as const;

export const storeSettings = {
  demo: true,
  mission: l("إيصال كتب العلم الشرعي بطبعات متقنة لطلابه في كل مكان.", "Bringing carefully produced books of Islamic knowledge to students everywhere."),
  partnershipResponse: l("زمن الرد المستهدف بعد تفعيل البريد يومَا عمل؛ لا يُرسل إشعار تلقائي حاليًا.", "The target response time is two business days once email is enabled; no automatic notification is sent now."),
  contact: {
    email: { value: "hello@sifr.example", url: null as string | null, placeholder: true },
    whatsapp: { value: "+965 XXXX XXXX", url: null as string | null, placeholder: true },
    phone: { value: "+965 XXXX XXXX", url: null as string | null, placeholder: true },
  },
  socials: [
    { id: "instagram", name: l("إنستقرام", "Instagram"), url: null as string | null },
    { id: "x", name: l("X", "X"), url: null as string | null },
    { id: "youtube", name: l("يوتيوب", "YouTube"), url: null as string | null },
    { id: "telegram", name: l("تيليغرام", "Telegram"), url: null as string | null },
    { id: "tiktok", name: l("تيك توك", "TikTok"), url: null as string | null },
    { id: "facebook", name: l("فيسبوك", "Facebook"), url: null as string | null },
  ],
  quickLinks: [
    { id: "books", name: l("الكتب", "Books"), path: "/#books" },
    { id: "categories", name: l("الأقسام", "Categories"), path: "/#categories" },
    { id: "partnerships", name: l("الشراكات", "Partnerships"), path: "/#partnerships" },
    { id: "tracking", name: l("تتبع الطلب", "Track an order"), path: "/help/tracking" },
  ],
  serviceLinks: [
    { id: "shipping", name: l("الشحن والتوصيل", "Shipping & Delivery"), path: "/help/shipping" },
    { id: "returns", name: l("الاستبدال والاسترجاع", "Exchanges & Returns"), path: "/help/returns" },
    { id: "payments", name: l("طرق الدفع", "Payment Methods"), path: "/help/payments" },
    { id: "faq", name: l("الأسئلة الشائعة", "FAQ"), path: "/help/faq" },
    { id: "privacy", name: l("سياسة الخصوصية", "Privacy Policy"), path: "/help/privacy" },
    { id: "terms", name: l("الشروط", "Terms"), path: "/help/terms" },
  ],
  newsletter: { enabled: true, deliveryConnected: false },
  paymentMarks: ["KNET", "VISA", "Mastercard", "MyFatoorah", "Stripe"],
};
