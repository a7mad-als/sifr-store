import { useMemo, useState } from 'react';
import { RefreshCw, Search, SearchX, SlidersHorizontal, X } from 'lucide-react';
import type { Book } from '@workspace/api-client-react';
import { taxonomy } from '@workspace/sifr-data';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';
import { BookCard, BookCardSkeleton } from '@/components/book-card';
import { SectionHead } from '@/components/section';
import { facetKey } from '@/lib/catalog';
import { formatNum, normalize, useI18n } from '@/lib/i18n';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { useMarket } from '@/lib/market';

type Sort = 'none' | 'asc' | 'desc';
type Local = { level: string; sort: Sort; author: string; publisher: string; min: string; max: string };
const INIT: Local = { level: 'all', sort: 'none', author: 'all', publisher: 'all', min: '', max: '' };

export function ErrorBlock({ onRetry }: { onRetry: () => void }) {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center border border-destructive/25 bg-destructive/5 px-6 py-14 text-center" role="alert" data-testid="status-books-error">
      <p className="text-lg font-medium text-destructive">{t('err.load')}</p>
      <p className="mt-1 text-sm font-light text-muted-foreground">{t('err.loadBody')}</p>
      <button type="button" onClick={onRetry} className="mt-6 flex items-center gap-2 border border-[#1B2A41] px-5 py-2.5 text-sm transition-colors hover:bg-[#1B2A41] hover:text-[#F6F1E7]" data-testid="button-retry-books">
        <RefreshCw className="h-4 w-4" /> {t('err.retry')}
      </button>
    </div>
  );
}

const sel = 'mt-1.5 h-11 w-full border border-[#1B2A41]/20 bg-[#F6F1E7] px-3 text-sm outline-none transition-colors hover:border-[#1B2A41] focus:border-[#B8893B] disabled:opacity-40';
const lbl = 'block text-xs tracking-wide text-[#1B2A41]/60';

function Facets({ books, local, setLocal, idp }: { books: Book[]; local: Local; setLocal: (l: Local) => void; idp: string }) {
  const { t, pick, lang } = useI18n();
  const { currency } = useMarket();
  const { filter, setFilter } = useStore();
  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    books.forEach((b) => { m[b.category] = (m[b.category] ?? 0) + 1; m[`${b.category}/${b.subcategory}`] = (m[`${b.category}/${b.subcategory}`] ?? 0) + 1; });
    return m;
  }, [books]);
  const facet = (get: (b: Book) => { ar: string; en: string }) => {
    const map = new Map<string, { ar: string; en: string }>();
    books.forEach((b) => { const v = get(b); const k = facetKey(v); if (k && !map.has(k)) map.set(k, v); });
    return [...map.entries()].map(([k, v]) => ({ k, label: pick(v) })).sort((a, b) => a.label.localeCompare(b.label, lang));
  };
  const authors = facet((b) => b.author);
  const publishers = facet((b) => b.publisher);
  const parent = taxonomy.find((c) => c.id === filter.category);
  const minN = Number(local.min); const maxN = Number(local.max);
  const priceBad = local.min !== '' && local.max !== '' && minN > maxN;
  return (
    <div className="space-y-6">
      <label className={lbl}>{t('f.category')}
        <select value={filter.category} onChange={(e) => setFilter({ category: e.target.value, sub: 'all' })} className={sel} data-testid={`${idp}-select-category`}>
          <option value="all">{t('cat.all')}</option>
          {taxonomy.map((c) => <option key={c.id} value={c.id} disabled={!counts[c.id]}>{pick(c.name)}{counts[c.id] ? ` (${formatNum(counts[c.id], lang)})` : ` — ${t('cat.empty')}`}</option>)}
        </select>
      </label>
      <label className={lbl}>{t('f.sub')}
        <select value={filter.sub} disabled={!parent || parent.children.length === 0} onChange={(e) => setFilter({ sub: e.target.value })} className={sel} data-testid={`${idp}-select-sub`}>
          <option value="all">{t('f.allSubs')}</option>
          {parent?.children.map((c) => { const n = counts[`${parent.id}/${c.id}`] ?? 0; return <option key={c.id} value={c.id} disabled={!n}>{pick(c.name)}{n ? ` (${formatNum(n, lang)})` : ` — ${t('cat.empty')}`}</option>; })}
        </select>
      </label>
      <label className={lbl}>{t('f.author')}
        <select value={local.author} onChange={(e) => setLocal({ ...local, author: e.target.value })} className={sel} data-testid={`${idp}-select-author`}>
          <option value="all">{t('f.allAuthors')}</option>
          {authors.map((a) => <option key={a.k} value={a.k}>{a.label}</option>)}
        </select>
      </label>
      <label className={lbl}>{t('f.publisher')}
        <select value={local.publisher} onChange={(e) => setLocal({ ...local, publisher: e.target.value })} className={sel} data-testid={`${idp}-select-publisher`}>
          <option value="all">{t('f.allPublishers')}</option>
          {publishers.map((a) => <option key={a.k} value={a.k}>{a.label}</option>)}
        </select>
      </label>
      <label className={lbl}>{t('f.level')}
        <select value={local.level} onChange={(e) => setLocal({ ...local, level: e.target.value })} className={sel} data-testid={`${idp}-select-level`}>
          <option value="all">{t('lv.all')}</option>
          {(['beginner', 'intermediate', 'advanced'] as const).map((l) => <option key={l} value={l}>{t(`lv.${l}`)}</option>)}
        </select>
      </label>
      <fieldset>
        <legend className={lbl}>{t('f.price')} ({currency})</legend>
        <div className="mt-1.5 grid grid-cols-2 gap-2">
          {(['min', 'max'] as const).map((k) => (
            <input key={k} type="number" inputMode="decimal" min={0} step="0.5" value={local[k]} placeholder={t(k === 'min' ? 'f.min' : 'f.max')} aria-label={t(k === 'min' ? 'f.min' : 'f.max')} aria-invalid={priceBad} onChange={(e) => setLocal({ ...local, [k]: e.target.value })} className={cn(sel, 'mt-0', priceBad && 'border-destructive')} dir="ltr" data-testid={`${idp}-input-price-${k}`} />
          ))}
        </div>
        {priceBad && <p className="mt-1 text-xs text-destructive">{t('f.priceErr')}</p>}
      </fieldset>
      <label className={lbl}>{t('f.sort')}
        <select value={local.sort} onChange={(e) => setLocal({ ...local, sort: e.target.value as Sort })} className={sel} data-testid={`${idp}-select-sort`}>
          <option value="none">{t('f.sortDefault')}</option>
          <option value="asc">{t('f.sortAsc')}</option>
          <option value="desc">{t('f.sortDesc')}</option>
        </select>
      </label>
    </div>
  );
}

