import { useState, type FormEvent } from 'react';
import { Link, useLocation } from 'wouter';
import { Check, ShieldAlert, ShoppingBag } from 'lucide-react';
import { useCreateOrder, type Book, type OrderInputCountry } from '@workspace/api-client-react';
import { BookCover } from '@/components/brand';
import { useBooksById } from '@/components/shell';
import { formatKWD, formatNum, useI18n, type TKey } from '@/lib/i18n';
import { demoShipping, getAdapter, paymentAdapters, type PaymentMethod } from '@/lib/payment';
import { RECEIPT_KEY, useStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const COUNTRIES: OrderInputCountry[] = ['KW', 'SA', 'AE', 'QA', 'BH', 'OM'];
type Fields = { name: string; email: string; phone: string; country: OrderInputCountry; city: string; address: string };
type Errs = Partial<Record<keyof Fields, TKey>>;

export function DemoBanner() {
  const { t } = useI18n();
  return (
    <div className="sticky top-20 z-30 flex items-center justify-center gap-3 bg-[#B8893B] px-4 py-2.5 text-center text-xs font-medium text-[#1B2A41] md:text-sm" role="note" data-testid="banner-demo">
      <ShieldAlert className="h-4 w-4 shrink-0" />
      <span><span className="me-2 bg-[#1B2A41] px-1.5 py-0.5 text-[10px] tracking-widest text-[#F6F1E7]">DEMO</span>{t('co.demo')}</span>
    </div>
  );
}

export default function Checkout() {
  const { t, pick, lang } = useI18n();
  const { cart, clear } = useStore();
  const byId = useBooksById();
  const [, setLocation] = useLocation();
  const order = useCreateOrder();
  const [step, setStep] = useState<1 | 2>(1);
  const [f, setF] = useState<Fields>({ name: '', email: '', phone: '', country: 'KW', city: '', address: '' });
  const [errs, setErrs] = useState<Errs>({});
  const [pm, setPm] = useState<PaymentMethod>('knet');
  const [failed, setFailed] = useState(false);

  const lines = Object.entries(cart).map(([id, qty]) => ({ book: byId.get(Number(id)), qty, id: Number(id) }));
  const known = lines.filter((l): l is { book: Book; qty: number; id: number } => !!l.book);
  const subtotal = known.reduce((s, l) => s + l.book.price * l.qty, 0);
  const ship = demoShipping(f.country);

  const validate = () => {
    const e: Errs = {};
    if (f.name.trim().length < 2) e.name = 'v.min2';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'v.email';
    if (!/^\+?[0-9\s-]{7,25}$/.test(f.phone.trim())) e.phone = 'v.phone';
    if (f.city.trim().length < 2) e.city = 'v.min2';
    if (f.address.trim().length < 5) e.address = 'v.min5';
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const next = (e: FormEvent) => { e.preventDefault(); if (validate()) { setStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }); } };

  const place = async () => {
    setFailed(false);
    try {
      const res = await order.mutateAsync({
        data: {
          name: f.name.trim(), email: f.email.trim(), phone: f.phone.trim(), country: f.country, city: f.city.trim(), address: f.address.trim(),
          paymentMethod: pm,
          items: lines.map((l) => ({ bookId: l.id, quantity: l.qty })),
        },
      });
      await getAdapter(pm).authorize({ orderNumber: res.orderNumber, total: res.total });
      localStorage.setItem(RECEIPT_KEY, JSON.stringify({ ...res, paymentMethod: pm, placedAt: new Date().toISOString() }));
      clear();
      setLocation('/confirmation');
    } catch {
      setFailed(true);
    }
  };

  const Steps = (
    <ol className="flex items-center gap-3 text-xs md:gap-5 md:text-sm" aria-label={t('co.title')}>
      {(['co.s1', 'co.s2', 'co.s3'] as TKey[]).map((k, i) => {
        const n = i + 1; const done = n < step; const cur = n === step;
        return (
          <li key={k} className="flex items-center gap-2 md:gap-3" aria-current={cur ? 'step' : undefined}>
            <span className={cn('grid h-7 w-7 place-items-center border text-xs transition-colors duration-300', done ? 'border-[#B8893B] bg-[#B8893B] text-[#1B2A41]' : cur ? 'border-[#1B2A41] bg-[#1B2A41] text-[#F6F1E7]' : 'border-[#1B2A41]/25 text-muted-foreground')}>
              {done ? <Check className="h-3.5 w-3.5" /> : formatNum(n, lang)}
            </span>
            <span className={cn(cur ? 'text-[#1B2A41]' : 'text-muted-foreground')}>{t(k)}</span>
            {n < 3 && <span className="h-px w-6 bg-[#1B2A41]/20 md:w-12" />}
          </li>
        );
      })}
    </ol>
  );

  if (lines.length === 0) {
    return (
      <>
        <DemoBanner />
        <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-32 text-center" data-testid="status-checkout-empty">
          <div className="lattice grid h-24 w-24 place-items-center border border-[#B8893B]/40 text-[#B8893B]"><ShoppingBag className="h-8 w-8" /></div>
          <h1 className="mt-8 text-3xl font-medium">{t('co.empty')}</h1>
          <p className="mt-3 font-light text-muted-foreground">{t('co.emptyBody')}</p>
          <Link href="/" className="mt-8 bg-[#1B2A41] px-6 py-3 text-sm text-[#F6F1E7] transition-colors hover:bg-[#B8893B] hover:text-[#1B2A41]" data-testid="link-back-shop">{t('co.toShop')}</Link>
        </div>
      </>
    );
  }

  const input = 'mt-2 h-12 w-full border border-[#1B2A41]/20 bg-[#FBF8F1] px-3 text-sm outline-none transition-colors hover:border-[#1B2A41]/50 focus:border-[#B8893B] aria-[invalid=true]:border-destructive';
  const field = (k: Exclude<keyof Fields, 'country'>, label: TKey, type = 'text', wide = false, ltr = false) => (
    <label className={cn('block', wide && 'sm:col-span-2')}>
      <span className="text-sm text-[#1B2A41]/80">{t(label)}</span>
      <input type={type} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} aria-invalid={!!errs[k]} dir={ltr ? 'ltr' : undefined} autoComplete={k === 'address' ? 'street-address' : k === 'city' ? 'address-level2' : k === 'phone' ? 'tel' : k} className={cn(input, ltr && 'text-start')} data-testid={`input-${k}`} />
      {errs[k] && <span className="mt-1 block text-xs text-destructive">{t(errs[k]!)}</span>}
    </label>
  );

  return (
    <>
      <DemoBanner />
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h1 className="text-4xl font-medium tracking-tight md:text-5xl">{t('co.title')}</h1>
          {Steps}
        </div>
        <div className="mt-12 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div>
            {step === 1 ? (
              <form onSubmit={next} noValidate className="rise grid gap-6 sm:grid-cols-2" data-testid="form-delivery">
                {field('name', 'co.name', 'text', true)}
                {field('email', 'co.email', 'email', false, true)}
                {field('phone', 'co.phone', 'tel', false, true)}
                <label className="block">
                  <span className="text-sm text-[#1B2A41]/80">{t('co.country')}</span>
                  <select value={f.country} onChange={(e) => setF({ ...f, country: e.target.value as OrderInputCountry })} className={input} data-testid="select-country">
                    {COUNTRIES.map((c) => <option key={c} value={c}>{t(`cty.${c}` as TKey)} — {formatKWD(demoShipping(c), lang)}</option>)}
                  </select>
                </label>
                {field('city', 'co.city')}
                {field('address', 'co.address', 'text', true)}
                <button type="submit" className="bg-[#1B2A41] py-4 text-sm font-medium text-[#F6F1E7] transition-colors duration-300 hover:bg-[#B8893B] hover:text-[#1B2A41] sm:col-span-2" data-testid="button-next-payment">{t('co.next')}</button>
              </form>
            ) : (
              <div className="rise" data-testid="step-payment">
                <h2 className="text-2xl font-medium">{t('co.payTitle')}</h2>
                <p className="mt-2 text-sm font-light text-muted-foreground">{t('co.payNote')}</p>
                <div role="radiogroup" aria-label={t('co.payTitle')} className="mt-6 grid gap-3 sm:grid-cols-2">
                  {paymentAdapters.map((a) => {
                    const on = pm === a.id;
                    return (
                      <button
                        key={a.id}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => setPm(a.id)}
                        className={cn('group flex items-center gap-4 border p-5 text-start transition-all duration-300', on ? 'border-[#1B2A41] bg-[#1B2A41] text-[#F6F1E7]' : 'border-[#1B2A41]/20 hover:border-[#1B2A41]')}
                        data-testid={`radio-pay-${a.id}`}
                      >
                        <span className={cn('grid h-12 w-12 shrink-0 place-items-center border text-xs font-semibold tracking-wider', on ? 'border-[#B8893B] text-[#B8893B]' : 'border-[#1B2A41]/30')} dir="ltr">{a.mark}</span>
                        <span className="flex-1">
                          <span className="block font-medium">{t(a.labelKey)}</span>
                          <span className={cn('block text-xs font-light', on ? 'text-[#F6F1E7]/60' : 'text-muted-foreground')}>{t(a.descKey)}</span>
                        </span>
                        <span className="bg-[#B8893B]/20 px-1.5 py-0.5 text-[9px] tracking-widest text-[#B8893B]">DEMO</span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-8 border border-[#1B2A41]/15 bg-[#EFE7D6] p-5 text-sm leading-7">
                  <p className="font-medium">{f.name}</p>
                  <p className="font-light text-muted-foreground"><span dir="ltr">{f.email}</span> — <span dir="ltr">{f.phone}</span></p>
                  <p className="font-light text-muted-foreground">{f.address}، {f.city}، {t(`cty.${f.country}` as TKey)}</p>
                </div>
                {failed && <p className="mt-6 border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive" role="alert" data-testid="status-order-error">{t('co.err')}</p>}
                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
                  <button type="button" onClick={() => setStep(1)} disabled={order.isPending} className="border border-[#1B2A41]/30 px-6 py-4 text-sm transition-colors hover:border-[#1B2A41]" data-testid="button-back-delivery">{t('co.back')}</button>
                  <button type="button" onClick={place} disabled={order.isPending} className="flex-1 bg-[#1B2A41] py-4 text-sm font-medium text-[#F6F1E7] transition-colors duration-300 hover:bg-[#B8893B] hover:text-[#1B2A41] disabled:opacity-60" data-testid="button-place-order">
                    {order.isPending ? t('co.placing') : t('co.place')}
                  </button>
                </div>
              </div>
            )}
          </div>
          <aside className="h-fit border border-[#1B2A41]/15 bg-[#FBF8F1] p-6 lg:sticky lg:top-36" aria-label={t('co.summary')}>
            <h2 className="text-lg font-medium">{t('co.summary')}</h2>
            <ul className="mt-5 max-h-80 space-y-4 overflow-y-auto">
              {known.map(({ book, qty }) => (
                <li key={book.id} className="flex items-center gap-3">
                  <div className="w-11 shrink-0"><BookCover book={book} size="sm" /></div>
                  <div className="flex-1 text-sm">
                    <p className="leading-snug">{pick(book.title)}</p>
                    <p className="text-xs text-muted-foreground">× {formatNum(qty, lang)}</p>
                  </div>
                  <span className="text-sm tabular-nums">{formatKWD(book.price * qty, lang)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-6 space-y-2 border-t border-[#1B2A41]/10 pt-4 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">{t('cart.subtotal')}</dt><dd className="tabular-nums">{formatKWD(subtotal, lang)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">{t('co.shipping')}</dt><dd className="tabular-nums">{formatKWD(ship, lang)}</dd></div>
              <div className="flex justify-between border-t border-[#1B2A41]/10 pt-3 text-lg font-semibold"><dt>{t('co.total')}</dt><dd className="tabular-nums" data-testid="text-estimated-total">{formatKWD(subtotal + ship, lang)}</dd></div>
            </dl>
            <p className="mt-4 text-xs font-light text-muted-foreground">{t('co.serverNote')}</p>
          </aside>
        </div>
      </div>
    </>
  );
}
