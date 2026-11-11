import type { ReactNode } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export function Arrow({ className }: { className?: string }) {
  const { dir } = useI18n();
  const A = dir === 'rtl' ? ArrowLeft : ArrowRight;
  return <A className={cn('h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1', className)} />;
}

export function SectionHead({ kicker, title, children, invert }: { kicker: string; title: string; children?: ReactNode; invert?: boolean }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="flex items-center gap-3 text-xs tracking-[0.2em] text-[#B8893B]"><span className="h-px w-8 bg-current" />{kicker}</div>
        <h2 className={cn('mt-4 text-3xl font-medium tracking-tight md:text-5xl', invert ? 'text-[#F6F1E7]' : 'text-[#1B2A41]')}>{title}</h2>
      </div>
      {children}
    </div>
  );
}
