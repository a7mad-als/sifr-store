import { useState, type FormEvent } from 'react';
import { Link } from 'wouter';
import { CheckCircle2 } from 'lucide-react';
import { useSubscribeNewsletter } from '@workspace/api-client-react';
import { storeSettings } from '@workspace/sifr-data';
import { Logo } from '@/components/brand';
import { useGoTo } from '@/components/shell';
import { useI18n, type TKey } from '@/lib/i18n';

const head = 'text-xs tracking-[0.2em] text-[#B8893B]';
const linkCls = 'link-u text-[#F6F1E7]/80 hover:text-[#F6F1E7]';

function SiteLink({ path, children, id }: { path: string; children: string; id: string }) {
  const go = useGoTo();
  if (path.startsWith('/#')) return <button type="button" onClick={() => go(path.slice(2))} className={linkCls} data-testid={`link-foot-${id}`}>{children}</button>;
  return <Link href={path} className={linkCls} data-testid={`link-foot-${id}`}>{children}</Link>;
}

function Newsletter() {
  const { t, lang } = useI18n();
  const sub = useSubscribeNewsletter();
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [err, setErr] = useState<TKey | null>(null);
  const [ref, setRef] = useState<string | null>(null);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setErr('v.email');
    if (!consent) return setErr('foot.consentReq');
    try {
      const r = await sub.mutateAsync({ data: { email: email.trim(), language: lang } });
      setRef(r.reference);
    } catch { setErr('foot.newsErr'); }
  };
  if (!storeSettings.newsletter.enabled) return null;
  return (
    <div>
      <h4 className={head}>{t('foot.news')}</h4>
      <p className="mt-4 text-xs font-light leading-6 text-[#F6F1E7]/60">{t('foot.newsBody')}</p>
      {ref ? (
        <div className="mt-4 flex items-start gap-2 text-sm" role="status" data-testid="status-newsletter-saved">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#B8893B]" />
          <span>{t('foot.saved')} <span dir="ltr" className="font-mono text-[#B8893B]">{ref}</span></span>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="mt-4 space-y-3">
          <div className="flex border-b border-[#F6F1E7]/30 focus-within:border-[#B8893B]">
            <input type="email" dir="ltr" maxLength={200} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" aria-label={t('co.email')} aria-invalid={err === 'v.email'} className="w-full bg-transparent py-2 text-start text-sm outline-none placeholder:text-[#F6F1E7]/30" data-testid="input-newsletter-email" />
            <button type="submit" disabled={sub.isPending} className="shrink-0 px-3 text-sm text-[#B8893B] hover:text-[#F6F1E7] disabled:opacity-50" data-testid="button-newsletter-submit">{sub.isPending ? t('foot.saving') : t('foot.subscribe')}</button>
          </div>
          <label className="flex items-start gap-2 text-xs font-light text-[#F6F1E7]/70">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 accent-[#B8893B]" data-testid="checkbox-newsletter-consent" />
            {t('foot.consent')}
          </label>
          {err && <p className="text-xs text-[#E8A39A]" role="alert" data-testid="status-newsletter-error">{t(err)}</p>}
        </form>
      )}
    </div>
  );
}

export function Footer() {
  const { t, pick } = useI18n();
  const c = storeSettings.contact;
  const contacts: [TKey, typeof c.email][] = [['cm.email', c.email], ['cm.phone', c.phone], ['cm.whatsapp', c.whatsapp]];
  return (
    <footer className="relative bg-[#1B2A41] text-[#F6F1E7]">
      <div className="gold-rule" />
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:grid-cols-2 md:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr_1.4fr]">
        <div>
          <Logo inverted />
          <h4 className={`${head} mt-8`}>{t('foot.aboutT')}</h4>
          <p className="mt-3 max-w-sm text-sm font-light leading-7 text-[#F6F1E7]/70" data-testid="text-mission">{pick(storeSettings.mission)}</p>
          <p className="mt-4 text-xl font-light text-[#B8893B]">{t('slogan')}</p>
        </div>
        <nav aria-label={t('foot.quick')}>
          <h4 className={head}>{t('foot.quick')}</h4>
          <ul className="mt-5 space-y-3 text-sm font-light">{storeSettings.quickLinks.map((l) => <li key={l.id}><SiteLink path={l.path} id={l.id}>{pick(l.name)}</SiteLink></li>)}</ul>
        </nav>
        <nav aria-label={t('foot.service')}>
          <h4 className={head}>{t('foot.service')}</h4>
          <ul className="mt-5 space-y-3 text-sm font-light">{storeSettings.serviceLinks.map((l) => <li key={l.id}><SiteLink path={l.path} id={l.id}>{pick(l.name)}</SiteLink></li>)}</ul>
        </nav>
        <div>
          <h4 className={head}>{t('foot.contact')}</h4>
          {contacts.some(([, v]) => v.placeholder) && <p className="mt-3 inline-block bg-[#B8893B]/20 px-2 py-0.5 text-[10px] text-[#E3C78F]">{t('foot.temp')}</p>}
          <dl className="mt-4 space-y-3 text-sm font-light">
            {contacts.map(([k, v]) => (
              <div key={k}><dt className="text-[11px] text-[#F6F1E7]/50">{t(k)}</dt><dd dir="ltr" className="break-words text-start text-[#F6F1E7]/60" data-testid={`text-contact-${k}`}>{v.url && !v.placeholder ? <a href={v.url} className={linkCls}>{v.value}</a> : <span>{v.value}</span>}</dd></div>
            ))}
          </dl>
          <h4 className={`${head} mt-8`}>{t('foot.social')}</h4>
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={t('foot.social')}>
            {storeSettings.socials.map((s) => (
              <li key={s.id} aria-disabled={!s.url} title={!s.url ? t('foot.soon') : undefined} className={`border border-[#F6F1E7]/15 px-2 py-1 text-[11px] ${s.url ? 'text-[#F6F1E7]/80' : 'cursor-not-allowed text-[#F6F1E7]/40'}`} data-testid={`text-social-${s.id}`}>{s.url ? <a href={s.url} target="_blank" rel="noopener noreferrer" className={linkCls}>{pick(s.name)}</a> : pick(s.name)}</li>
            ))}
          </ul>
          {storeSettings.socials.some(s => !s.url) && <p className="mt-2 text-[10px] text-[#F6F1E7]/40">{t('foot.soon')}</p>}
        </div>
        <Newsletter />
      </div>
      <div className="mx-auto max-w-7xl px-5 pb-8 md:px-8">
        <h4 className="sr-only">{t('foot.pay')}</h4>
        <div className="flex flex-wrap items-center gap-2" aria-label={t('foot.pay')}>
          <span className="me-2 text-xs text-[#F6F1E7]/50">{t('foot.pay')}</span>
          {storeSettings.paymentMarks.map((m) => <span key={m} dir="ltr" className="border border-[#F6F1E7]/20 px-2.5 py-1 text-[11px] font-semibold tracking-wider text-[#F6F1E7]/70" data-testid={`mark-pay-${m}`}>{m}</span>)}
        </div>
      </div>
      <div className="border-t border-[#F6F1E7]/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs font-light text-[#F6F1E7]/50 md:flex-row md:justify-between md:px-8">
          <span>{t('foot.demo')}</span>
          <span>© {new Date().getFullYear()} {t('brand')} — {t('foot.rights')}</span>
        </div>
      </div>
    </footer>
  );
}
