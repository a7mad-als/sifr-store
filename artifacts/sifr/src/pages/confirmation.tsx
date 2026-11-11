import { useMemo } from 'react';
import { Link } from 'wouter';
import { CheckCircle2, FileQuestion } from 'lucide-react';
import type { OrderConfirmation } from '@workspace/api-client-react';
import { DemoBanner } from '@/pages/checkout';
import { formatKWD, useI18n } from '@/lib/i18n';
import { getAdapter, type PaymentMethod } from '@/lib/payment';
import { RECEIPT_KEY } from '@/lib/store';

type Receipt = OrderConfirmation & { paymentMethod: PaymentMethod; placedAt: string };

export default function Confirmation() {
  const { t, lang } = useI18n();
  const r = useMemo<Receipt | null>(() => {
    try { const v = localStorage.getItem(RECEIPT_KEY); return v ? (JSON.parse(v) as Receipt) : null; } catch { return null; }
  }, []);
  const back = (
    <Link href="/" className="mt-10 inline-block bg-[#1B2A41] px-6 py-3 text-sm text-[#F6F1E7] transition-colors hover:bg-[#B8893B] hover:text-[#1B2A41]" data-testid="link-continue">{t('cf.continue')}</Link>
  );
  if (!r) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-32 text-center" data-testid="status-no-receipt">
        <div className="lattice grid h-24 w-24 place-items-center border border-[#B8893B]/40 text-[#B8893B]"><FileQuestion className="h-8 w-8" /></div>
        <h1 className="mt-8 text-3xl font-medium">{t('cf.none')}</h1>
        <p className="mt-3 font-light text-muted-foreground">{t('cf.noneBody')}</p>
        {back}
      </div>
    );
  }
  const a = getAdapter(r.paymentMethod);
  return (
    <>
      <DemoBanner />
      <div className="mx-auto max-w-2xl px-5 py-16 md:py-24">
        <div className="rise border border-[#1B2A41]/15 bg-[#FBF8F1]">
          <div className="lattice bg-[#1B2A41] px-8 py-10 text-[#F6F1E7]">
            <CheckCircle2 className="h-10 w-10 text-[#B8893B]" />
            <h1 className="mt-5 text-2xl font-medium md:text-3xl">{t('cf.title')}</h1>
            <p className="mt-6 text-xs text-[#F6F1E7]/60">{t('cf.number')}</p>
            <p className="mt-1 font-mono text-2xl tracking-wider text-[#B8893B]" dir="ltr" data-testid="text-order-number">{r.orderNumber}</p>
          </div>
          <dl className="space-y-3 px-8 py-8 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">{t('cf.subtotal')}</dt><dd className="tabular-nums" data-testid="text-subtotal">{formatKWD(r.subtotal, lang)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">{t('cf.shipping')}</dt><dd className="tabular-nums" data-testid="text-shipping">{formatKWD(r.shipping, lang)}</dd></div>
            <div className="flex justify-between border-t border-[#1B2A41]/10 pt-4 text-xl font-semibold"><dt>{t('cf.total')}</dt><dd className="tabular-nums" data-testid="text-total">{formatKWD(r.total, lang)}</dd></div>
            <div className="flex justify-between pt-2"><dt className="text-muted-foreground">{t('cf.method')}</dt><dd>{t(a.labelKey)}</dd></div>
          </dl>
          <p className="border-t border-[#1B2A41]/10 bg-[#B8893B]/15 px-8 py-4 text-sm text-[#1B2A41]" data-testid="text-demo-note">{t('cf.demo')}</p>
        </div>
        <div className="text-center">{back}</div>
      </div>
    </>
  );
}