export function Catalogue({ books, isLoading, isError, onRetry }: { books: Book[] | undefined; isLoading: boolean; isError: boolean; onRetry: () => void }) {
  const { t, lang, dir } = useI18n();
  const { currency, rates } = useMarket();
  const { filter, setFilter } = useStore();
  const [local, setLocal] = useState<Local>(INIT);
  const [drawer, setDrawer] = useState(false);
  const all = useMemo(() => books ?? [], [books]);
  const q = normalize(filter.q);
  const results = useMemo(() => {
    const rate = currency === 'KWD' ? 1 : rates?.rates[currency] ?? 1;
    const min = local.min === '' ? -Infinity : Number(local.min) / rate;
    const max = local.max === '' ? Infinity : Number(local.max) / rate;
    let r = all.filter((b) => {
      if (filter.category !== 'all' && b.category !== filter.category) return false;
      if (filter.sub !== 'all' && b.subcategory !== filter.sub) return false;
      if (local.level !== 'all' && b.level !== local.level) return false;
      if (local.author !== 'all' && facetKey(b.author) !== local.author) return false;
      if (local.publisher !== 'all' && facetKey(b.publisher) !== local.publisher) return false;
      if (b.price < min || b.price > max) return false;
      if (!q) return true;
      return normalize([b.title.ar, b.title.en, b.author.ar, b.author.en].join(' ')).includes(q);
    });
    if (local.sort !== 'none') r = [...r].sort((a, b) => (local.sort === 'asc' ? a.price - b.price : b.price - a.price));
    return r;
  }, [all, filter.category, filter.sub, local, q, currency, rates]);
  const activeCount = [filter.category !== 'all', filter.sub !== 'all', local.level !== 'all', local.author !== 'all', local.publisher !== 'all', local.min !== '', local.max !== '', local.sort !== 'none'].filter(Boolean).length;
  const dirty = activeCount > 0 || !!filter.q;
  const reset = () => { setFilter({ category: 'all', sub: 'all', q: '' }); setLocal(INIT); };
  const chip = (active: boolean, empty = false) => cn('shrink-0 border px-4 py-2 text-sm transition-all duration-300', empty && 'pointer-events-none opacity-35', active ? 'border-[#1B2A41] bg-[#1B2A41] text-[#F6F1E7]' : 'border-[#1B2A41]/20 text-[#1B2A41]/80 hover:border-[#1B2A41] hover:text-[#1B2A41]');
  const has = (id: string) => all.some((b) => b.category === id);

  return (
    <section id="books" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 md:px-8 md:py-32">
      <SectionHead kicker={t('cat2.kicker')} title={t('cat2.title')}>
        {!isLoading && !isError && <p className="text-sm font-light text-muted-foreground" aria-live="polite" data-testid="text-results-count">{formatNum(results.length, lang)} {t('f.results')}</p>}
      </SectionHead>
      <div className="mt-12 flex flex-col gap-3 md:flex-row">
        <label className="flex h-11 flex-1 items-center gap-2 border border-[#1B2A41]/20 px-3 transition-colors focus-within:border-[#B8893B] hover:border-[#1B2A41]">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input type="search" value={filter.q} onChange={(e) => setFilter({ q: e.target.value })} placeholder={t('f.search')} aria-label={t('f.search')} className="h-full flex-1 bg-transparent text-sm outline-none" data-testid="input-search" />
          {filter.q && <button type="button" onClick={() => setFilter({ q: '' })} aria-label={t('f.reset')} className="text-muted-foreground hover:text-[#1B2A41]"><X className="h-4 w-4" /></button>}
        </label>
        <div className="flex gap-2 lg:hidden">
          <button type="button" onClick={() => setDrawer(true)} aria-expanded={drawer} aria-controls="filters-drawer" className="flex h-11 flex-1 items-center justify-center gap-2 bg-[#1B2A41] px-5 text-sm text-[#F6F1E7]" data-testid="button-open-filters">
            <SlidersHorizontal className="h-4 w-4" /> {t('f.open')}{activeCount > 0 && <span className="bg-[#B8893B] px-1.5 text-[11px] text-[#1B2A41]">{formatNum(activeCount, lang)}</span>}
          </button>
          {dirty && <button type="button" onClick={reset} className="h-11 border border-[#1B2A41]/30 px-4 text-sm" data-testid="button-reset-filters-mobile">{t('f.reset')}</button>}
        </div>
      </div>
      <div className="-mx-5 mt-5 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0" role="group" aria-label={t('nav.categories')}>
        <button type="button" aria-pressed={filter.category === 'all'} onClick={() => setFilter({ category: 'all' })} className={chip(filter.category === 'all')} data-testid="chip-category-all">{t('cat.all')}</button>
        {taxonomy.map((c) => {
          const empty = !has(c.id);
          return <button key={c.id} type="button" aria-pressed={filter.category === c.id} aria-disabled={empty} tabIndex={empty ? -1 : 0} onClick={() => !empty && setFilter({ category: c.id })} className={chip(filter.category === c.id, empty)} data-testid={`chip-category-${c.id}`}>{lang === 'ar' ? c.name.ar : c.name.en}</button>;
        })}
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block" aria-label={t('f.title')}>
          <div className="sticky top-28 border-t border-[#1B2A41] pt-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-sm font-medium">{t('f.title')}</h3>
              {dirty && <button type="button" onClick={reset} className="link-u text-xs text-[#B8893B]" data-testid="button-reset-filters">{t('f.reset')}</button>}
            </div>
            <Facets books={all} local={local} setLocal={setLocal} idp="desk" />
          </div>
        </aside>
        <div>
          {isError ? (
            <ErrorBlock onRetry={onRetry} />
          ) : isLoading ? (
            <div className="grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-3 lg:gap-x-8">{Array.from({ length: 6 }).map((_, i) => <BookCardSkeleton key={i} />)}</div>
          ) : results.length === 0 ? (
            <div className="lattice flex flex-col items-center border border-dashed border-[#1B2A41]/25 px-6 py-20 text-center" data-testid="status-no-results">
              <div className="grid h-16 w-16 place-items-center bg-[#1B2A41] text-[#B8893B]"><SearchX className="h-7 w-7" /></div>
              <p className="mt-6 text-xl font-medium">{t('f.none')}</p>
              <p className="mt-2 text-sm font-light text-muted-foreground">{t('f.noneBody')}</p>
              <button type="button" onClick={reset} className="mt-6 bg-[#1B2A41] px-6 py-3 text-sm text-[#F6F1E7] transition-colors hover:bg-[#B8893B] hover:text-[#1B2A41]" data-testid="button-noresults-reset">{t('f.reset')}</button>
            </div>
          ) : (
            <div key={`${filter.category}-${filter.sub}-${local.sort}`} className="grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-3 lg:gap-x-8">
              {results.map((b, i) => <BookCard key={b.id} book={b} index={i} />)}
            </div>
          )}
        </div>
      </div>

      <Sheet open={drawer} onOpenChange={setDrawer}>
        <SheetContent id="filters-drawer" side={dir === 'rtl' ? 'right' : 'left'} className="flex w-[88vw] max-w-sm flex-col gap-0 border-none bg-[#F6F1E7] p-0 [&>button]:hidden" data-testid="drawer-filters">
          <div className="flex items-center justify-between border-b border-[#1B2A41]/10 px-6 py-5">
            <SheetTitle className="text-xl font-medium text-[#1B2A41]">{t('f.title')}</SheetTitle>
            <SheetDescription className="sr-only">{t('f.title')}</SheetDescription>
            <button type="button" onClick={() => setDrawer(false)} aria-label={t('common.close')} className="grid h-9 w-9 place-items-center hover:bg-[#1B2A41] hover:text-[#F6F1E7]" data-testid="button-close-filters"><X className="h-4 w-4" /></button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-6"><Facets books={all} local={local} setLocal={setLocal} idp="mob" /></div>
          <div className="grid grid-cols-[auto_1fr] gap-2 border-t border-[#1B2A41]/10 bg-[#EFE7D6] px-6 py-4">
            <button type="button" onClick={reset} className="border border-[#1B2A41]/30 px-4 py-3 text-sm" data-testid="button-drawer-reset">{t('f.reset')}</button>
            <button type="button" onClick={() => setDrawer(false)} className="bg-[#1B2A41] py-3 text-sm text-[#F6F1E7]" data-testid="button-drawer-apply">{t('f.apply')} ({formatNum(results.length, lang)})</button>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}
