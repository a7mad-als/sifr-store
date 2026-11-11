import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

/**
 * Translation dictionaries. To add a language (e.g. Turkish 'tr' or Russian 'ru'):
 * 1. add a dictionary object of type Dict below, 2. register it in `dictionaries` and `languages`.
 * Book data from the API currently ships `ar` and `en`; other languages fall back to `en` via `pick()`.
 */
const ar = {
  brand: 'سِفْر',
  slogan: 'كتابٌ يفتح لك الطريق',
  'nav.home': 'الرئيسية', 'nav.books': 'الكتب', 'nav.categories': 'الأقسام', 'nav.institutions': 'المؤسسات', 'nav.contact': 'تواصل',
  'nav.search': 'ابحث', 'nav.favorites': 'المفضلة', 'nav.cart': 'السلة', 'nav.menu': 'القائمة', 'nav.lang': 'English',
  'hero.kicker': 'مكتبة إسلامية منتقاة — الكويت',
  'hero.title': 'رفوفٌ قليلة، واختيارٌ لا يُساوَم عليه.',
  'hero.body': 'نختار لك أمهات الكتب في الحديث والسيرة والعقيدة والتفسير والفقه واللغة — بطبعات موثّقة، مرتّبة بحسب مستواك، لطالب العلم والقارئ والمؤسسة.',
  'hero.browse': 'تصفّح الكتب', 'hero.bulk': 'طلبات المؤسسات بالجملة',
  'hero.stat1': 'عنوان منتقى', 'hero.stat2': 'أقسام علمية', 'hero.stat3': 'دول خليجية للتوصيل',
  'ben.title': 'لماذا سِفْر',
  'ben.1t': 'طبعات موثّقة', 'ben.1b': 'نختار طبعات محقّقة معروفة عند أهل العلم، ونذكر التجليد وعدد الصفحات لكل عنوان.',
  'ben.2t': 'توصيل خليجي', 'ben.2b': 'تقديرات تجريبية: الكويت ٢٫٠٠٠ د.ك، وبقية دول الخليج ٥٫٠٠٠ د.ك. لا نَعِد بمواعيد تسليم.',
  'ben.3t': 'دفع تجريبي آمن', 'ben.3b': 'المتجر في وضع العرض: لا تُطلب بيانات بطاقة ولا يُخصم أي مبلغ.',
  'best.kicker': 'مختارات', 'best.title': 'الأكثر طلبًا',
  'cat.kicker': 'الأقسام', 'cat.title': 'ابدأ من العلم الذي تحتاجه', 'cat.all': 'الكل',
  'c.hadith': 'الحديث', 'c.seerah': 'السيرة', 'c.language': 'اللغة العربية', 'c.terminology': 'المصطلح', 'c.aqeedah': 'العقيدة', 'c.tafsir': 'التفسير', 'c.fiqh': 'الفقه', 'c.tazkiyah': 'التزكية',
  'lv.beginner': 'مبتدئ', 'lv.intermediate': 'متوسط', 'lv.advanced': 'متقدم', 'lv.all': 'كل المستويات',
  'cat2.title': 'الفهرس الكامل', 'cat2.kicker': 'الكتب',
  'f.search': 'ابحث بالعنوان أو المؤلف', 'f.level': 'المستوى', 'f.sort': 'الترتيب', 'f.sortDefault': 'الترتيب الافتراضي', 'f.sortAsc': 'السعر: من الأقل', 'f.sortDesc': 'السعر: من الأعلى',
  'f.results': 'نتيجة', 'f.reset': 'إعادة الضبط', 'f.none': 'لا توجد كتب تطابق بحثك', 'f.noneBody': 'جرّب كلمة أخرى، أو أزل بعض عوامل التصفية.',
  'err.load': 'تعذّر تحميل الفهرس', 'err.retry': 'إعادة المحاولة', 'err.loadBody': 'حدث خطأ في الاتصال بالخادم.',
  'b.add': 'أضف للسلة', 'b.inCart': 'في السلة', 'b.quick': 'نظرة سريعة', 'b.fav': 'أضف للمفضلة', 'b.unfav': 'أزل من المفضلة',
  'b.pages': 'صفحة', 'b.binding': 'التجليد', 'b.level': 'المستوى', 'b.category': 'القسم', 'b.author': 'المؤلف', 'b.price': 'السعر', 'b.featured': 'مختار',
  'toast.added': 'أُضيف إلى السلة', 'toast.fav': 'أُضيف إلى المفضلة',
  'cart.title': 'سلة الكتب', 'cart.empty': 'السلة فارغة', 'cart.emptyBody': 'ابدأ بكتاب واحد — فالطريق يبدأ بخطوة.', 'cart.subtotal': 'المجموع الفرعي', 'cart.checkout': 'إتمام الطلب', 'cart.remove': 'إزالة', 'cart.shipNote': 'يُحتسب الشحن عند إتمام الطلب، ويعيد الخادم حساب الأسعار.', 'cart.inc': 'زيادة', 'cart.dec': 'إنقاص', 'cart.qty': 'الكمية',
  'fav.title': 'المفضلة', 'fav.empty': 'لا توجد كتب مفضلة بعد', 'fav.emptyBody': 'اضغط على رمز القلب لحفظ الكتب التي تنوي قراءتها.',
  'inst.kicker': 'للمؤسسات', 'inst.title': 'تجهيز مكتبات المساجد والمدارس والمراكز',
  'inst.body': 'للطلبات من عشر نسخ فأكثر. أرسل طلب تسعير وسنسجّله لديك برقم مرجعي.',
  'inst.p1': 'حدٌّ أدنى عشر نسخ', 'inst.p2': 'قوائم مقترحة بحسب المستوى', 'inst.p3': 'رقم مرجعي لكل طلب',
  'q.org': 'اسم المؤسسة', 'q.name': 'اسم المسؤول', 'q.email': 'البريد الإلكتروني', 'q.qty': 'عدد النسخ التقريبي', 'q.msg': 'تفاصيل الطلب', 'q.submit': 'أرسل طلب التسعير', 'q.sending': 'جارٍ الإرسال',
  'q.ok': 'سُجّل طلبك', 'q.ref': 'الرقم المرجعي', 'q.demo': 'طلب تجريبي محفوظ — لم يُربط إرسال البريد الإلكتروني بعد، لذا لن تصلك رسالة.', 'q.another': 'طلب جديد', 'q.err': 'تعذّر إرسال الطلب. حاول مجددًا.',
  'v.req': 'هذا الحقل مطلوب', 'v.min2': 'حرفان على الأقل', 'v.min5': 'خمسة أحرف على الأقل', 'v.email': 'بريد إلكتروني غير صالح', 'v.qty': 'الحد الأدنى عشر نسخ', 'v.phone': 'رقم هاتف غير صالح',
  'contact.kicker': 'تواصل', 'contact.title': 'اسأل قبل أن تشتري', 'contact.body': 'مساعد سِفْر يجيبك عن الكتب والمستويات والشحن التجريبي. للطلبات المؤسسية استخدم نموذج التسعير.', 'contact.ask': 'افتح المساعد', 'contact.quote': 'نموذج المؤسسات',
  'foot.about': 'مكتبة إسلامية منتقاة من الكويت لطلبة العلم والقراء والمؤسسات.', 'foot.shop': 'المتجر', 'foot.help': 'المساعدة', 'foot.demo': 'هذا متجر تجريبي — لا تتم أي عملية دفع حقيقية.', 'foot.rights': 'جميع الحقوق محفوظة',
  'co.title': 'إتمام الطلب', 'co.demo': 'وضع العرض التجريبي — لن يُخصم أي مبلغ، ولن تُطلب بيانات بطاقة.',
  'co.s1': 'التوصيل', 'co.s2': 'الدفع', 'co.s3': 'التأكيد', 'co.name': 'الاسم الكامل', 'co.email': 'البريد الإلكتروني', 'co.phone': 'رقم الهاتف', 'co.country': 'الدولة', 'co.city': 'المدينة', 'co.address': 'العنوان التفصيلي',
  'co.next': 'متابعة إلى الدفع', 'co.back': 'رجوع', 'co.place': 'تأكيد الطلب التجريبي', 'co.placing': 'جارٍ تسجيل الطلب', 'co.summary': 'ملخص الطلب', 'co.shipping': 'الشحن (تقدير تجريبي)', 'co.total': 'الإجمالي التقديري', 'co.serverNote': 'يعيد الخادم حساب الأسعار والشحن عند التأكيد.',
  'co.payTitle': 'اختر طريقة الدفع', 'co.payNote': 'اختيار رمزي فقط. لا توجد حقول بطاقة، ولا اتصال ببوابة دفع.', 'co.err': 'تعذّر تسجيل الطلب. لم تُفرَّغ سلتك — حاول مجددًا.', 'co.empty': 'سلتك فارغة', 'co.emptyBody': 'أضف كتبًا قبل إتمام الطلب.', 'co.toShop': 'العودة إلى المتجر',
  'pm.knet': 'كي نت', 'pm.knetD': 'بطاقات السحب الكويتية', 'pm.card': 'بطاقة ائتمان', 'pm.cardD': 'Visa / Mastercard', 'pm.myfatoorah': 'ماي فاتورة', 'pm.myfatoorahD': 'بوابة دفع خليجية', 'pm.stripe': 'Stripe', 'pm.stripeD': 'دفع دولي',
  'cty.KW': 'الكويت', 'cty.SA': 'السعودية', 'cty.AE': 'الإمارات', 'cty.QA': 'قطر', 'cty.BH': 'البحرين', 'cty.OM': 'عُمان',
  'cf.title': 'شكرًا لك — سُجّل طلبك', 'cf.number': 'رقم الطلب', 'cf.subtotal': 'المجموع الفرعي', 'cf.shipping': 'الشحن', 'cf.total': 'الإجمالي', 'cf.demo': 'طلب تجريبي: لم يُخصم أي مبلغ ولن يُشحن أي كتاب.', 'cf.method': 'طريقة الدفع المختارة', 'cf.none': 'لا يوجد إيصال طلب محفوظ', 'cf.noneBody': 'يظهر الإيصال هنا بعد إتمام طلب.', 'cf.continue': 'متابعة التصفح',
  'ai.title': 'مساعد سِفْر', 'ai.open': 'افتح المساعد', 'ai.close': 'أغلق المساعد', 'ai.welcome': 'السلام عليكم. أساعدك في اختيار الكتب المناسبة لمستواك، ومعلومات الفهرس والشحن التجريبي. لا أُصدر فتاوى — للمسائل الشرعية ارجع إلى أهل العلم.',
  'ai.ph': 'اكتب سؤالك عن كتاب أو مستوى', 'ai.send': 'إرسال', 'ai.pending': 'يكتب الآن', 'ai.err': 'تعذّر الحصول على رد. حاول مجددًا.', 'ai.retry': 'إعادة الإرسال', 'ai.clear': 'محادثة جديدة',
  'nf.title': 'هذه الصفحة غير موجودة', 'common.close': 'إغلاق', 'currency': 'د.ك',
};
type Dict = Record<keyof typeof ar, string>;

