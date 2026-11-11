import { Link } from 'wouter';
import { LogoMark } from '@/components/brand';
import { useI18n } from '@/lib/i18n';

export default function NotFound() {
  const { t } = useI18n();
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-32 text-center">
      <LogoMark className="h-16 w-16" />
      <p className="mt-8 text-6xl font-light text-[#B8893B]">404</p>
      <h1 className="mt-4 text-2xl font-medium">{t('nf.title')}</h1>
      <Link href="/" className="mt-8 bg-[#1B2A41] px-6 py-3 text-sm text-[#F6F1E7] transition-colors hover:bg-[#B8893B] hover:text-[#1B2A41]">{t('co.toShop')}</Link>
    </div>
  );
}
