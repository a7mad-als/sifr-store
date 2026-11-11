import { useMemo, type ReactNode } from 'react';
import { BadgeCheck, Handshake, Layers, Lock, Truck } from 'lucide-react';
import type { Book } from '@workspace/api-client-react';
import { destinations, taxonomy } from '@workspace/sifr-data';
import { BookCard, BookCardSkeleton, BookFlags } from '@/components/book-card';
import { BookCover } from '@/components/brand';
import { Arrow, SectionHead } from '@/components/section';
import { useGoTo } from '@/components/shell';
import { useBookMeta } from '@/lib/catalog';
import { formatKWD, formatNum, useI18n, type TKey } from '@/lib/i18n';
import { useStore } from '@/lib/store';

export const FEATURED_ID = 13;

export function Hero({ books }: { books: Book[] | undefined }) {
  const { t, lang } = useI18n();
  const go = useGoTo();
  const list = books ?? [];
  const lead = list.find((b) => b.id === FEATURED_ID);
  const picks = [...(lead ? [lead] : []), ...list.filter((b) => b.featured && b.id !== FEATURED_ID), ...list].filter((b, i, a) => a.indexOf(b) === i).slice(0, 3);
  const order = picks.length === 3 ? [picks[1], picks[0], picks[2]] : picks;
  const usedCats = taxonomy.filter((c) => list.some((b) => b.category === c.id)).length;
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="lattice absolute inset-y-0 end-0 hidden w-[46%] bg-[#EFE7D6] lg:block" />
      <div className="relative mx-auto grid max-w-7xl gap-16 px-5 pb-24 pt-14 md:px-8 lg:grid-cols-[1.15fr_1fr] lg:pb-32 lg:pt-24">
        <div className="flex flex-col justify-center">
          <div className="rise flex items-center gap-3 text-xs tracking-[0.2em] text-[#B8893B]"><span className="h-px w-10 bg-current" />{t('hero.kicker')}</div>
          <h1 className="rise mt-8 text-[2.6rem] font-semibold leading-[1.15] tracking-tight text-[#1B2A41] sm:text-6xl lg:text-[4.4rem]" style={{ animationDelay: '80ms' }}>{t('hero.title')}</h1>
          <p className="rise mt-4 text-2xl font-light text-[#B8893B] md:text-3xl" style={{ animationDelay: '160ms' }}>{t('slogan')}</p>
          <p className="rise mt-8 max-w-xl text-base font-light leading-8 text-[#1B2A41]/75 md:text-lg" style={{ animationDelay: '240ms' }}>{t('hero.body')}</p>
          <div className="rise mt-10 flex flex-wrap gap-3" style={{ animationDelay: '320ms' }}>
            <button type="button" onClick={() => go('books')} className="group flex items-center gap-3 bg-[#1B2A41] px-7 py-4 text-sm font-medium text-[#F6F1E7] transition-colors duration-300 hover:bg-[#B8893B] hover:text-[#1B2A41]" data-testid="button-hero-browse">{t('hero.browse')} <Arrow /></button>
            <button type="button" onClick={() => go('partnerships')} className="group flex items-center gap-3 border border-[#1B2A41] px-7 py-4 text-sm font-medium text-[#1B2A41] transition-colors duration-300 hover:bg-[#1B2A41] hover:text-[#F6F1E7]" data-testid="button-hero-partners"><Handshake className="h-4 w-4" /> {t('hero.bulk')}</button>
          </div>
          <dl className="rise mt-14 grid max-w-lg grid-cols-3 border-t border-[#1B2A41]/15 pt-6" style={{ animationDelay: '400ms' }}>
            {([[list.length, 'hero.stat1'], [usedCats || taxonomy.length, 'hero.stat2'], [destinations.length, 'hero.stat3']] as [number, TKey][]).map(([n, k]) => (
              <div key={k}>
                <dt className="sr-only">{t(k)}</dt>
                <dd className="text-3xl font-semibold tabular-nums text-[#1B2A41]" data-testid={`stat-${k}`}>{formatNum(n, lang)}</dd>
                <dd className="mt-1 text-xs font-light text-muted-foreground">{t(k)}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative mx-auto h-[380px] w-full max-w-md sm:h-[460px]">
          {order.length === 3 ? order.map((b, i) => (
            <div key={b.id} className="rise absolute w-[52%] transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)] hover:z-10 hover:-translate-y-3" style={{ animationDelay: `${300 + i * 140}ms`, insetInlineStart: ['4%', '24%', '44%'][i], top: ['14%', '0%', '20%'][i], zIndex: i === 1 ? 3 : 1 }}>
              <BookCover book={b} />
            </div>
          )) : <div className="absolute inset-x-[24%] top-0 aspect-[3/4] animate-pulse bg-[#1B2A41]/10" />}
          <div className="absolute bottom-0 start-0 end-0 h-px bg-[#1B2A41]/30" />
        </div>
      </div>
    </section>
  );
}

export function Benefits() {
  const { t } = useI18n();
  const items: [ReactNode, TKey, TKey][] = [
    [<BadgeCheck key="a" className="h-6 w-6" />, 'ben.1t', 'ben.1b'],
    [<Truck key="b" className="h-6 w-6" />, 'ben.2t', 'ben.2b'],
    [<Lock key="c" className="h-6 w-6" />, 'ben.3t', 'ben.3b'],
  ];
  return (
    <section className="bg-[#1B2A41] text-[#F6F1E7]" aria-label={t('ben.title')}>
      <div className="mx-auto grid max-w-7xl md:grid-cols-[auto_1fr_1fr_1fr]">
        <div className="flex items-center px-5 py-8 md:px-8 md:py-0"><h2 className="text-xs tracking-[0.25em] text-[#B8893B] md:[writing-mode:vertical-rl]">{t('ben.title')}</h2></div>
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

export function FeaturedRelease({ books, isLoading }: { books: Book[] | undefined; isLoading: boolean }) {
  const { t, pick, lang } = useI18n();
  const { setQuick } = useStore();
  const m = useBookMeta();
  const b = books?.find((x) => x.id === FEATURED_ID);
  if (isLoading) return <div className="mx-auto my-20 h-96 max-w-7xl animate-pulse bg-[#1B2A41]/10" />;
  if (!b) return null;
  const vols = m.volumes(b) || t('feat.multi');
  return (
    <section id="special" className="relative scroll-mt-24 overflow-hidden border-b border-[#1B2A41]/10" aria-labelledby="feat-title" data-testid="section-featured">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 md:px-8 md:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="relative mx-auto w-full max-w-[300px]">
          <div className="absolute -inset-6 border border-[#B8893B]/40" />
          {[2, 1].map((n) => <div key={n} className="absolute inset-0 bg-[#1B2A41]/80" style={{ transform: `translate(${n * 10}px, ${n * -10}px)`, opacity: 0.25 * n }} />)}
          <div className="relative"><BookCover book={b} size="lg" /></div>
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-[#B8893B] px-3 py-1 text-xs font-medium tracking-wider text-[#1B2A41]">{t('feat.kicker')}</span>
            <span className="flex items-center gap-1.5 border border-[#1B2A41] px-3 py-1 text-xs"><Layers className="h-3.5 w-3.5" />{vols}</span>
          </div>
          <h2 id="feat-title" className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-[#1B2A41] md:text-6xl" data-testid="text-featured-title">{pick(b.title)}</h2>
          <p className="mt-2 text-lg font-light text-[#B8893B]">{lang === 'ar' ? b.title.en : b.title.ar}</p>
          <p className="mt-6 max-w-xl font-light leading-8 text-[#1B2A41]/80">{t('feat.body')}</p>
          <dl className="mt-8 grid max-w-xl grid-cols-2 gap-px bg-[#1B2A41]/15 text-sm sm:grid-cols-4">
            {([[t('b.author'), m.author(b)], [t('b.publisher'), m.publisher(b)], [t('b.volumes'), vols], [t('b.pages'), m.pages(b)]] as [string, string][]).map(([k, v]) => (
              <div key={k} className="bg-[#F6F1E7] p-3"><dt className="text-[11px] text-muted-foreground">{k}</dt><dd className="mt-0.5 font-medium">{v}</dd></div>
            ))}
          </dl>
          <BookFlags book={b} className="mt-5" />
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <button type="button" onClick={() => setQuick(b)} className="group flex items-center gap-3 bg-[#1B2A41] px-7 py-4 text-sm text-[#F6F1E7] transition-colors hover:bg-[#B8893B] hover:text-[#1B2A41]" data-testid="button-featured-view">{t('feat.view')} <Arrow /></button>
            <span className="text-2xl font-semibold tabular-nums">{formatKWD(b.price, lang)}</span>
            <span className="text-xs text-muted-foreground">{t('b.demoPrice')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function DarTaqwa({ books }: { books: Book[] | undefined }) {
  const { t } = useI18n();
  const list = (books ?? []).filter((b) => b.isDemo).slice(0, 4);
  if (list.length === 0) return null;
  return (
    <section id="dar-taqwa" className="scroll-mt-24 bg-[#EFE7D6]" data-testid="section-dar-taqwa">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-28">
        <SectionHead kicker={t('taqwa.kicker')} title={t('taqwa.title')} />
        <p className="mt-6 max-w-2xl border-s-2 border-[#B8893B] ps-4 text-sm font-light leading-7 text-[#1B2A41]/80" role="note">{t('taqwa.body')}</p>
        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-14 lg:grid-cols-4 lg:gap-x-10">{list.map((b, i) => <BookCard key={b.id} book={b} index={i} />)}</div>
      </div>
    </section>
  );
}

export function Bestsellers({ books, isLoading }: { books: Book[] | undefined; isLoading: boolean }) {
  const { t } = useI18n();
  const list = (books ?? []).filter((b) => b.featured && b.id !== FEATURED_ID && !b.isDemo).slice(0, 4);
  if (!isLoading && list.length === 0) return null;
  return (
    <section id="bestsellers" className="scroll-mt-24">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-28">
        <SectionHead kicker={t('best.kicker')} title={t('best.title')} />
        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-14 lg:grid-cols-4 lg:gap-x-10">
          {isLoading ? Array.from({ length: 4 }).map((_, i) => <BookCardSkeleton key={i} />) : list.map((b, i) => <BookCard key={b.id} book={b} index={i} />)}
        </div>
      </div>
    </section>
  );
}

export function Categories({ books }: { books: Book[] | undefined }) {
  const { t, lang, pick } = useI18n();
  const { setFilter } = useStore();
  const go = useGoTo();
  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    (books ?? []).forEach((b) => { m[b.category] = (m[b.category] ?? 0) + 1; m[`${b.category}/${b.subcategory}`] = (m[`${b.category}/${b.subcategory}`] ?? 0) + 1; });
    return m;
  }, [books]);
  const open = (category: string, sub = 'all') => { setFilter({ category, sub, q: '' }); go('books'); };
  return (
    <section id="categories" className="mx-auto max-w-7xl scroll-mt-24 border-t border-[#1B2A41]/10 px-5 py-24 md:px-8 md:py-32">
      <SectionHead kicker={t('cat.kicker')} title={t('cat.title')} />
      <div className="mt-14 grid gap-px border border-[#1B2A41]/15 bg-[#1B2A41]/15 sm:grid-cols-2 lg:grid-cols-3">
        {taxonomy.map((c, i) => {
          const n = counts[c.id] ?? 0;
          return (
            <div key={c.id} className={n ? 'group relative flex min-h-[200px] flex-col overflow-hidden bg-[#F6F1E7] p-6' : 'relative flex min-h-[200px] flex-col overflow-hidden bg-[#F6F1E7] p-6 opacity-50'} data-testid={`card-category-${c.id}`}>
              <button type="button" disabled={!n} onClick={() => open(c.id)} className="text-start disabled:cursor-not-allowed" data-testid={`button-category-${c.id}`}>
                <span className="text-xs tabular-nums text-[#B8893B]">{String(i + 1).padStart(2, '0')}</span>
                <span className="mt-3 flex items-center gap-2 text-xl font-medium text-[#1B2A41] md:text-2xl">{pick(c.name)} {n > 0 && <Arrow className="h-4 w-4 opacity-0 group-hover:opacity-100" />}</span>
                <span className="mt-1 block text-xs font-light text-muted-foreground">{n ? `${formatNum(n, lang)} ${t('cat.titles')}` : t('cat.empty')}</span>
              </button>
              {c.children.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {c.children.map((s) => {
                    const sn = counts[`${c.id}/${s.id}`] ?? 0;
                    return <button key={s.id} type="button" disabled={!sn} onClick={() => open(c.id, s.id)} className="border border-[#1B2A41]/15 px-2 py-1 text-[11px] text-[#1B2A41]/80 transition-colors enabled:hover:border-[#1B2A41] enabled:hover:bg-[#1B2A41] enabled:hover:text-[#F6F1E7] disabled:cursor-not-allowed disabled:opacity-40" data-testid={`button-sub-${c.id}-${s.id}`}>{pick(s.name)}{sn > 0 && ` · ${formatNum(sn, lang)}`}</button>;
                  })}
                </div>
              )}
              <span className="pointer-events-none absolute -bottom-8 -end-8 h-24 w-24 rotate-45 border border-[#B8893B]/30 transition-transform duration-700 group-hover:rotate-[135deg]" />
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function ShipTo() {
  const { t, pick, lang } = useI18n();
  const tiers = [2, 5, 8].map((rate) => ({ rate, list: destinations.filter((d) => d.demoShipping === rate) }));
  const names: Record<number, TKey> = { 2: 'ship.kw', 5: 'ship.gulf', 8: 'ship.other' };
  return (
    <section id="shipping" className="scroll-mt-24 bg-[#1B2A41] text-[#F6F1E7]" data-testid="section-ship-to">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-28">
        <SectionHead kicker={t('ship.kicker')} title={t('ship.title')} invert>
          <p className="text-5xl font-semibold tabular-nums text-[#B8893B]">{formatNum(destinations.length, lang)} <span className="text-base font-light text-[#F6F1E7]/60">{t('ship.count')}</span></p>
        </SectionHead>
        <div className="mt-14 grid gap-px bg-[#F6F1E7]/10 lg:grid-cols-[1fr_1fr_2fr]">
          {tiers.map(({ rate, list }) => (
            <div key={rate} className="bg-[#1B2A41] p-6 md:p-8">
              <div className="flex items-baseline justify-between border-b border-[#F6F1E7]/10 pb-4">
                <h3 className="text-lg font-medium">{t(names[rate])}</h3>
                <span className="tabular-nums text-[#B8893B]">{formatKWD(rate, lang)}</span>
              </div>
              <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm font-light text-[#F6F1E7]/80">
                {list.map((d) => <li key={d.code} className="flex items-center gap-2" data-testid={`text-dest-${d.code}`}><span className="h-1.5 w-1.5 rotate-45 bg-[#B8893B]" />{pick(d.name)}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl border-s-2 border-[#B8893B] ps-4 text-sm font-light leading-7 text-[#F6F1E7]/70" role="note">{t('ship.note')}</p>
      </div>
    </section>
  );
}

export function Contact() {
  const { t } = useI18n();
  const { setAiOpen } = useStore();
  const go = useGoTo();
  return (
    <section id="contact" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 md:px-8 md:py-32">
      <div className="grid items-end gap-10 md:grid-cols-[1.4fr_1fr]">
        <SectionHead kicker={t('contact.kicker')} title={t('contact.title')} />
        <div>
          <p className="font-light leading-8 text-muted-foreground">{t('contact.body')}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={() => setAiOpen(true)} className="bg-[#1B2A41] px-6 py-3 text-sm text-[#F6F1E7] transition-colors hover:bg-[#B8893B] hover:text-[#1B2A41]" data-testid="button-contact-ai">{t('contact.ask')}</button>
            <button type="button" onClick={() => go('partnerships')} className="border border-[#1B2A41] px-6 py-3 text-sm transition-colors hover:bg-[#1B2A41] hover:text-[#F6F1E7]" data-testid="button-contact-partners">{t('contact.quote')}</button>
          </div>
        </div>
      </div>
    </section>
  );
}
