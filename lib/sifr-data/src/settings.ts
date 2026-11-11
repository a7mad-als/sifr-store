import type { Localized } from "./taxonomy";
const l = (ar: string, en: string): Localized => ({ ar, en });
// All public destinations, demo rates, contact details, footer links and external
// service placeholders live here. null URLs are intentionally NOT clickable.
export const destinations = [
  ["KW", "الكويت", "Kuwait"], ["SA", "السعودية", "Saudi Arabia"], ["AE", "الإمارات", "United Arab Emirates"],
  ["QA", "قطر", "Qatar"], ["BH", "البحرين", "Bahrain"], ["OM", "عُمان", "Oman"],
  ["SY", "سوريا", "Syria"], ["JO", "الأردن", "Jordan"], ["LB", "لبنان", "Lebanon"], ["IQ", "العراق", "Iraq"],
  ["PS", "فلسطين", "Palestine"], ["YE", "اليمن", "Yemen"], ["EG", "مصر", "Egypt"], ["SD", "السودان", "Sudan"],
  ["LY", "ليبيا", "Libya"], ["TN", "تونس", "Tunisia"], ["DZ", "الجزائر", "Algeria"], ["MA", "المغرب", "Morocco"],
  ["MR", "موريتانيا", "Mauritania"], ["SO", "الصومال", "Somalia"], ["DJ", "جيبوتي", "Djibouti"], ["KM", "جزر القمر", "Comoros"],
  ["TR", "تركيا", "Türkiye"], ["RU", "روسيا", "Russia"], ["RU-DA", "داغستان (روسيا)", "Dagestan (Russia)"], ["RU-CE", "الشيشان (روسيا)", "Chechnya (Russia)"],
].map(([code, ar, en]) => ({ code, name: l(ar, en), demoShipping: code === "KW" ? 2 : ["SA", "AE", "QA", "BH", "OM"].includes(code) ? 5 : 8 }));

export function shippingFor(code: string) {
  const destination = destinations.find(item => item.code === code);
  if (!destination) throw new Error("Unsupported shipping destination");
  return destination.demoShipping;
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
  partnershipResponse: l("كل تعاون يبدأ برسالة، ونرد خلال يومَي عمل", "Every collaboration starts with a message. We reply within two business days."),
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
