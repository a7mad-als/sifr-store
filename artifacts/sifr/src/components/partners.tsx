import { useRef, useState, type FormEvent } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useCreateQuote, type QuoteInputContactMethod, type QuoteInputEntityType } from '@workspace/api-client-react';
import { destinations, partnerTracks, storeSettings } from '@workspace/sifr-data';
import { Arrow } from '@/components/section';
import { useI18n, type TKey } from '@/lib/i18n';
import { cn } from '@/lib/utils';

type F = { entityType: QuoteInputEntityType | ''; name: string; country: string; countryOther: string; contactMethod: QuoteInputContactMethod; contact: string; cooperation: string; message: string };
type Errs = Partial<Record<keyof F, TKey>>;
const EMPTY: F = { entityType: '', name: '', country: '', countryOther: '', contactMethod: 'email', contact: '', cooperation: '', message: '' };
const OTHER = '__other';

export function Partners() {
  const { t, pick } = useI18n();
  const quote = useCreateQuote();
  const [f, setF] = useState<F>(EMPTY);
  const [errs, setErrs] = useState<Errs>({});
  const [ref, setRef] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLInputElement>(null);

  const choose = (id: QuoteInputEntityType) => {
    const tr = partnerTracks.find((p) => p.id === id)!;
    setRef(null);
    setF((p) => ({ ...p, entityType: id, cooperation: pick(tr.title) }));
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => firstRef.current?.focus({ preventScroll: true }), 450);
  };

  const validate = () => {
    const e: Errs = {};
    if (!f.entityType) e.entityType = 'v.req';
    if (f.name.trim().length < 2) e.name = 'v.min2';
    if (!f.country) e.country = 'v.req';
    if (f.country === OTHER && f.countryOther.trim().length < 2) e.countryOther = 'v.min2';
    if (f.contactMethod === 'email' ? !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.contact.trim()) : !/^\+?[0-9\s()-]{7,25}$/.test(f.contact.trim())) e.contact = f.contactMethod === 'email' ? 'v.email' : 'v.phone';
    if (f.cooperation.trim().length < 2) e.cooperation = 'v.min2';
    if (f.message.trim().length < 5) e.message = 'v.min5';
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setFailed(false);
    if (!validate() || !f.entityType) return;
    const country = f.country === OTHER ? f.countryOther.trim() : destinations.find((d) => d.code === f.country)?.name.en ?? f.country;
    try {
      const r = await quote.mutateAsync({ data: { entityType: f.entityType, name: f.name.trim(), country, contactMethod: f.contactMethod, contact: f.contact.trim(), cooperation: f.cooperation.trim(), message: f.message.trim() } });
      setRef(r.reference);
    } catch { setFailed(true); }
  };

  const inp = 'mt-2 w-full border-b border-[#F6F1E7]/25 bg-transparent py-2 text-[#F6F1E7] outline-none transition-colors focus:border-[#B8893B] aria-[invalid=true]:border-[#E8A39A] [&>option]:bg-[#1B2A41]';
  const err = (k: keyof F) => errs[k] && <span className="mt-1 block text-xs text-[#E8A39A]" role="alert">{t(errs[k]!)}</span>;
  const set = <K extends keyof F>(k: K, v: F[K]) => setF((p) => ({ ...p, [k]: v }));

  return (
    <section id="partnerships" className="scroll-mt-20 bg-[#1B2A41] text-[#F6F1E7]" aria-labelledby="partners-title">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <div className="flex items-center gap-3 text-xs tracking-[0.2em] text-[#B8893B]"><span className="h-px w-8 bg-current" />{t('p.kicker')}</div>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <h2 id="partners-title" className="text-3xl font-medium leading-tight md:text-5xl">{t('p.title')}</h2>
          <p className="font-light leading-8 text-[#F6F1E7]/70">{t('p.body')}</p>
        </div>
        <ul className="mt-14 grid gap-px bg-[#F6F1E7]/10 sm:grid-cols-2 lg:grid-cols-3">
          {partnerTracks.map((tr, i) => (
            <li key={tr.id} className={cn('group flex flex-col bg-[#1B2A41] p-7 transition-colors duration-500 hover:bg-[#22344F]', f.entityType === tr.id && 'bg-[#22344F]')} data-testid={`card-partner-${tr.id}`}>
              <div className="flex items-center justify-between text-xs text-[#B8893B]"><span>{pick(tr.name)}</span><span className="tabular-nums opacity-60">0{i + 1}</span></div>
              <h3 className="mt-5 text-xl font-medium leading-snug">{pick(tr.title)}</h3>
              <p className="mt-3 flex-1 text-sm font-light leading-7 text-[#F6F1E7]/70">{pick(tr.body)}</p>
              <button type="button" onClick={() => choose(tr.id)} aria-controls="partner-form" className="group mt-6 flex items-center gap-2 self-start border-b border-[#B8893B] pb-1 text-sm text-[#B8893B] transition-colors hover:text-[#F6F1E7]" data-testid={`button-partner-${tr.id}`}>{t('p.cta')} <Arrow className="h-3.5 w-3.5" /></button>
            </li>
          ))}
        </ul>

        <div ref={formRef} id="partner-form" className="mt-16 grid scroll-mt-28 gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <h3 className="text-2xl font-medium">{t('p.formTitle')}</h3>
            <p className="mt-4 text-lg font-light leading-8 text-[#B8893B]" data-testid="text-partnership-response">{pick(storeSettings.partnershipResponse)}</p>
            <p className="mt-6 border-s-2 border-[#B8893B] ps-4 text-xs font-light leading-6 text-[#F6F1E7]/60">{t('p.demo')}</p>
          </div>
          <div className="border border-[#F6F1E7]/15 bg-[#22344F] p-6 md:p-10">
            {ref ? (
              <div className="rise flex flex-col items-start" role="status" data-testid="status-partner-success">
                <CheckCircle2 className="h-10 w-10 text-[#B8893B]" />
                <p className="mt-5 text-2xl font-medium">{t('p.ok')}</p>
                <p className="mt-6 text-xs text-[#F6F1E7]/60">{t('p.ref')}</p>
                <p className="mt-1 font-mono text-2xl tracking-wider text-[#B8893B]" dir="ltr" data-testid="text-partner-reference">{ref}</p>
                <p className="mt-6 text-lg font-light">{pick(storeSettings.partnershipResponse)}</p>
                <p className="mt-4 border-s-2 border-[#B8893B] ps-4 text-sm font-light leading-7 text-[#F6F1E7]/75">{t('p.demo')}</p>
                <button type="button" onClick={() => { setRef(null); setF(EMPTY); }} className="mt-8 border border-[#F6F1E7]/40 px-5 py-2.5 text-sm transition-colors hover:bg-[#F6F1E7] hover:text-[#1B2A41]" data-testid="button-partner-another">{t('p.another')}</button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="grid gap-7 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs text-[#F6F1E7]/60">{t('p.entity')}</span>
                  <select value={f.entityType} onChange={(e) => { const id = e.target.value as QuoteInputEntityType; const tr = partnerTracks.find((p) => p.id === id); setF((p) => ({ ...p, entityType: id, cooperation: tr && (!p.cooperation || partnerTracks.some((x) => pick(x.title) === p.cooperation)) ? pick(tr.title) : p.cooperation })); }} aria-invalid={!!errs.entityType} className={inp} data-testid="select-partner-entity">
                    <option value="" disabled>{t('p.choose')}</option>
                    {partnerTracks.map((p) => <option key={p.id} value={p.id}>{pick(p.name)}</option>)}
                  </select>
                  {err('entityType')}
                </label>
                <label className="block">
                  <span className="text-xs text-[#F6F1E7]/60">{t('p.name')}</span>
                  <input ref={firstRef} value={f.name} maxLength={100} onChange={(e) => set('name', e.target.value)} aria-invalid={!!errs.name} className={inp} data-testid="input-partner-name" />
                  {err('name')}
                </label>
                <label className="block">
                  <span className="text-xs text-[#F6F1E7]/60">{t('p.country')}</span>
                  <select value={f.country} onChange={(e) => set('country', e.target.value)} aria-invalid={!!errs.country} className={inp} data-testid="select-partner-country">
                    <option value="" disabled>{t('p.choose')}</option>
                    {destinations.map((d) => <option key={d.code} value={d.code}>{pick(d.name)}</option>)}
                    <option value={OTHER}>{t('p.other')}</option>
                  </select>
                  {err('country')}
                </label>
                {f.country === OTHER ? (
                  <label className="block">
                    <span className="text-xs text-[#F6F1E7]/60">{t('p.countryOther')}</span>
                    <input value={f.countryOther} maxLength={100} onChange={(e) => set('countryOther', e.target.value)} aria-invalid={!!errs.countryOther} className={inp} data-testid="input-partner-country-other" />
                    {err('countryOther')}
                  </label>
                ) : <div className="hidden sm:block" />}
                <fieldset className="sm:col-span-2">
                  <legend className="text-xs text-[#F6F1E7]/60">{t('p.method')}</legend>
                  <div className="mt-2 flex flex-wrap gap-2" role="radiogroup">
                    {(['email', 'whatsapp', 'phone'] as const).map((m) => (
                      <button key={m} type="button" role="radio" aria-checked={f.contactMethod === m} onClick={() => { set('contactMethod', m); setErrs((p) => ({ ...p, contact: undefined })); }} className={cn('border px-4 py-2 text-sm transition-colors', f.contactMethod === m ? 'border-[#B8893B] bg-[#B8893B] text-[#1B2A41]' : 'border-[#F6F1E7]/25 hover:border-[#F6F1E7]')} data-testid={`radio-partner-method-${m}`}>{t(`cm.${m}`)}</button>
                    ))}
                  </div>
                </fieldset>
                <label className="block sm:col-span-2">
                  <span className="text-xs text-[#F6F1E7]/60">{t('p.contact')} — {t(`cm.${f.contactMethod}`)}</span>
                  <input type={f.contactMethod === 'email' ? 'email' : 'tel'} dir="ltr" maxLength={200} value={f.contact} placeholder={f.contactMethod === 'email' ? 'name@example.com' : '+965 ...'} onChange={(e) => set('contact', e.target.value)} aria-invalid={!!errs.contact} className={cn(inp, 'text-start placeholder:text-[#F6F1E7]/25')} data-testid="input-partner-contact" />
                  {err('contact')}
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-xs text-[#F6F1E7]/60">{t('p.coop')}</span>
                  <input value={f.cooperation} maxLength={200} onChange={(e) => set('cooperation', e.target.value)} aria-invalid={!!errs.cooperation} className={inp} data-testid="input-partner-cooperation" />
                  {err('cooperation')}
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-xs text-[#F6F1E7]/60">{t('p.msg')}</span>
                  <textarea value={f.message} rows={4} maxLength={3000} onChange={(e) => set('message', e.target.value)} aria-invalid={!!errs.message} className={cn(inp, 'resize-none')} data-testid="input-partner-message" />
                  {err('message')}
                </label>
                {failed && <p className="text-sm text-[#E8A39A] sm:col-span-2" role="alert" data-testid="status-partner-error">{t('p.err')}</p>}
                <button type="submit" disabled={quote.isPending} className="group flex items-center justify-center gap-3 bg-[#B8893B] px-6 py-4 text-sm font-medium text-[#1B2A41] transition-colors duration-300 hover:bg-[#F6F1E7] disabled:opacity-60 sm:col-span-2" data-testid="button-partner-submit">
                  {quote.isPending ? t('p.sending') : t('p.submit')} {!quote.isPending && <Arrow />}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
