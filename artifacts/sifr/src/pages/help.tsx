import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'wouter';
import { FileQuestion } from 'lucide-react';
import type { OrderConfirmation } from '@workspace/api-client-react';
import { storeSettings } from '@workspace/sifr-data';
import { useI18n, type TKey } from '@/lib/i18n';
import { RECEIPT_KEY } from '@/lib/store';
import { cn } from '@/lib/utils';
import { useMarket } from '@/lib/market';

const TOPICS = [...storeSettings.serviceLinks, ...storeSettings.quickLinks.filter((l) => l.path.startsWith('/help/'))];
const DRAFT = new Set(['returns', 'privacy', 'terms', 'shipping', 'payments']);

function Tracking() {
  const { t, lang } = useI18n();
  const { formatPrice } = useMarket();
  const r = useMemo<(OrderConfirmation & { placedAt?: string }) | null>(() => {
    try { const v = localStorage.getItem(RECEIPT_KEY); return v ? JSON.parse(v) : null; } catch { return null; }
  }, []);
  if (!r) return <p className="mt-8 border border-dashed border-[#1B2A41]/25 p-6 text-sm text-muted-foreground" data-testid="status-tracking-none">{t('help.trkNone')}</p>;
  return (
    <dl className="mt-8 space-y-3 border border-[#1B2A41]/15 bg-[#FBF8F1] p-6 text-sm" data-testid="card-tracking">
      <div className="flex justify-between"><dt className="text-muted-foreground">{t('cf.number')}</dt><dd dir="ltr" className="font-mono text-[#B8893B]" data-testid="text-tracking-number">{r.orderNumber}</dd></div>
      {r.placedAt && <div className="flex justify-between"><dt className="text-muted-foreground">{t('co.s3')}</dt><dd>{new Date(r.placedAt).toLocaleString(lang === 'ar' ? 'ar-KW' : 'en-GB')}</dd></div>}
      <div className="flex justify-between"><dt className="text-muted-foreground">{t('cf.total')}</dt><dd className="tabular-nums">{formatPrice(r.total)}</dd></div>
      <p className="border-t border-[#1B2A41]/10 pt-3 font-medium">{t('help.trkStatus')}</p>
    </dl>
  );
}

export default function Help() {
  const { t, pick } = useI18n();
  const { topic } = useParams<{ topic: string }>();
  const item = TOPICS.find((x) => x.id === topic);
  useEffect(() => { window.scrollTo({ top: 0 }); document.getElementById('help-title')?.focus(); }, [topic]);
  if (!item) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-32 text-center" data-testid="status-help-unknown">
        <div className="lattice grid h-24 w-24 place-items-center border border-[#B8893B]/40 text-[#B8893B]"><FileQuestion className="h-8 w-8" /></div>
        <h1 className="mt-8 text-3xl font-medium">{t('help.unknown')}</h1>
        <Link href="/" className="mt-8 bg-[#1B2A41] px-6 py-3 text-sm text-[#F6F1E7]" data-testid="link-help-home">{t('help.back')}</Link>
      </div>
    );
  }
  const body = t(`help.${item.id}` as TKey).split('\n');
  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-[1fr_260px]">
      <article>
        <div className="flex items-center gap-3 text-xs tracking-[0.2em] text-[#B8893B]"><span className="h-px w-8 bg-current" />{t('help.kicker')}</div>
        <h1 id="help-title" tabIndex={-1} className="mt-4 text-4xl font-medium tracking-tight outline-none md:text-5xl" data-testid="text-help-title">{pick(item.name)}</h1>
        {DRAFT.has(item.id) && <p className="mt-6 inline-block bg-[#B8893B]/20 px-3 py-1.5 text-xs text-[#7A5A22]" role="note" data-testid="text-help-draft">{t('help.draft')}</p>}
        <div className="mt-8 space-y-4 text-base font-light leading-8 text-[#1B2A41]/85">{body.map((p, i) => <p key={i}>{p}</p>)}</div>
        {item.id === 'tracking' && <Tracking />}
        <Link href="/" className="mt-12 inline-block border border-[#1B2A41] px-6 py-3 text-sm transition-colors hover:bg-[#1B2A41] hover:text-[#F6F1E7]" data-testid="link-help-back">{t('help.back')}</Link>
      </article>
      <nav aria-label={t('help.others')} className="h-fit border-t border-[#1B2A41] pt-6 lg:sticky lg:top-28">
        <h2 className="text-xs tracking-[0.2em] text-[#B8893B]">{t('help.others')}</h2>
        <ul className="mt-4 space-y-1">
          {TOPICS.map((x) => (
            <li key={x.id}><Link href={x.path} aria-current={x.id === item.id ? 'page' : undefined} className={cn('block px-3 py-2 text-sm transition-colors', x.id === item.id ? 'bg-[#1B2A41] text-[#F6F1E7]' : 'hover:bg-[#EFE7D6]')} data-testid={`link-help-${x.id}`}>{pick(x.name)}</Link></li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
