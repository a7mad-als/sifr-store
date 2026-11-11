export type Localized = { ar: string; en: string };
const n = (id: string, ar: string, en: string) => ({ id, name: { ar, en } });
export const taxonomy = [
  { ...n("quran", "علوم القرآن", "Quranic Sciences"), children: [
    n("tafsir", "التفسير", "Tafsir"), n("quran-sciences", "علوم القرآن", "Quranic Studies"), n("tajweed", "التجويد والقراءات", "Tajwid & Readings"),
  ] },
  { ...n("hadith", "الحديث", "Hadith"), children: [
    n("texts", "المتون", "Texts"), n("commentaries", "الشروح", "Commentaries"), n("terminology", "مصطلح الحديث", "Hadith Terminology"), n("narrators", "التخريج والرجال", "Sources & Narrators"),
  ] },
  { ...n("seerah", "السيرة النبوية", "Prophetic Biography"), children: [
    n("biography", "السيرة", "Biography"), n("shamail", "الشمائل", "Character & Appearance"), n("characteristics", "الخصائص", "Distinctive Characteristics"), n("proofs", "الدلائل", "Proofs of Prophethood"), n("virtues", "الفضائل والصلاة على النبي ﷺ", "Virtues & Blessings upon the Prophet ﷺ"),
  ] },
  { ...n("aqeedah", "العقيدة وأصول الدين", "Creed & Foundations of Religion"), children: [] },
  { ...n("fiqh", "الفقه", "Jurisprudence"), children: [
    n("hanafi", "حنفي", "Hanafi"), n("maliki", "مالكي", "Maliki"), n("shafii", "شافعي", "Shafii"), n("hanbali", "حنبلي", "Hanbali"), n("usul", "أصول الفقه", "Legal Theory"), n("maxims", "القواعد الفقهية", "Legal Maxims"), n("inheritance", "الفرائض", "Inheritance"),
  ] },
  { ...n("tazkiyah", "التزكية والسلوك والآداب", "Spirituality, Conduct & Etiquette"), children: [n("adhkar", "الأذكار والأدعية", "Remembrance & Supplication")] },
  { ...n("language", "علوم اللغة العربية", "Arabic Language Sciences"), children: [
    n("grammar", "النحو", "Grammar"), n("morphology", "الصرف", "Morphology"), n("rhetoric", "البلاغة (المعاني والبيان والبديع)", "Rhetoric: Maani, Bayan & Badi"), n("prosody", "العروض والقافية", "Prosody & Rhyme"), n("wad", "الوضع", "Theory of Linguistic Signification"), n("lexicons", "متن اللغة والمعاجم", "Vocabulary & Lexicons"), n("literature", "الأدب", "Literature"), n("orthography", "الإملاء والخط", "Orthography & Calligraphy"),
  ] },
  { ...n("rational", "علوم الآلة العقلية", "Rational Disciplines"), children: [
    n("logic", "المنطق", "Logic"), n("debate", "آداب البحث والمناظرة", "Research & Debate"), n("categories", "المقولات", "Categories"), n("kalam", "علم الكلام", "Kalam"),
  ] },
  { ...n("history", "التراجم والتاريخ", "Biographies & History"), children: [] },
];

export function categoryName(category: string, subcategory = ""): Localized {
  const parent = taxonomy.find(item => item.id === category);
  return parent?.children.find(item => item.id === subcategory)?.name ?? parent?.name ?? { ar: category, en: category };
}
