import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

/**
 * Translation dictionaries. To add a language (e.g. Turkish 'tr' or Russian 'ru'):
 * 1. add a dictionary object of type Dict below, 2. register it in `dictionaries` and `languages`.
 * Book data from the API currently ships `ar` and `en`; other languages fall back to `en` via `pick()`.
 */
const ar = {
  brand: 'سِفْر',
  slogan: 'كتابٌ يفتح لك الطريق',
  'nav.home': 'الرئيسية', 'nav.books': 'الكتب', 'nav.categories': 'الأقسام', 'nav.contact': 'تواصل',
  'nav.search': 'ابحث', 'nav.favorites': 'المفضلة', 'nav.cart': 'السلة', 'nav.menu': 'القائمة', 'nav.lang': 'English',
  'hero.kicker': 'مكتبة إسلامية منتقاة — الكويت',
  'hero.title': 'رفوفٌ قليلة، واختيارٌ لا يُساوَم عليه.',
  'hero.body': 'نختار لك أمهات الكتب في الحديث والسيرة والعقيدة والتفسير والفقه واللغة، مرتّبة بحسب مستواك. من الكويت إلى الوطن العربي وتركيا وروسيا، بما فيها داغستان والشيشان — الشحن والأسعار في هذه النسخة تجريبية.',
  'hero.browse': 'تصفّح الكتب',   'hero.stat1': 'عنوان منتقى', 'hero.stat2': 'أقسام علمية',   'ben.title': 'لماذا سِفْر',
  'ben.1t': 'طبعات موثّقة', 'ben.1b': 'نختار طبعات محقّقة معروفة عند أهل العلم، ونذكر التجليد وعدد الصفحات لكل عنوان.',
    'ben.3t': 'دفع تجريبي آمن', 'ben.3b': 'المتجر في وضع العرض: لا تُطلب بيانات بطاقة ولا يُخصم أي مبلغ.',
  'best.kicker': 'مختارات', 'best.title': 'الأكثر طلبًا',
  'cat.kicker': 'الأقسام', 'cat.title': 'ابدأ من العلم الذي تحتاجه', 'cat.all': 'الكل',
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
  'v.req': 'هذا الحقل مطلوب', 'v.min2': 'حرفان على الأقل', 'v.min5': 'خمسة أحرف على الأقل', 'v.email': 'بريد إلكتروني غير صالح', 'v.phone': 'رقم هاتف غير صالح',
  'contact.kicker': 'تواصل', 'contact.title': 'اسأل قبل أن تشتري', 'contact.ask': 'افتح المساعد',   'foot.about': 'مكتبة إسلامية منتقاة من الكويت لطلبة العلم والقراء والمؤسسات.', 'foot.shop': 'المتجر', 'foot.help': 'المساعدة', 'foot.demo': 'هذا متجر تجريبي — لا تتم أي عملية دفع حقيقية.', 'foot.rights': 'جميع الحقوق محفوظة',
  'co.title': 'إتمام الطلب', 'co.demo': 'وضع العرض التجريبي — لن يُخصم أي مبلغ، ولن تُطلب بيانات بطاقة.',
  'co.s1': 'التوصيل', 'co.s2': 'الدفع', 'co.s3': 'التأكيد', 'co.name': 'الاسم الكامل', 'co.email': 'البريد الإلكتروني', 'co.phone': 'رقم الهاتف', 'co.country': 'الدولة', 'co.city': 'المدينة', 'co.address': 'العنوان التفصيلي',
  'co.next': 'متابعة إلى الدفع', 'co.back': 'رجوع', 'co.place': 'تأكيد الطلب التجريبي', 'co.placing': 'جارٍ تسجيل الطلب', 'co.summary': 'ملخص الطلب', 'co.shipping': 'الشحن (تقدير تجريبي)', 'co.total': 'الإجمالي التقديري', 'co.serverNote': 'يعيد الخادم حساب الأسعار والشحن عند التأكيد.',
  'co.payTitle': 'اختر طريقة الدفع', 'co.payNote': 'اختيار رمزي فقط. لا توجد حقول بطاقة، ولا اتصال ببوابة دفع.', 'co.err': 'تعذّر تسجيل الطلب. لم تُفرَّغ سلتك — حاول مجددًا.', 'co.empty': 'سلتك فارغة', 'co.emptyBody': 'أضف كتبًا قبل إتمام الطلب.', 'co.toShop': 'العودة إلى المتجر',
  'pm.knet': 'كي نت', 'pm.knetD': 'بطاقات السحب الكويتية', 'pm.card': 'بطاقة ائتمان', 'pm.cardD': 'Visa / Mastercard', 'pm.myfatoorah': 'ماي فاتورة', 'pm.myfatoorahD': 'بوابة دفع خليجية', 'pm.stripe': 'Stripe', 'pm.stripeD': 'دفع دولي',
  'cf.title': 'شكرًا لك — سُجّل طلبك', 'cf.number': 'رقم الطلب', 'cf.subtotal': 'المجموع الفرعي', 'cf.shipping': 'الشحن', 'cf.total': 'الإجمالي', 'cf.demo': 'طلب تجريبي: لم يُخصم أي مبلغ ولن يُشحن أي كتاب.', 'cf.method': 'طريقة الدفع المختارة', 'cf.none': 'لا يوجد إيصال طلب محفوظ', 'cf.noneBody': 'يظهر الإيصال هنا بعد إتمام طلب.', 'cf.continue': 'متابعة التصفح',
  'ai.title': 'مساعد سِفْر', 'ai.open': 'افتح المساعد', 'ai.close': 'أغلق المساعد', 'ai.welcome': 'السلام عليكم. أساعدك في اختيار الكتب المناسبة لمستواك، ومعلومات الفهرس والشحن التجريبي. لا أُصدر فتاوى — للمسائل الشرعية ارجع إلى أهل العلم.',
  'ai.ph': 'اكتب سؤالك عن كتاب أو مستوى', 'ai.send': 'إرسال', 'ai.pending': 'يكتب الآن', 'ai.err': 'تعذّر الحصول على رد. حاول مجددًا.', 'ai.retry': 'إعادة الإرسال', 'ai.clear': 'محادثة جديدة',
  'nav.partners': 'الشراكات',
  'hero.bulk': 'كن شريكًا لسِفْر',
  'hero.stat3': 'وجهة شحن',
  'ben.2t': 'نشحن إلى العالم العربي وما بعده',
  'ben.2b': 'تقديرات تجريبية: الكويت ٢٫٠٠٠ د.ك، ودول الخليج ٥٫٠٠٠ د.ك، وبقية الوجهات ٨٫٠٠٠ د.ك. لا شحن فعلي ولا وعود بمواعيد.',
  'contact.body': 'مساعد سِفْر يجيبك عن الكتب والمستويات والشحن التجريبي. للتعاون مع المكتبات والناشرين والجهات استخدم نموذج الشراكة.',
  'contact.quote': 'نموذج الشراكة',
  'cat.empty': 'قريبًا',
  'cat.titles': 'عنوان',
  'cat.subs': 'فروع',
  'f.category': 'القسم',
  'f.sub': 'الفرع',
  'f.allSubs': 'كل الفروع',
  'f.author': 'المؤلف',
  'f.allAuthors': 'كل المؤلفين',
  'f.publisher': 'دار النشر',
  'f.allPublishers': 'كل الناشرين',
  'f.price': 'نطاق السعر (د.ك)',
  'f.min': 'الحد الأدنى',
  'f.max': 'الحد الأعلى',
  'f.open': 'عوامل التصفية',
  'f.apply': 'عرض النتائج',
  'f.title': 'تصفية الفهرس',
  'f.priceErr': 'الحد الأدنى أكبر من الأعلى',
  'b.publisher': 'دار النشر',
  'b.volumes': 'المجلدات',
  'b.vols': 'مجلدات',
  'b.tbd': 'يُحدَّد لاحقًا',
  'b.provisional': 'بيانات أولية — قيد التحقق',
  'b.demo': 'عنوان تجريبي',
  'b.demoPrice': 'سعر تجريبي',
  'b.subcategory': 'الفرع',
  'b.unknown': 'غير محدد بعد',
  'feat.kicker': 'إصدار خاص',
  'feat.multi': 'متعدد المجلدات',
  'feat.body': 'شرحٌ متعدد المجلدات على صحيح الإمام البخاري. المؤلف والناشر لم يُحدَّدا بعد، وعدد المجلدات والصفحات قيد التحقق — نعرضه بشفافية كما هو.',
  'feat.view': 'تفاصيل الإصدار',
  'feat.pending': 'لم يُحدَّد بعد',
  'taqwa.kicker': 'دار التقوى',
  'taqwa.title': 'عناوين دار التقوى — قائمة تجريبية',
  'taqwa.body': 'أربعة عناوين معروضة لأغراض العرض فقط. العناوين والبيانات أولية، وليست طبعات مؤكَّدة من الدار، والأسعار تجريبية.',
  'ship.kicker': 'نشحن إلى',
  'ship.title': 'من الكويت إلى قرّاء العربية',
  'ship.kw': 'الكويت',
  'ship.gulf': 'دول الخليج',
  'ship.other': 'بقية الوجهات',
  'ship.count': 'وجهة',
  'ship.note': 'أسعار شحن تجريبية للعرض فقط — لا يتم أي شحن فعلي ولا نَعِد بمواعيد تسليم. داغستان والشيشان جمهوريتان ضمن روسيا الاتحادية، وتُذكران هنا كمناطق شحن لا كدول مستقلة.',
  'p.kicker': 'شركاء سِفْر',
  'p.title': 'الكتاب يصل أبعد حين نحمله معًا',
  'p.body': 'ستة مسارات للتعاون، ونموذج واحد يفهم ما تحتاجه. اختر مسارك وسيُهيَّأ النموذج لك.',
  'p.cta': 'تواصل بخصوص هذا المسار',
  'p.formTitle': 'ابدأ التعاون',
  'p.entity': 'نوع الجهة',
  'p.name': 'الاسم أو اسم الجهة',
  'p.country': 'الدولة',
  'p.other': 'دولة أخرى',
  'p.countryOther': 'اكتب اسم الدولة',
  'p.method': 'وسيلة التواصل المفضلة',
  'p.contact': 'بيانات التواصل',
  'p.coop': 'نوع التعاون',
  'p.msg': 'رسالتك',
  'p.submit': 'احفظ الطلب',
  'p.sending': 'جارٍ الحفظ',
  'p.ok': 'حُفظت رسالتك',
  'p.ref': 'الرقم المرجعي',
  'p.another': 'رسالة جديدة',
  'p.err': 'تعذّر حفظ الطلب. حاول مجددًا.',
  'p.choose': 'اختر',
  'p.demo': 'طلب تجريبي محفوظ لدينا. لم يُربط الإرسال الخارجي (البريد أو واتساب) بعد، فلن تصلك رسالة تلقائية. مدة الرد المذكورة تصف الخدمة المقصودة عند التشغيل الفعلي.',
  'cm.email': 'البريد الإلكتروني',
  'cm.whatsapp': 'واتساب',
  'cm.phone': 'الهاتف',
  'foot.aboutT': 'من نحن',
  'foot.quick': 'روابط سريعة',
  'foot.service': 'خدمة العملاء',
  'foot.contact': 'تواصل معنا',
  'foot.temp': 'بيانات مؤقتة — غير مفعّلة بعد',
  'foot.social': 'حساباتنا',
  'foot.soon': 'غير متاح بعد',
  'foot.news': 'النشرة البريدية',
  'foot.newsBody': 'يُحفظ بريدك في قائمة النشرة فقط. الإرسال البريدي غير مفعّل بعد، فلن تصلك رسائل حاليًا.',
  'foot.consent': 'أوافق على حفظ بريدي لغرض النشرة',
  'foot.subscribe': 'اشترك',
  'foot.saving': 'جارٍ الحفظ',
  'foot.saved': 'حُفظ بريدك. لن تصلك رسائل حتى يُفعَّل الإرسال.',
  'foot.newsErr': 'تعذّر الحفظ. حاول مجددًا.',
  'foot.consentReq': 'يلزم الموافقة على الحفظ',
  'foot.pay': 'وسائل الدفع (عرض تجريبي)',
  'help.kicker': 'مركز المساعدة',
  'help.draft': 'مسودة غير نهائية — نص توضيحي لمتجر تجريبي وليس سياسة معتمدة.',
  'help.back': 'العودة إلى الرئيسية',
  'help.unknown': 'لا توجد صفحة مساعدة بهذا العنوان',
  'help.others': 'صفحات أخرى',
  'help.shipping': 'نعرض أسعار شحن تجريبية: الكويت ٢٫٠٠٠ د.ك، ودول الخليج ٥٫٠٠٠ د.ك، وبقية الوجهات ٨٫٠٠٠ د.ك.\nالمتجر في وضع العرض، فلا يُشحن أي كتاب ولا نقدّم مواعيد تسليم.\nيعيد الخادم حساب الشحن عند تسجيل الطلب التجريبي.',
  'help.returns': 'لم تُعتمد سياسة استبدال أو استرجاع بعد، ولا نحدد مُددًا أو شروطًا في هذه المرحلة.\nبما أن الطلبات تجريبية ولا يُشحن شيء، فلا يوجد ما يُسترجع حاليًا.',
  'help.payments': 'تظهر في صفحة الدفع خيارات رمزية: كي نت، والبطاقات، وماي فاتورة، وStripe.\nلا يوجد اتصال ببوابة دفع، ولا تُطلب بيانات بطاقة، ولا يُخصم أي مبلغ.',
  'help.faq': 'هل الطلبات حقيقية؟ لا، كل الطلبات تجريبية ولا يُشحن شيء.\nهل الأسعار نهائية؟ لا، كل الأسعار تجريبية.\nهل مساعد سِفْر يُفتي؟ لا، يساعد في اختيار الكتب فقط.\nكيف أتواصل للشراكات؟ عبر نموذج شركاء سِفْر في الصفحة الرئيسية.',
  'help.privacy': 'تُحفظ على خادمنا: الطلبات التجريبية، ورسائل الشراكة، واشتراكات النشرة.\nتُحفظ في متصفحك فقط: السلة والمفضلة واللغة وآخر إيصال طلب.\nأسئلة مساعد سِفْر تُرسل إلى مزوّد خدمة ذكاء اصطناعي خارجي لتوليد الرد.\nلا نجمع أي بيانات بنكية أو بيانات بطاقات.',
  'help.terms': 'هذا متجر تجريبي لأغراض العرض. الأسعار والعناوين وبيانات الشحن قابلة للتغيير، وبعض البيانات أولية.\nلا تُنشئ الطلبات أي التزام بالبيع أو الشحن.',
  'help.tracking': 'لا يوجد تتبع شحن حي، لأن الطلبات تجريبية ولا تُسلَّم لشركة شحن.\nنعرض هنا آخر إيصال طلب تجريبي محفوظ في هذا المتصفح فقط.',
  'help.trkNone': 'لا يوجد إيصال طلب محفوظ في هذا المتصفح.',
  'help.trkStatus': 'الحالة: طلب تجريبي مسجَّل — لم يُشحن',
  'nf.title': 'هذه الصفحة غير موجودة', 'common.close': 'إغلاق', 'currency': 'د.ك',
};
type Dict = Record<keyof typeof ar, string>;

