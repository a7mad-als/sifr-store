import type { Localized } from "./taxonomy";

/**
 * SINGLE SOURCE OF TRUTH FOR BOOK DATA.
 * Edit title/author/publisher/category/subcategory/volumes/price below.
 * Prices are DEMO KWD. pages: 0 = not yet confirmed. volumes: 0 = unspecified.
 * isDemo marks replaceable Dar al-Taqwa placeholder titles, not verified editions.
 * metadataProvisional means edition/page/binding details need publisher confirmation.
 * Keep IDs stable: retired id 11 must not be reused (saved carts may contain it).
 */
const l = (ar: string, en: string): Localized => ({ ar, en });
const pending = l("يُحدَّد لاحقًا", "To be determined");
const ghazali = l("الإمام أبو حامد الغزالي", "Imam Abu Hamid al-Ghazali");
const siraj = l("الشيخ عبد الله سراج الدين الحسيني", "Shaykh Abdullah Siraj al-Din al-Husayni");
const minhaj = l("دار المنهاج", "Dar al-Minhaj");
const taqwa = l("دار التقوى", "Dar al-Taqwa");
type BookRecord = {
  id: number; title: Localized; author: Localized; publisher: Localized;
  category: string; subcategory: string; level: "beginner" | "intermediate" | "advanced";
  pages: number; volumes: number; volumeLabel: Localized; binding: Localized; description: Localized;
  price: number; color: string; featured: boolean; isDemo: boolean; metadataProvisional: boolean;
};
function book(data: Pick<BookRecord, "id" | "title" | "category" | "price"> & Partial<BookRecord>): BookRecord {
  return {
    author: pending, publisher: pending, subcategory: "", level: "intermediate",
    pages: 0, volumes: 1, volumeLabel: l("مجلد واحد", "Single volume"), binding: pending,
    description: l("تفاصيل هذه الطبعة قيد الاستكمال. السعر تجريبي.", "Edition details are being prepared. The price is illustrative."),
    color: "#1B2A41", featured: false, isDemo: false, metadataProvisional: true,
    ...data,
  };
}

