import type { Book } from '@workspace/api-client-react';
import { categoryName } from '@workspace/sifr-data';
import { formatNum, useI18n, type Lang } from '@/lib/i18n';

type L = { ar: string; en: string };
const has = (v: L | undefined) => !!v && !!(v.ar?.trim() || v.en?.trim());

/** Stable book-centric display helpers shared by cards, quick view, featured. */
export function useBookMeta() {
  const { t, pick, lang } = useI18n();
  return {
    author: (b: Book) => (has(b.author) ? pick(b.author) : t('b.unknown')),
    publisher: (b: Book) => (has(b.publisher) ? pick(b.publisher) : t('b.unknown')),
    category: (b: Book) => pick(categoryName(b.category)),
    sub: (b: Book) => (b.subcategory ? pick(categoryName(b.category, b.subcategory)) : ''),
    pages: (b: Book) => (b.pages > 0 ? `${formatNum(b.pages, lang)} ${t('b.pages')}` : t('b.tbd')),
    volumes: (b: Book) => volumesLabel(b, lang, pick, t('b.vols')),
  };
}

export function volumesLabel(b: Book, lang: Lang, pick: (v: L) => string, vols: string) {
  if (has(b.volumeLabel)) return pick(b.volumeLabel);
  if (b.volumes > 1) return `${formatNum(b.volumes, lang)} ${vols}`;
  return '';
}

/** Stable key for an author/publisher facet: Arabic text survives language toggles. */
export const facetKey = (v: L) => (v.ar?.trim() || v.en?.trim() || '');
