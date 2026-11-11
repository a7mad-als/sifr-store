import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, BadgeCheck, Building2, Lock, RefreshCw, Search, SearchX, Truck, X, CheckCircle2 } from 'lucide-react';
import { useCreateQuote, useListBooks, getListBooksQueryKey, type Book } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { BookCard, BookCardSkeleton } from '@/components/book-card';
import { BookCover } from '@/components/brand';
import { useGoTo } from '@/components/shell';
import { formatNum, normalize, useI18n, type TKey } from '@/lib/i18n';
import { CATEGORIES, useStore } from '@/lib/store';
import { cn } from '@/lib/utils';

function Arrow({ className }: { className?: string }) {
  const { dir } = useI18n();
  const A = dir === 'rtl' ? ArrowLeft : ArrowRight;
  return <A className={cn('h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1', className)} />;
}

function SectionHead({ kicker, title, children }: { kicker: string; title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="flex items-center gap-3 text-xs tracking-[0.2em] text-[#B8893B]"><span className="h-px w-8 bg-current" />{kicker}</div>
        <h2 className="mt-4 text-3xl font-medium tracking-tight text-[#1B2A41] md:text-5xl">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function ErrorBlock({ onRetry }: { onRetry: () => void }) {
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

function Hero({ books }: { books: Book[] | undefined }) {
  const { t, lang } = useI18n();
  const go = useGoTo();
  const picks = (books ?? []).filter((b) => b.featured).concat(books ?? []).slice(0, 3);
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="lattice absolute inset-y-0 end-0 hidden w-[46%] bg-[#EFE7D6] lg:block" />
      <div className="relative mx-auto grid max-w-7xl gap-16 px-5 pb-24 pt-14 md:px-8 lg:grid-cols-[1.15fr_1fr] lg:pb-32 lg:pt-24">
        <div className="flex flex-col justify-center">
          <div className="rise flex items-center gap-3 text-xs tracking-[0.2em] text-[#B8893B]"><span className="h-px w-10 bg-current" />{t('hero.kicker')}</div>
          <h1 className="rise mt-8 text-[2.6rem] font-semibold leading-[1.15] tracking-tight text-[#1B2A41] sm:text-6xl lg:text-[4.4rem]" style={{ animationDelay: '80ms' }}>
            {t('hero.title')}
          </h1>
          <p className="rise mt-4 text-2xl font-light text-[#B8893B] md:text-3xl" style={{ animationDelay: '160ms' }}>{t('slogan')}</p>
          <p className="rise mt-8 max-w-xl text-base font-light leading-8 text-[#1B2A41]/75 md:text-lg" style={{ animationDelay: '240ms' }}>{t('hero.body')}</p>
          <div className="rise mt-10 flex flex-wrap gap-3" style={{ animationDelay: '320ms' }}>
            <button type="button" onClick={() => go('books')} className="group flex items-center gap-3 bg-[#1B2A41] px-7 py-4 text-sm font-medium text-[#F6F1E7] transition-colors duration-300 hover:bg-[#B8893B] hover:text-[#1B2A41]" data-testid="button-hero-browse">
              {t('hero.browse')} <Arrow />
            </button>
            <button type="button" onClick={() => go('institutions')} className="group flex items-center gap-3 border border-[#1B2A41] px-7 py-4 text-sm font-medium text-[#1B2A41] transition-colors duration-300 hover:bg-[#1B2A41] hover:text-[#F6F1E7]" data-testid="button-hero-bulk">
              <Building2 className="h-4 w-4" /> {t('hero.bulk')}
            </button>
          </div>
          <dl className="rise mt-14 grid max-w-lg grid-cols-3 border-t border-[#1B2A41]/15 pt-6" style={{ animationDelay: '400ms' }}>
            {([[books?.length ?? 12, 'hero.stat1'], [CATEGORIES.length, 'hero.stat2'], [6, 'hero.stat3']] as [number, TKey][]).map(([n, k]) => (
              <div key={k}>
                <dt className="sr-only">{t(k)}</dt>
                <dd className="text-3xl font-semibold tabular-nums text-[#1B2A41]">{formatNum(n, lang)}</dd>
                <dd className="mt-1 text-xs font-light text-muted-foreground">{t(k)}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative mx-auto h-[380px] w-full max-w-md sm:h-[460px]">
          {picks.length === 3 ? (
            picks.map((b, i) => (
              <div
                key={b.id}
                className="rise absolute w-[52%] transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)] hover:z-10 hover:-translate-y-3"
                style={{
                  animationDelay: `${300 + i * 140}ms`,
                  insetInlineStart: ['4%', '24%', '44%'][i],
                  top: ['14%', '0%', '20%'][i],
                  zIndex: i === 1 ? 3 : 1,
                }}
              >
                <BookCover book={b} />
              </div>
            ))
          ) : (
            <div className="absolute inset-x-[24%] top-0 aspect-[3/4] animate-pulse bg-[#1B2A41]/10" />
          )}
          <div className="absolute bottom-0 start-0 end-0 h-px bg-[#1B2A41]/30" />
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  const { t } = useI18n();
  const items: [ReactNode, TKey, TKey][] = [
    [<BadgeCheck key="a" className="h-6 w-6" />, 'ben.1t', 'ben.1b'],
    [<Truck key="b" className="h-6 w-6" />, 'ben.2t', 'ben.2b'],
    [<Lock key="c" className="h-6 w-6" />, 'ben.3t', 'ben.3b'],
  ];
  return (
    <section className="bg-[#1B2A41] text-[#F6F1E7]" aria-label={t('ben.title')}>
      <div className="mx-auto grid max-w-7xl md:grid-cols-[auto_1fr_1fr_1fr]">
        <div className="flex items-center px-5 py-8 md:px-8 md:py-0">
          <h2 className="text-xs tracking-[0.25em] text-[#B8893B] md:[writing-mode:vertical-rl]">{t('ben.title')}</h2>
        </div>
        {items.map(([icon, tk, bk], i) => (
          <div key={tk} className="group border-t border-[#F6F1E7]/10 px-5 py-10 transition-colors duration-500 hover:bg-[#22344F] md:border-s md:border-t-0 md:px-10 md:py-14">
            <div className="flex items-center justify-between text-[#B8893B]">{icon}<span className="text-xs tabular-nums opacity-60">0{i + 1}</span></div>
            <h3 className="mt-6 text-xl font-medium">{t(tk)}</h3>
            <p className="mt-3 text-sm font-light leading-7 text-[#F6F1E7]/70">{t(bk)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Categories({ books }: { books: Book[] | undefined }) {
  const { t, lang } = useI18n();
  const { setFilter } = useStore();
  const go = useGoTo();
  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    (books ?? []).forEach((b) => { m[b.category] = (m[b.category] ?? 0) + 1; });
    return m;
  }, [books]);
  return (
    <section id="categories" className="scroll-mt-24 mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <SectionHead kicker={t('cat.kicker')} title={t('cat.title')} />
      <div className="mt-14 grid grid-cols-2 gap-px border border-[#1B2A41]/15 bg-[#1B2A41]/15 md:grid-cols-4">
        {CATEGORIES.map((c, i) => (
          <button
            key={c}
            type="button"
            onClick={() => { setFilter({ category: c, q: '' }); go('books'); }}
            className="group relative flex min-h-[150px] flex-col justify-between overflow-hidden bg-[#F6F1E7] p-6 text-start transition-colors duration-500 hover:bg-[#1B2A41] md:min-h-[190px]"
            data-testid={`button-category-${c}`}
          >
            <span className="text-xs tabular-nums text-[#B8893B]">{String(i + 1).padStart(2, '0')}</span>
            <span>
              <span className="block text-xl font-medium text-[#1B2A41] transition-colors duration-500 group-hover:text-[#F6F1E7] md:text-2xl">{t(`c.${c}` as TKey)}</span>
              <span className="mt-2 flex items-center gap-2 text-xs font-light text-muted-foreground transition-colors group-hover:text-[#F6F1E7]/60">
                {formatNum(counts[c] ?? 0, lang)} {lang === 'ar' ? 'عنوان' : 'titles'} <Arrow className="h-3 w-3 opacity-0 group-hover:opacity-100" />
              </span>
            </span>
            <span className="absolute -bottom-8 -end-8 h-24 w-24 rotate-45 border border-[#B8893B]/30 transition-transform duration-700 group-hover:rotate-[135deg]" />
          </button>
        ))}
      </div>
    </section>
  );
}

function Bestsellers({ books, isLoading }: { books: Book[] | undefined; isLoading: boolean }) {
  const { t } = useI18n();
  const list = (books ?? []).filter((b) => b.featured).slice(0, 4);
  if (!isLoading && list.length === 0) return null;
  return (
    <section id="bestsellers" className="scroll-mt-24 border-y border-[#1B2A41]/10 bg-[#EFE7D6]">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-28">
        <SectionHead kicker={t('best.kicker')} title={t('best.title')} />
        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-14 lg:grid-cols-4 lg:gap-x-10">
          {isLoading ? Array.from({ length: 4 }).map((_, i) => <BookCardSkeleton key={i} />) : list.map((b, i) => <BookCard key={b.id} book={b} index={i} />)}
        </div>
      </div>
    </section>
  );
}

function Catalogue({ books, isLoading, isError, onRetry }: { books: Book[] | undefined; isLoading: boolean; isError: boolean; onRetry: () => void }) {
  const { t, lang } = useI18n();
  const { filter, setFilter } = useStore();
  const [level, setLevel] = useState('all');
  const [sort, setSort] = useState<'none' | 'asc' | 'desc'>('none');
  const q = normalize(filter.q);
  const results = useMemo(() => {
    let r = (books ?? []).filter((b) => {
      if (filter.category !== 'all' && b.category !== filter.category) return false;
      if (level !== 'all' && b.level !== level) return false;
      if (!q) return true;
      return normalize([b.title.ar, b.title.en, b.author.ar, b.author.en].join(' ')).includes(q);
    });
    if (sort !== 'none') r = [...r].sort((a, b) => (sort === 'asc' ? a.price - b.price : b.price - a.price));
    return r;
  }, [books, filter.category, level, q, sort]);
  const dirty = filter.category !== 'all' || level !== 'all' || !!filter.q || sort !== 'none';
  const reset = () => { setFilter({ category: 'all', q: '' }); setLevel('all'); setSort('none'); };
  const chip = (active: boolean) => cn('shrink-0 border px-4 py-2 text-sm transition-all duration-300', active ? 'border-[#1B2A41] bg-[#1B2A41] text-[#F6F1E7]' : 'border-[#1B2A41]/20 text-[#1B2A41]/80 hover:border-[#1B2A41] hover:text-[#1B2A41]');
  const sel = 'h-11 border border-[#1B2A41]/20 bg-[#F6F1E7] px-3 text-sm outline-none transition-colors hover:border-[#1B2A41] focus:border-[#B8893B]';
  return (
    <section id="books" className="scroll-mt-24 mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <SectionHead kicker={t('cat2.kicker')} title={t('cat2.title')}>
        {!isLoading && !isError && (
          <p className="text-sm font-light text-muted-foreground" aria-live="polite" data-testid="text-results-count">{formatNum(results.length, lang)} {t('f.results')}</p>
        )}
      </SectionHead>
      <div className="mt-12 space-y-5">
        <div className="flex flex-col gap-3 md:flex-row">
          <label className="flex h-11 flex-1 items-center gap-2 border border-[#1B2A41]/20 px-3 transition-colors focus-within:border-[#B8893B] hover:border-[#1B2A41]">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input type="search" value={filter.q} onChange={(e) => setFilter({ q: e.target.value })} placeholder={t('f.search')} aria-label={t('f.search')} className="h-full flex-1 bg-transparent text-sm outline-none" data-testid="input-search" />
            {filter.q && <button type="button" onClick={() => setFilter({ q: '' })} aria-label={t('f.reset')} className="text-muted-foreground hover:text-[#1B2A41]"><X className="h-4 w-4" /></button>}
          </label>
          <select value={level} onChange={(e) => setLevel(e.target.value)} aria-label={t('f.level')} className={sel} data-testid="select-level">
            <option value="all">{t('lv.all')}</option>
            {(['beginner', 'intermediate', 'advanced'] as const).map((l) => <option key={l} value={l}>{t(`lv.${l}`)}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} aria-label={t('f.sort')} className={sel} data-testid="select-sort">
            <option value="none">{t('f.sortDefault')}</option>
            <option value="asc">{t('f.sortAsc')}</option>
            <option value="desc">{t('f.sortDesc')}</option>
          </select>
        </div>
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0" role="group" aria-label={t('nav.categories')}>
          <button type="button" aria-pressed={filter.category === 'all'} onClick={() => setFilter({ category: 'all' })} className={chip(filter.category === 'all')} data-testid="chip-category-all">{t('cat.all')}</button>
          {CATEGORIES.map((c) => (
            <button key={c} type="button" aria-pressed={filter.category === c} onClick={() => setFilter({ category: c })} className={chip(filter.category === c)} data-testid={`chip-category-${c}`}>{t(`c.${c}` as TKey)}</button>
          ))}
          {dirty && <button type="button" onClick={reset} className="shrink-0 px-3 py-2 text-sm text-[#B8893B] link-u" data-testid="button-reset-filters">{t('f.reset')}</button>}
        </div>
      </div>
      <div className="mt-14">
        {isError ? (
          <ErrorBlock onRetry={onRetry} />
        ) : isLoading ? (
          <div className="grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-10">{Array.from({ length: 8 }).map((_, i) => <BookCardSkeleton key={i} />)}</div>
        ) : results.length === 0 ? (
          <div className="lattice flex flex-col items-center border border-dashed border-[#1B2A41]/25 px-6 py-20 text-center" data-testid="status-no-results">
            <div className="grid h-16 w-16 place-items-center bg-[#1B2A41] text-[#B8893B]"><SearchX className="h-7 w-7" /></div>
            <p className="mt-6 text-xl font-medium">{t('f.none')}</p>
            <p className="mt-2 text-sm font-light text-muted-foreground">{t('f.noneBody')}</p>
            <button type="button" onClick={reset} className="mt-6 bg-[#1B2A41] px-6 py-3 text-sm text-[#F6F1E7] transition-colors hover:bg-[#B8893B] hover:text-[#1B2A41]" data-testid="button-noresults-reset">{t('f.reset')}</button>
          </div>
        ) : (
          <div key={`${filter.category}-${level}-${sort}`} className="grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-10">
            {results.map((b, i) => <BookCard key={b.id} book={b} index={i} />)}
          </div>
        )}
      </div>
    </section>
  );
}

type QErr = Partial<Record<'organization' | 'name' | 'email' | 'quantity' | 'message', TKey>>;

function Institutions() {
  const { t } = useI18n();
  const quote = useCreateQuote();
  const [f, setF] = useState({ organization: '', name: '', email: '', quantity: '10', message: '' });
  const [errs, setErrs] = useState<QErr>({});
  const [ref, setRef] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  const validate = () => {
    const e: QErr = {};
    if (f.organization.trim().length < 2) e.organization = 'v.min2';
    if (f.name.trim().length < 2) e.name = 'v.min2';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'v.email';
    const n = Number(f.quantity);
    if (!Number.isInteger(n) || n < 10 || n > 100000) e.quantity = 'v.qty';
    if (f.message.trim().length < 5) e.message = 'v.min5';
    setErrs(e);
    return Object.keys(e).length === 0;
  };
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setFailed(false);
    if (!validate()) return;
    try {
      const r = await quote.mutateAsync({ data: { organization: f.organization.trim(), name: f.name.trim(), email: f.email.trim(), quantity: Number(f.quantity), message: f.message.trim() } });
      setRef(r.reference);
    } catch { setFailed(true); }
  };
  const field = (k: keyof typeof f, label: TKey, type = 'text', area = false) => (
    <label className={cn('block', area && 'sm:col-span-2')}>
      <span className="text-xs text-[#F6F1E7]/60">{t(label)}</span>
      {area ? (
        <textarea value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} rows={4} maxLength={3000} aria-invalid={!!errs[k]} className="mt-2 w-full resize-none border-b border-[#F6F1E7]/25 bg-transparent py-2 text-[#F6F1E7] outline-none transition-colors focus:border-[#B8893B]" data-testid={`input-quote-${k}`} />
      ) : (
        <input type={type} min={type === 'number' ? 10 : undefined} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} aria-invalid={!!errs[k]} className="mt-2 w-full border-b border-[#F6F1E7]/25 bg-transparent py-2 text-[#F6F1E7] outline-none transition-colors focus:border-[#B8893B]" data-testid={`input-quote-${k}`} />
      )}
      {errs[k] && <span className="mt-1 block text-xs text-[#E8A39A]">{t(errs[k]!)}</span>}
    </label>
  );
  return (
    <section id="institutions" className="scroll-mt-20 bg-[#1B2A41] text-[#F6F1E7]">
      <div className="mx-auto grid max-w-7xl gap-16 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-3 text-xs tracking-[0.2em] text-[#B8893B]"><span className="h-px w-8 bg-current" />{t('inst.kicker')}</div>
          <h2 className="mt-4 text-3xl font-medium leading-tight md:text-5xl">{t('inst.title')}</h2>
          <p className="mt-6 max-w-md font-light leading-8 text-[#F6F1E7]/70">{t('inst.body')}</p>
          <ul className="mt-10 space-y-4">
            {(['inst.p1', 'inst.p2', 'inst.p3'] as TKey[]).map((k) => (
              <li key={k} className="flex items-center gap-4 text-sm"><span className="h-2 w-2 rotate-45 bg-[#B8893B]" />{t(k)}</li>
            ))}
          </ul>
        </div>
        <div className="border border-[#F6F1E7]/15 bg-[#22344F] p-6 md:p-10">
          {ref ? (
            <div className="rise flex flex-col items-start" role="status" data-testid="status-quote-success">
              <CheckCircle2 className="h-10 w-10 text-[#B8893B]" />
              <p className="mt-5 text-2xl font-medium">{t('q.ok')}</p>
              <p className="mt-6 text-xs text-[#F6F1E7]/60">{t('q.ref')}</p>
              <p className="mt-1 font-mono text-2xl tracking-wider text-[#B8893B]" dir="ltr" data-testid="text-quote-reference">{ref}</p>
              <p className="mt-6 border-s-2 border-[#B8893B] ps-4 text-sm font-light leading-7 text-[#F6F1E7]/75">{t('q.demo')}</p>
              <button type="button" onClick={() => { setRef(null); setF({ organization: '', name: '', email: '', quantity: '10', message: '' }); }} className="mt-8 border border-[#F6F1E7]/40 px-5 py-2.5 text-sm transition-colors hover:bg-[#F6F1E7] hover:text-[#1B2A41]" data-testid="button-quote-another">{t('q.another')}</button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="grid gap-7 sm:grid-cols-2">
              {field('organization', 'q.org')}
              {field('name', 'q.name')}
              {field('email', 'q.email', 'email')}
              {field('quantity', 'q.qty', 'number')}
              {field('message', 'q.msg', 'text', true)}
              {failed && <p className="text-sm text-[#E8A39A] sm:col-span-2" role="alert" data-testid="status-quote-error">{t('q.err')}</p>}
              <button type="submit" disabled={quote.isPending} className="group flex items-center justify-center gap-3 bg-[#B8893B] px-6 py-4 text-sm font-medium text-[#1B2A41] transition-colors duration-300 hover:bg-[#F6F1E7] disabled:opacity-60 sm:col-span-2" data-testid="button-quote-submit">
                {quote.isPending ? t('q.sending') : t('q.submit')} {!quote.isPending && <Arrow />}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const { t } = useI18n();
  const { setAiOpen } = useStore();
  const go = useGoTo();
  return (
    <section id="contact" className="scroll-mt-24 mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <div className="grid items-end gap-10 md:grid-cols-[1.4fr_1fr]">
        <SectionHead kicker={t('contact.kicker')} title={t('contact.title')} />
        <div>
          <p className="font-light leading-8 text-muted-foreground">{t('contact.body')}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={() => setAiOpen(true)} className="bg-[#1B2A41] px-6 py-3 text-sm text-[#F6F1E7] transition-colors hover:bg-[#B8893B] hover:text-[#1B2A41]" data-testid="button-contact-ai">{t('contact.ask')}</button>
            <button type="button" onClick={() => go('institutions')} className="border border-[#1B2A41] px-6 py-3 text-sm transition-colors hover:bg-[#1B2A41] hover:text-[#F6F1E7]" data-testid="button-contact-quote">{t('contact.quote')}</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { data: books, isLoading, isError } = useListBooks();
  const qc = useQueryClient();
  const retry = () => qc.invalidateQueries({ queryKey: getListBooksQueryKey() });
  return (
    <>
      <Hero books={books} />
      <Benefits />
      <Bestsellers books={books} isLoading={isLoading} />
      <Categories books={books} />
      <Catalogue books={books} isLoading={isLoading} isError={isError} onRetry={retry} />
      <Institutions />
      <Contact />
    </>
  );
}
