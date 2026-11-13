import { Eye, Heart, Plus, Check } from 'lucide-react';
import type { Book } from '@workspace/api-client-react';
import { BookCover } from '@/components/brand';
import { useI18n } from '@/lib/i18n';
import { useMarket } from '@/lib/market';
import { useBookMeta } from '@/lib/catalog';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function useBookActions() {
  const { add, toggleFav } = useStore();
  const { t, pick } = useI18n();
  const { toast } = useToast();
  return {
    addToCart: (b: Book) => {
      add(b.id);
      toast({ title: t('toast.added'), description: pick(b.title) });
    },
    fav: (b: Book) => {
      const on = toggleFav(b.id);
      if (on) toast({ title: t('toast.fav'), description: pick(b.title) });
    },
  };
}

export function BookFlags({ book, className }: { book: Book; className?: string }) {
  const { t } = useI18n();
  if (!book.isDemo && !book.metadataProvisional) return null;
  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {book.isDemo && <span className="border border-[#1B2A41]/30 bg-[#F6F1E7] px-1.5 py-0.5 text-[10px] text-[#1B2A41]" data-testid={`badge-demo-${book.id}`}>{t('b.demo')}</span>}
      {book.metadataProvisional && <span className="bg-[#B8893B]/20 px-1.5 py-0.5 text-[10px] text-[#7A5A22]" data-testid={`badge-provisional-${book.id}`}>{t('b.provisional')}</span>}
    </div>
  );
}

export function BookCard({ book, index = 0 }: { book: Book; index?: number }) {
  const { t, pick, lang } = useI18n();
  const { formatPrice } = useMarket();
  const { favs, cart, setQuick } = useStore();
  const { addToCart, fav } = useBookActions();
  const m = useBookMeta();
  const isFav = favs.includes(book.id);
  const inCart = !!cart[book.id];
  const vols = m.volumes(book);
  return (
    <article className="group rise flex flex-col" style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }} data-testid={`card-book-${book.id}`}>
      <div className="relative">
        <button type="button" onClick={() => setQuick(book)} className="block w-full transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:-translate-y-1.5" aria-label={`${t('b.quick')}: ${pick(book.title)}`} data-testid={`button-cover-${book.id}`}>
          <BookCover book={book} />
        </button>
        {vols && <span className="absolute top-3 start-3 bg-[#B8893B] px-2 py-1 text-[10px] font-medium text-[#1B2A41]">{vols}</span>}
        <button type="button" onClick={() => fav(book)} aria-pressed={isFav} aria-label={isFav ? t('b.unfav') : t('b.fav')} className={cn('absolute top-3 end-3 grid h-9 w-9 place-items-center bg-[#F6F1E7]/95 text-[#1B2A41] transition-all duration-300 hover:bg-[#B8893B] hover:text-[#F6F1E7]', isFav && 'text-[#B8893B]')} data-testid={`button-fav-${book.id}`}>
          <Heart className={cn('h-4 w-4 transition-transform', isFav && 'fill-current bump')} />
        </button>
        <button type="button" onClick={() => setQuick(book)} className="absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-center gap-2 bg-[#1B2A41]/95 py-2 text-xs text-[#F6F1E7] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100" data-testid={`button-quick-${book.id}`}>
          <Eye className="h-3.5 w-3.5" /> {t('b.quick')}
        </button>
      </div>
      <div className="mt-5 flex flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#B8893B]">
          <span>{m.sub(book) || m.category(book)}</span>
          <span className="h-px w-3 bg-current" />
          <span className="text-muted-foreground">{t(`lv.${book.level}`)}</span>
        </div>
        <h3 className="mt-2 text-lg font-medium leading-snug" data-testid={`text-title-${book.id}`}>{pick(book.title)}</h3>
        <dl className="mt-1.5 space-y-0.5 text-sm font-light text-muted-foreground">
          <div className="flex gap-1.5"><dt className="sr-only">{t('b.author')}</dt><dd data-testid={`text-author-${book.id}`}>{m.author(book)}</dd></div>
          <div className="flex gap-1.5 text-xs"><dt className="text-[#1B2A41]/50">{t('b.publisher')}:</dt><dd data-testid={`text-publisher-${book.id}`}>{m.publisher(book)}</dd></div>
          <div className="flex gap-1.5 text-xs"><dd>{m.pages(book)}</dd></div>
        </dl>
        <BookFlags book={book} className="mt-2" />
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <span className="flex flex-col">
            <span className="text-base font-semibold tabular-nums" data-testid={`text-price-${book.id}`}>{formatPrice(book.price)}</span>
            <span className="text-[10px] text-muted-foreground">{t('b.demoPrice')}</span>
          </span>
          <button type="button" onClick={() => addToCart(book)} className={cn('flex items-center gap-1.5 border px-3 py-2 text-xs font-medium transition-all duration-300', inCart ? 'border-[#B8893B] bg-[#B8893B] text-[#1B2A41]' : 'border-[#1B2A41] text-[#1B2A41] hover:bg-[#1B2A41] hover:text-[#F6F1E7]')} data-testid={`button-add-${book.id}`}>
            {inCart ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {inCart ? `${t('b.inCart')} (${cart[book.id]})` : t('b.add')}
          </button>
        </div>
      </div>
    </article>
  );
}

export function BookCardSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="aspect-[3/4] w-full animate-pulse bg-[#1B2A41]/10" />
      <div className="mt-5 h-3 w-1/3 animate-pulse bg-[#1B2A41]/10" />
      <div className="mt-3 h-5 w-3/4 animate-pulse bg-[#1B2A41]/10" />
      <div className="mt-2 h-4 w-1/2 animate-pulse bg-[#1B2A41]/10" />
    </div>
  );
}