const en: Dict = {
  brand: 'Sifr',
  slogan: 'A book that opens the way',
  'nav.home': 'Home', 'nav.books': 'Books', 'nav.categories': 'Categories', 'nav.institutions': 'Institutions', 'nav.contact': 'Contact',
  'nav.search': 'Search', 'nav.favorites': 'Favourites', 'nav.cart': 'Cart', 'nav.menu': 'Menu', 'nav.lang': 'العربية',
  'hero.kicker': 'A curated Islamic bookshop — Kuwait',
  'hero.title': 'Few shelves. Uncompromising choices.',
  'hero.body': 'Foundational works in hadith, seerah, creed, tafsir, fiqh and Arabic — in verified editions, ordered by level, for students, readers and institutions.',
  'hero.browse': 'Browse the books', 'hero.bulk': 'Institutional bulk orders',
  'hero.stat1': 'curated titles', 'hero.stat2': 'disciplines', 'hero.stat3': 'Gulf delivery countries',
  'ben.title': 'Why Sifr',
  'ben.1t': 'Verified editions', 'ben.1b': 'We choose well-known critical editions and list binding and page count for every title.',
  'ben.2t': 'Gulf delivery', 'ben.2b': 'Demo estimates: Kuwait 2.000 KWD, other Gulf states 5.000 KWD. No delivery-time promises.',
  'ben.3t': 'Secure demo payment', 'ben.3b': 'The shop runs in demo mode: no card details are requested and nothing is charged.',
  'best.kicker': 'Selections', 'best.title': 'Bestsellers',
  'cat.kicker': 'Categories', 'cat.title': 'Start from the discipline you need', 'cat.all': 'All',
  'c.hadith': 'Hadith', 'c.seerah': 'Seerah', 'c.language': 'Arabic Language', 'c.terminology': 'Hadith Terminology', 'c.aqeedah': 'Creed', 'c.tafsir': 'Tafsir', 'c.fiqh': 'Fiqh', 'c.tazkiyah': 'Tazkiyah',
  'lv.beginner': 'Beginner', 'lv.intermediate': 'Intermediate', 'lv.advanced': 'Advanced', 'lv.all': 'All levels',
  'cat2.title': 'The full catalogue', 'cat2.kicker': 'Books',
  'f.search': 'Search by title or author', 'f.level': 'Level', 'f.sort': 'Sort', 'f.sortDefault': 'Default order', 'f.sortAsc': 'Price: low to high', 'f.sortDesc': 'Price: high to low',
  'f.results': 'results', 'f.reset': 'Reset filters', 'f.none': 'No books match your search', 'f.noneBody': 'Try another word, or remove some filters.',
  'err.load': 'Could not load the catalogue', 'err.retry': 'Try again', 'err.loadBody': 'There was a problem reaching the server.',
  'b.add': 'Add to cart', 'b.inCart': 'In cart', 'b.quick': 'Quick view', 'b.fav': 'Add to favourites', 'b.unfav': 'Remove from favourites',
  'b.pages': 'pages', 'b.binding': 'Binding', 'b.level': 'Level', 'b.category': 'Category', 'b.author': 'Author', 'b.price': 'Price', 'b.featured': 'Selected',
  'toast.added': 'Added to cart', 'toast.fav': 'Added to favourites',
  'cart.title': 'Your cart', 'cart.empty': 'Your cart is empty', 'cart.emptyBody': 'Begin with a single book — every path starts with one step.', 'cart.subtotal': 'Subtotal', 'cart.checkout': 'Checkout', 'cart.remove': 'Remove', 'cart.shipNote': 'Shipping is added at checkout; the server recalculates all prices.', 'cart.inc': 'Increase', 'cart.dec': 'Decrease', 'cart.qty': 'Quantity',
  'fav.title': 'Favourites', 'fav.empty': 'No favourites yet', 'fav.emptyBody': 'Tap the heart on any book to keep it for later.',
  'inst.kicker': 'Institutions', 'inst.title': 'Stocking mosque, school and centre libraries',
  'inst.body': 'For orders of ten copies or more. Send a quotation request and we will record it with a reference number.',
  'inst.p1': 'Minimum ten copies', 'inst.p2': 'Level-based suggested lists', 'inst.p3': 'A reference for every request',
  'q.org': 'Organisation', 'q.name': 'Contact name', 'q.email': 'Email', 'q.qty': 'Approximate copies', 'q.msg': 'Request details', 'q.submit': 'Request a quotation', 'q.sending': 'Sending',
  'q.ok': 'Your request is recorded', 'q.ref': 'Reference', 'q.demo': 'Saved demo request — email delivery is not connected yet, so no message will be sent.', 'q.another': 'New request', 'q.err': 'Could not send the request. Please try again.',
  'v.req': 'This field is required', 'v.min2': 'At least 2 characters', 'v.min5': 'At least 5 characters', 'v.email': 'Invalid email address', 'v.qty': 'Minimum is ten copies', 'v.phone': 'Invalid phone number',
  'contact.kicker': 'Contact', 'contact.title': 'Ask before you buy', 'contact.body': 'The Sifr assistant answers questions about books, levels and demo shipping. For institutional orders, use the quotation form.', 'contact.ask': 'Open the assistant', 'contact.quote': 'Institution form',
  'foot.about': 'A curated Islamic bookshop from Kuwait for students, readers and institutions.', 'foot.shop': 'Shop', 'foot.help': 'Help', 'foot.demo': 'This is a demo shop — no real payments take place.', 'foot.rights': 'All rights reserved',
  'co.title': 'Checkout', 'co.demo': 'DEMO MODE — nothing will be charged and no card details are requested.',
  'co.s1': 'Delivery', 'co.s2': 'Payment', 'co.s3': 'Confirmation', 'co.name': 'Full name', 'co.email': 'Email', 'co.phone': 'Phone', 'co.country': 'Country', 'co.city': 'City', 'co.address': 'Full address',
  'co.next': 'Continue to payment', 'co.back': 'Back', 'co.place': 'Place demo order', 'co.placing': 'Recording order', 'co.summary': 'Order summary', 'co.shipping': 'Shipping (demo estimate)', 'co.total': 'Estimated total', 'co.serverNote': 'The server recalculates prices and shipping on confirmation.',
  'co.payTitle': 'Choose a payment method', 'co.payNote': 'Symbolic selection only. No card fields and no gateway connection.', 'co.err': 'Could not record the order. Your cart is kept — please try again.', 'co.empty': 'Your cart is empty', 'co.emptyBody': 'Add some books before checking out.', 'co.toShop': 'Back to the shop',
  'pm.knet': 'KNET', 'pm.knetD': 'Kuwaiti debit cards', 'pm.card': 'Credit card', 'pm.cardD': 'Visa / Mastercard', 'pm.myfatoorah': 'MyFatoorah', 'pm.myfatoorahD': 'Gulf payment gateway', 'pm.stripe': 'Stripe', 'pm.stripeD': 'International payments',
  'cty.KW': 'Kuwait', 'cty.SA': 'Saudi Arabia', 'cty.AE': 'United Arab Emirates', 'cty.QA': 'Qatar', 'cty.BH': 'Bahrain', 'cty.OM': 'Oman',
  'cf.title': 'Thank you — your order is recorded', 'cf.number': 'Order number', 'cf.subtotal': 'Subtotal', 'cf.shipping': 'Shipping', 'cf.total': 'Total', 'cf.demo': 'Demo order: nothing was charged and no book will ship.', 'cf.method': 'Selected payment method', 'cf.none': 'No saved order receipt', 'cf.noneBody': 'A receipt appears here after you place an order.', 'cf.continue': 'Continue browsing',
  'ai.title': 'Sifr assistant', 'ai.open': 'Open assistant', 'ai.close': 'Close assistant', 'ai.welcome': 'Peace be upon you. I can help you choose books suited to your level, and answer catalogue and demo-shipping questions. I do not give fatwas — for religious rulings, please consult qualified scholars.',
  'ai.ph': 'Ask about a book or a level', 'ai.send': 'Send', 'ai.pending': 'Writing', 'ai.err': 'Could not get a reply. Please try again.', 'ai.retry': 'Resend', 'ai.clear': 'New chat',
  'nf.title': 'This page does not exist', 'common.close': 'Close', 'currency': 'KWD',
};