const en: Dict = {
  brand: 'Sifr',
  slogan: 'A book that opens the way',
  'nav.home': 'Home', 'nav.books': 'Books', 'nav.categories': 'Categories', 'nav.contact': 'Contact',
  'nav.search': 'Search', 'nav.favorites': 'Favourites', 'nav.cart': 'Cart', 'nav.menu': 'Menu', 'nav.lang': 'العربية',
  'hero.kicker': 'A curated Islamic bookshop — Kuwait',
  'hero.title': 'Few shelves. Uncompromising choices.',
  'hero.body': 'Foundational works in hadith, seerah, creed, tafsir, fiqh and Arabic, selected by study level. From Kuwait to the Arab world, Türkiye and Russia, including Dagestan and Chechnya — shipping and prices in this version are illustrative.',
  'hero.browse': 'Browse the books',   'hero.stat1': 'curated titles', 'hero.stat2': 'disciplines',   'ben.title': 'Why Sifr',
  'ben.1t': 'Verified editions', 'ben.1b': 'We choose well-known critical editions and list binding and page count for every title.',
    'ben.3t': 'Secure demo payment', 'ben.3b': 'The shop runs in demo mode: no card details are requested and nothing is charged.',
  'best.kicker': 'Selections', 'best.title': 'Bestsellers',
  'cat.kicker': 'Categories', 'cat.title': 'Start from the discipline you need', 'cat.all': 'All',
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
  'v.req': 'This field is required', 'v.min2': 'At least 2 characters', 'v.min5': 'At least 5 characters', 'v.email': 'Invalid email address', 'v.phone': 'Invalid phone number',
  'contact.kicker': 'Contact', 'contact.title': 'Ask before you buy', 'contact.ask': 'Open the assistant',   'foot.about': 'A curated Islamic bookshop from Kuwait for students, readers and institutions.', 'foot.shop': 'Shop', 'foot.help': 'Help', 'foot.demo': 'This is a demo shop — no real payments take place.', 'foot.rights': 'All rights reserved',
  'co.title': 'Checkout', 'co.demo': 'DEMO MODE — nothing will be charged and no card details are requested.',
  'co.s1': 'Delivery', 'co.s2': 'Payment', 'co.s3': 'Confirmation', 'co.name': 'Full name', 'co.email': 'Email', 'co.phone': 'Phone', 'co.country': 'Country', 'co.city': 'City', 'co.address': 'Full address',
  'co.next': 'Continue to payment', 'co.back': 'Back', 'co.place': 'Place demo order', 'co.placing': 'Recording order', 'co.summary': 'Order summary', 'co.shipping': 'Shipping (demo estimate)', 'co.total': 'Estimated total', 'co.serverNote': 'The server recalculates prices and shipping on confirmation.',
  'co.payTitle': 'Choose a payment method', 'co.payNote': 'Symbolic selection only. No card fields and no gateway connection.', 'co.err': 'Could not record the order. Your cart is kept — please try again.', 'co.empty': 'Your cart is empty', 'co.emptyBody': 'Add some books before checking out.', 'co.toShop': 'Back to the shop',
  'pm.knet': 'KNET', 'pm.knetD': 'Kuwaiti debit cards', 'pm.card': 'Credit card', 'pm.cardD': 'Visa / Mastercard', 'pm.myfatoorah': 'MyFatoorah', 'pm.myfatoorahD': 'Gulf payment gateway', 'pm.stripe': 'Stripe', 'pm.stripeD': 'International payments',
  'cf.title': 'Thank you — your order is recorded', 'cf.number': 'Order number', 'cf.subtotal': 'Subtotal', 'cf.shipping': 'Shipping', 'cf.total': 'Total', 'cf.demo': 'Demo order: nothing was charged and no book will ship.', 'cf.method': 'Selected payment method', 'cf.none': 'No saved order receipt', 'cf.noneBody': 'A receipt appears here after you place an order.', 'cf.continue': 'Continue browsing',
  'ai.title': 'Sifr assistant', 'ai.open': 'Open assistant', 'ai.close': 'Close assistant', 'ai.welcome': 'Peace be upon you. I can help you choose books suited to your level, and answer catalogue and demo-shipping questions. I do not give fatwas — for religious rulings, please consult qualified scholars.',
  'ai.ph': 'Ask about a book or a level', 'ai.send': 'Send', 'ai.pending': 'Writing', 'ai.err': 'Could not get a reply. Please try again.', 'ai.retry': 'Resend', 'ai.clear': 'New chat',
  'nav.partners': 'Partnerships',
  'hero.bulk': 'Partner with Sifr',
  'hero.stat3': 'shipping destinations',
  'ben.2t': 'Shipping across the Arab world and beyond',
  'ben.2b': 'Demo estimates: Kuwait 2.000 KWD, Gulf states 5.000 KWD, all other destinations 8.000 KWD. No real dispatch, no delivery promises.',
  'contact.body': 'The Sifr assistant answers questions about books, levels and demo shipping. For bookshops, publishers and institutions, use the partnership form.',
  'contact.quote': 'Partnership form',
  'cat.empty': 'Coming soon',
  'cat.titles': 'titles',
  'cat.subs': 'branches',
  'f.category': 'Category',
  'f.sub': 'Branch',
  'f.allSubs': 'All branches',
  'f.author': 'Author',
  'f.allAuthors': 'All authors',
  'f.publisher': 'Publisher',
  'f.allPublishers': 'All publishers',
  'f.price': 'Price range (KWD)',
  'f.min': 'Minimum',
  'f.max': 'Maximum',
  'f.open': 'Filters',
  'f.apply': 'Show results',
  'f.title': 'Filter the catalogue',
  'f.priceErr': 'Minimum is above maximum',
  'b.publisher': 'Publisher',
  'b.volumes': 'Volumes',
  'b.vols': 'vols',
  'b.tbd': 'TBD',
  'b.provisional': 'Provisional details — being verified',
  'b.demo': 'Demo listing',
  'b.demoPrice': 'Demo price',
  'b.subcategory': 'Branch',
  'b.unknown': 'Not yet specified',
  'feat.kicker': 'Special release',
  'feat.multi': 'Multi-volume',
  'feat.body': 'A multi-volume commentary on Sahih al-Bukhari. Author and publisher are not yet specified, and the volume and page counts are being verified — shown honestly as they stand.',
  'feat.view': 'Release details',
  'feat.pending': 'Not yet specified',
  'taqwa.kicker': 'Dar al-Taqwa',
  'taqwa.title': 'Dar al-Taqwa — demo listings',
  'taqwa.body': 'Four titles shown for demonstration only. Titles and details are provisional, not confirmed editions from the publisher, and prices are demo.',
  'ship.kicker': 'We ship to',
  'ship.title': 'From Kuwait to Arabic readers',
  'ship.kw': 'Kuwait',
  'ship.gulf': 'Gulf states',
  'ship.other': 'All other destinations',
  'ship.count': 'destinations',
  'ship.note': 'Demo shipping rates for display only — nothing is actually dispatched and no delivery times are promised. Dagestan and Chechnya are republics within the Russian Federation, listed as shipping regions, not independent countries.',
  'p.kicker': 'Sifr Partners',
  'p.title': 'Books travel further when we carry them together',
  'p.body': 'Six tracks for collaboration, one form that adapts to you. Pick a track and the form is prepared for it.',
  'p.cta': 'Get in touch about this track',
  'p.formTitle': 'Start a collaboration',
  'p.entity': 'Organisation type',
  'p.name': 'Your name or organisation',
  'p.country': 'Country',
  'p.other': 'Other country',
  'p.countryOther': 'Type the country name',
  'p.method': 'Preferred contact method',
  'p.contact': 'Contact details',
  'p.coop': 'Type of collaboration',
  'p.msg': 'Your message',
  'p.submit': 'Save request',
  'p.sending': 'Saving',
  'p.ok': 'Your message is saved',
  'p.ref': 'Reference',
  'p.another': 'New message',
  'p.err': 'Could not save the request. Please try again.',
  'p.choose': 'Choose',
  'p.demo': 'Saved demo request. External delivery (email or WhatsApp) is not connected yet, so you will not receive an automatic message. The response time describes the intended service once live.',
  'cm.email': 'Email',
  'cm.whatsapp': 'WhatsApp',
  'cm.phone': 'Phone',
  'foot.aboutT': 'About us',
  'foot.quick': 'Quick links',
  'foot.service': 'Customer service',
  'foot.contact': 'Contact',
  'foot.temp': 'Temporary details — not live yet',
  'foot.social': 'Our accounts',
  'foot.soon': 'Not yet available',
  'foot.news': 'Newsletter',
  'foot.newsBody': 'Your email is only saved to the newsletter list. Email delivery is not connected yet, so you will not receive messages for now.',
  'foot.consent': 'I agree to my email being saved for the newsletter',
  'foot.subscribe': 'Subscribe',
  'foot.saving': 'Saving',
  'foot.saved': 'Your email is saved. No messages will be sent until delivery is connected.',
  'foot.newsErr': 'Could not save. Please try again.',
  'foot.consentReq': 'Consent is required',
  'foot.pay': 'Payment methods (demo)',
  'help.kicker': 'Help centre',
  'help.draft': 'Draft, not final — explanatory text for a demo shop, not an adopted policy.',
  'help.back': 'Back to home',
  'help.unknown': 'No help page with this name',
  'help.others': 'Other pages',
  'help.shipping': 'We show demo shipping rates: Kuwait 2.000 KWD, Gulf states 5.000 KWD, all other destinations 8.000 KWD.\nThe shop is in demo mode: no book is dispatched and no delivery times are offered.\nThe server recalculates shipping when a demo order is recorded.',
  'help.returns': 'No exchange or returns policy has been adopted yet, and no periods or conditions are set at this stage.\nSince orders are demo-only and nothing ships, there is nothing to return for now.',
  'help.payments': 'Checkout shows symbolic options: KNET, cards, MyFatoorah and Stripe.\nThere is no gateway connection, no card details are requested, and nothing is charged.',
  'help.faq': 'Are orders real? No, all orders are demo and nothing ships.\nAre prices final? No, all prices are demo.\nDoes the Sifr assistant give fatwas? No, it only helps choose books.\nHow do I reach you about partnerships? Through the Sifr Partners form on the home page.',
  'help.privacy': 'Stored on our server: demo orders, partnership messages and newsletter sign-ups.\nStored only in your browser: cart, favourites, language and your last order receipt.\nQuestions to the Sifr assistant are sent to an external AI provider to generate replies.\nWe do not collect any bank or card data.',
  'help.terms': 'This is a demo shop for presentation. Prices, titles and shipping details may change, and some details are provisional.\nOrders create no obligation to sell or ship.',
  'help.tracking': 'There is no live courier tracking, since orders are demo and never handed to a carrier.\nThis page shows only the last demo order receipt saved in this browser.',
  'help.trkNone': 'No order receipt saved in this browser.',
  'help.trkStatus': 'Status: demo order recorded — not shipped',
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