export const books: BookRecord[] = [
  book({ id: 1, title: l("الأربعون النووية", "The Forty Hadith"), author: l("الإمام النووي", "Imam al-Nawawi"), category: "hadith", subcategory: "texts", level: "beginner", price: 2.5, featured: true, description: l("اثنان وأربعون حديثًا من جوامع الكلم، مدخل إلى أصول الدين وآداب الإسلام.", "Forty-two foundational narrations introducing the principles and ethics of Islam.") }),
  book({ id: 2, title: l("رياض الصالحين", "Gardens of the Righteous"), author: l("الإمام النووي", "Imam al-Nawawi"), category: "hadith", subcategory: "texts", price: 7.5, color: "#41534B", featured: true, description: l("أحاديث نبوية مرتبة على أبواب الآداب والعبادات وتزكية النفس.", "A thematic collection of prophetic narrations on worship, conduct and spiritual development.") }),
  book({ id: 3, title: l("الشمائل المحمدية", "The Muhammadan Characteristics"), author: l("الإمام الترمذي", "Imam al-Tirmidhi"), category: "seerah", subcategory: "shamail", level: "beginner", price: 4.75, color: "#786038", description: l("روايات في صفات النبي ﷺ وأخلاقه وهديه.", "Narrations describing the Prophet's character, appearance and daily life.") }),
  book({ id: 4, title: l("متن الآجرومية", "Al-Ajurrumiyyah"), author: l("ابن آجروم", "Ibn Ajurrum"), category: "language", subcategory: "grammar", level: "beginner", price: 1.75, color: "#754B3C", description: l("متن مختصر في أصول النحو العربي.", "A concise foundational text in Arabic grammar.") }),
  book({ id: 5, title: l("قطر الندى", "Qatr al-Nada"), author: l("ابن هشام الأنصاري", "Ibn Hisham al-Ansari"), category: "language", subcategory: "grammar", price: 5.25, color: "#496572" }),
  book({ id: 6, title: l("البيقونية", "Al-Bayquniyyah"), author: l("عمر البيقوني", "Umar al-Bayquni"), category: "hadith", subcategory: "terminology", level: "beginner", price: 2, color: "#6A5F4D" }),
  book({ id: 7, title: l("نخبة الفكر", "Nukhbat al-Fikar"), author: l("ابن حجر العسقلاني", "Ibn Hajar al-Asqalani"), category: "hadith", subcategory: "terminology", price: 3.5, color: "#304A49" }),
  book({ id: 8, title: l("العقيدة الطحاوية", "Al-Aqidah al-Tahawiyyah"), author: l("الإمام أبو جعفر الطحاوي", "Imam Abu Jafar al-Tahawi"), category: "aqeedah", price: 3, color: "#3B4059" }),
  book({ id: 9, title: l("تفسير الجلالين", "Tafsir al-Jalalayn"), author: l("المحلي والسيوطي", "Al-Mahalli & al-Suyuti"), category: "quran", subcategory: "tafsir", level: "advanced", price: 8.5, color: "#786038" }),
  book({ id: 10, title: l("بلوغ المرام", "Bulugh al-Maram"), author: l("ابن حجر العسقلاني", "Ibn Hajar al-Asqalani"), category: "hadith", subcategory: "texts", price: 6, color: "#28445C" }),
  book({ id: 12, title: l("بداية الهداية", "The Beginning of Guidance"), author: ghazali, publisher: minhaj, category: "tazkiyah", level: "beginner", price: 3.75, color: "#53614C", description: l("رسالة في آداب العبادة وتنظيم اليوم ومحاسبة النفس وحسن الصحبة. طبعة دار المنهاج.", "A treatise on worship, daily discipline, self-reflection and companionship. Dar al-Minhaj edition.") }),
  book({ id: 13, title: l("تعليق المصابيح", "Ta'liq al-Masabih"), author: pending, publisher: pending, category: "hadith", subcategory: "commentaries", level: "advanced", price: 45, featured: true, volumes: 0, volumeLabel: l("عدة مجلدات — العدد يُحدَّد لاحقًا", "Multi-volume set — count to be confirmed"), color: "#1B2A41", description: l("إصدار مميز: شرح على صحيح البخاري في عدة مجلدات. يُحدَّد المؤلف ودار النشر وعدد المجلدات وتفاصيل الطبعة لاحقًا. السعر تجريبي.", "Featured release: a multi-volume commentary on Sahih al-Bukhari. Author, publisher, volume count and edition details are to be confirmed. Illustrative price.") }),

  // Abdullah Siraj al-Din al-Husayni — publisher intentionally editable / TBD.
  book({ id: 14, title: l("سيدنا محمد رسول الله ﷺ: شمائله الحميدة خصاله المجيدة", "Our Master Muhammad, the Messenger of Allah ﷺ: His Praiseworthy Qualities and Noble Traits"), author: siraj, publisher: pending, category: "seerah", subcategory: "shamail", price: 9, featured: true, color: "#41534B" }),
  book({ id: 15, title: l("الصلاة على النبي ﷺ: أحكامها فضائلها فوائدها", "Blessings upon the Prophet ﷺ: Rulings, Virtues and Benefits"), author: siraj, publisher: pending, category: "seerah", subcategory: "virtues", price: 5, color: "#754B3C" }),
  book({ id: 16, title: l("شهادة أن لا إله إلا الله محمد رسول الله ﷺ", "The Testimony: No God but Allah, Muhammad Is His Messenger ﷺ"), author: siraj, publisher: pending, category: "aqeedah", price: 4, color: "#3B4059" }),
  book({ id: 17, title: l("الإيمان بعوالم الآخرة ومواقفها", "Belief in the Worlds and Stages of the Hereafter"), author: siraj, publisher: pending, category: "aqeedah", price: 6, color: "#3B4059" }),
  book({ id: 18, title: l("الإيمان بالملائكة ومعه بحث حول عالم الجن", "Belief in the Angels, with a Study of the World of Jinn"), author: siraj, publisher: pending, category: "aqeedah", price: 5, color: "#3B4059" }),
  book({ id: 19, title: l("هدي القرآن الكريم إلى الحجة والبرهان", "The Quran's Guidance to Evidence and Proof"), author: siraj, publisher: pending, category: "quran", subcategory: "quran-sciences", price: 5.5, color: "#53614C" }),
  book({ id: 20, title: l("حول تفسير سورة الفاتحة", "On the Commentary of Surat al-Fatihah"), author: siraj, publisher: pending, category: "quran", subcategory: "tafsir", price: 4, color: "#53614C" }),
  book({ id: 21, title: l("حول تفسير سورة الملك", "On the Commentary of Surat al-Mulk"), author: siraj, publisher: pending, category: "quran", subcategory: "tafsir", price: 4, color: "#53614C" }),
  book({ id: 22, title: l("تلاوة القرآن المجيد", "Recitation of the Glorious Quran"), author: siraj, publisher: pending, category: "quran", subcategory: "quran-sciences", price: 4.5, color: "#53614C" }),
  book({ id: 23, title: l("شرح المنظومة البيقونية في مصطلح الحديث", "Commentary on al-Bayquniyyah in Hadith Terminology"), author: siraj, publisher: pending, category: "hadith", subcategory: "terminology", price: 5, color: "#304A49" }),
  book({ id: 24, title: l("التقرب إلى الله تعالى", "Drawing Near to Allah Most High"), author: siraj, publisher: pending, category: "tazkiyah", price: 4.75, color: "#41534B" }),
  book({ id: 25, title: l("الدعاء: فضائله آدابه", "Supplication: Its Virtues and Etiquette"), author: siraj, publisher: pending, category: "tazkiyah", subcategory: "adhkar", price: 4, color: "#41534B" }),
  book({ id: 26, title: l("الصلاة في الإسلام", "Prayer in Islam"), author: siraj, publisher: pending, category: "fiqh", price: 5.5, color: "#28445C" }),
  book({ id: 27, title: l("مناسك الحج", "The Rites of Hajj"), author: siraj, publisher: pending, category: "fiqh", price: 4.5, color: "#28445C" }),

  // Imam al-Ghazali — Dar al-Minhaj editions.
  book({ id: 28, title: l("إحياء علوم الدين", "The Revival of the Religious Sciences"), author: ghazali, publisher: minhaj, category: "tazkiyah", level: "advanced", price: 65, volumes: 10, volumeLabel: l("10 مجلدات", "10 volumes"), color: "#41534B", description: l("من أمهات كتب الإمام الغزالي، طبعة دار المنهاج في عشرة مجلدات. السعر تجريبي وتفاصيل الطبعة الأخرى قيد الاستكمال.", "A major work of Imam al-Ghazali, Dar al-Minhaj edition in ten volumes. Illustrative price; remaining edition details are being prepared.") }),
  book({ id: 29, title: l("أيها الولد", "O Beloved Son"), author: ghazali, publisher: minhaj, category: "tazkiyah", level: "beginner", price: 2.75, color: "#53614C" }),
  book({ id: 30, title: l("منهاج العابدين", "The Path of the Worshippers"), author: ghazali, publisher: minhaj, category: "tazkiyah", price: 6, color: "#53614C" }),
  book({ id: 31, title: l("المنقذ من الضلال", "Deliverance from Error"), author: ghazali, publisher: minhaj, category: "aqeedah", price: 3.5, color: "#3B4059" }),
  book({ id: 32, title: l("الاقتصاد في الاعتقاد", "Moderation in Belief"), author: ghazali, publisher: minhaj, category: "rational", subcategory: "kalam", level: "advanced", price: 6.5, color: "#3B4059" }),
  book({ id: 33, title: l("الأربعين في أصول الدين", "The Forty Principles of Religion"), author: ghazali, publisher: minhaj, category: "aqeedah", price: 6, color: "#3B4059" }),

  // Replaceable sample titles: NOT assertions about the publisher's real catalogue.
  book({ id: 34, title: l("حاشية الباجوري على جوهرة التوحيد", "Al-Bajuri's Gloss on Jawharat al-Tawhid"), publisher: taqwa, category: "aqeedah", price: 8, isDemo: true, color: "#6A5F4D" }),
  book({ id: 35, title: l("شرح ابن عقيل على الألفية", "Ibn Aqil's Commentary on the Alfiyyah"), publisher: taqwa, category: "language", subcategory: "grammar", price: 9, isDemo: true, color: "#496572" }),
  book({ id: 36, title: l("اللباب في شرح الكتاب", "Al-Lubab fi Sharh al-Kitab"), publisher: taqwa, category: "fiqh", subcategory: "hanafi", price: 10, isDemo: true, color: "#28445C" }),
  book({ id: 37, title: l("شرح الرحبية", "Commentary on al-Rahbiyyah"), publisher: taqwa, category: "fiqh", subcategory: "inheritance", price: 5, isDemo: true, color: "#786038" }),
];
