import type { Book } from '@workspace/api-client-react';
import { categoryName } from '@workspace/sifr-data';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export function LogoMark({ className, inverted }: { className?: string; inverted?: boolean }) {
  const fg = inverted ? '#1B2A41' : '#F6F1E7';
  const bg = inverted ? '#F6F1E7' : '#1B2A41';
  return (
    <svg viewBox="0 0 48 48" className={cn('h-10 w-10 shrink-0', className)} aria-hidden="true">
      <rect width="48" height="48" fill={bg} />
      <rect x="3" y="3" width="42" height="42" fill="none" stroke="#B8893B" strokeWidth="1" />
      <path d="M24 15 L11 12 L11 33 L24 36 Z" fill="none" stroke={fg} strokeWidth="2" strokeLinejoin="miter" />
      <path d="M24 15 L37 12 L37 33 L24 36 Z" fill="none" stroke={fg} strokeWidth="2" strokeLinejoin="miter" />
      <path d="M24 15 V36" stroke="#B8893B" strokeWidth="2" />
      <path d="M24 9 L26.5 12 L24 15 L21.5 12 Z" fill="#B8893B" />
    </svg>
  );
}

export function Logo({ inverted }: { inverted?: boolean }) {
  const { t, lang } = useI18n();
  return (
    <span className="flex items-center gap-3">
      <LogoMark inverted={inverted} />
      <span className="flex flex-col leading-none">
        <span className="text-xl font-semibold tracking-tight">{lang === 'ar' ? 'سِفْر' : 'Sifr'}</span>
        <span className="mt-1 text-[10px] font-light tracking-[0.18em] opacity-70">{lang === 'ar' ? 'SIFR' : t('slogan')}</span>
      </span>
    </span>
  );
}

const PATTERNS = ['star', 'arch', 'grid', 'rings'] as const;

function Pattern({ kind, color }: { kind: (typeof PATTERNS)[number]; color: string }) {
  if (kind === 'star')
    return (
      <g stroke={color} fill="none" strokeWidth="0.8" opacity="0.55">
        <rect x="35" y="35" width="50" height="50" />
        <rect x="35" y="35" width="50" height="50" transform="rotate(45 60 60)" />
        <circle cx="60" cy="60" r="12" />
      </g>
    );
  if (kind === 'arch')
    return (
      <g stroke={color} fill="none" strokeWidth="0.8" opacity="0.55">
        <path d="M30 95 V55 Q30 25 60 25 Q90 25 90 55 V95" />
        <path d="M40 95 V58 Q40 35 60 35 Q80 35 80 58 V95" />
        <path d="M50 95 V62 Q50 45 60 45 Q70 45 70 62 V95" />
      </g>
    );
  if (kind === 'grid')
    return (
      <g stroke={color} strokeWidth="0.6" opacity="0.5">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={i}>
            <line x1={20 + i * 16} y1="20" x2={20 + i * 16} y2="100" />
            <line x1="20" y1={20 + i * 16} x2="100" y2={20 + i * 16} />
          </g>
        ))}
        <rect x="52" y="52" width="16" height="16" fill={color} opacity="0.8" />
      </g>
    );
  return (
    <g stroke={color} fill="none" strokeWidth="0.8" opacity="0.55">
      {[10, 20, 30, 40].map((r) => <circle key={r} cx="60" cy="60" r={r} />)}
      <line x1="60" y1="15" x2="60" y2="105" />
    </g>
  );
}

/** Illustrated typographic cover generated from the book's own data. */
export function BookCover({ book, className, size = 'md' }: { book: Book; className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const { pick } = useI18n();
  const kind = PATTERNS[book.id % PATTERNS.length];
  const bg = book.color || '#1B2A41';
  return (
    <div
      className={cn('relative aspect-[3/4] w-full overflow-hidden text-[#F6F1E7] shadow-[6px_8px_0_-2px_rgba(27,42,65,0.18)]', className)}
      style={{ backgroundColor: bg }}
      aria-hidden="true"
    >
      <div className="absolute inset-y-0 start-0 w-[7%] bg-black/20" />
      <div className="absolute inset-[7%] border border-[#B8893B]/70" />
      <svg viewBox="0 0 120 120" className="absolute inset-x-[18%] top-[12%] w-[64%]">
        <Pattern kind={kind} color="#E3C78F" />
      </svg>
      <div className="absolute inset-x-[12%] bottom-[11%] text-center">
        <div className={cn('text-[#E3C78F] tracking-[0.2em] uppercase', size === 'sm' ? 'text-[7px]' : 'text-[9px]')}>{pick(categoryName(book.category))}</div>
        <div className={cn('mt-1.5 font-semibold leading-tight line-clamp-3', size === 'sm' ? 'text-[11px]' : size === 'lg' ? 'text-2xl' : 'text-base')}>{pick(book.title)}</div>
        <div className="mx-auto my-2 h-px w-8 bg-[#B8893B]" />
        <div className={cn('font-light opacity-80 line-clamp-1', size === 'sm' ? 'text-[8px]' : 'text-[11px]')}>{book.author.ar || book.author.en ? pick(book.author) : ''}</div>
      </div>
    </div>
  );
}