export const dictionaries = { ar, en } satisfies Record<string, Dict>;
export type Lang = keyof typeof dictionaries;
export type TKey = keyof Dict;
export const languages: { code: Lang; dir: 'rtl' | 'ltr'; label: string }[] = [
  { code: 'ar', dir: 'rtl', label: 'العربية' },
  { code: 'en', dir: 'ltr', label: 'English' },
];

const KEY = 'sifr.lang';
type Ctx = { lang: Lang; dir: 'rtl' | 'ltr'; t: (k: TKey) => string; setLang: (l: Lang) => void; toggle: () => void; pick: (v: { ar: string; en: string }) => string };
const I18nCtx = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const requested = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('lang') : null;
    if (requested && requested in dictionaries) return requested as Lang;
    const s = typeof window !== 'undefined' ? localStorage.getItem(KEY) : null;
    return s && s in dictionaries ? (s as Lang) : 'ar';
  });
  const dir = languages.find((l) => l.code === lang)?.dir ?? 'rtl';
  useEffect(() => {
    localStorage.setItem(KEY, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    document.title = lang === 'ar' ? 'سِفْر | مكتبة إسلامية منتقاة في الكويت' : 'Sifr | A curated Islamic bookshop in Kuwait';
  }, [lang, dir]);
  const value: Ctx = {
    lang, dir, setLang,
    toggle: () => setLang((l) => (l === 'ar' ? 'en' : 'ar')),
    t: (k) => dictionaries[lang][k] ?? dictionaries.en[k] ?? k,
    pick: (v) => (v as Record<string, string>)[lang] ?? v.en,
  };
  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const c = useContext(I18nCtx);
  if (!c) throw new Error('useI18n outside provider');
  return c;
}

export function formatKWD(n: number, lang: Lang) {
  const num = new Intl.NumberFormat(lang === 'ar' ? 'ar-KW' : 'en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(n);
  return lang === 'ar' ? `${num} د.ك` : `${num} KWD`;
}

export function formatNum(n: number, lang: Lang) {
  return new Intl.NumberFormat(lang === 'ar' ? 'ar-KW' : 'en-US').format(n);
}

/** Arabic-aware normalisation for search: strips diacritics/tatweel, unifies alef/ya/ta marbuta. */
export function normalize(s: string) {
  return s
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/\s+/g, ' ')
    .trim();
}
