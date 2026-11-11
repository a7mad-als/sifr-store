import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link, useLocation } from 'wouter';
import { Heart, Menu, Minus, Plus, Search, ShoppingBag, Trash2, X, Languages } from 'lucide-react';
import { getListBooksQueryKey, useListBooks, type Book } from '@workspace/api-client-react';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { BookCover, Logo } from '@/components/brand';
import { BookFlags, useBookActions } from '@/components/book-card';
import { useBookMeta } from '@/lib/catalog';
import { formatKWD, formatNum, useI18n, type TKey } from '@/lib/i18n';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export function useGoTo() {
  const [loc, setLocation] = useLocation();
  return (id: string) => {
    const scroll = () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (loc !== '/') { setLocation('/'); setTimeout(scroll, 120); } else scroll();
  };
}

function CountBadge({ n }: { n: number }) {
  if (!n) return null;
  return (
    <span key={n} className="bump absolute -top-1.5 -end-1.5 grid h-[18px] min-w-[18px] place-items-center bg-[#B8893B] px-1 text-[10px] font-semibold text-[#1B2A41]">
      {n}
    </span>
  );
}

export function Nav() {
  const { t, toggle, lang } = useI18n();
  const { favs, cartCount, setCartOpen, setFavOpen, setFilter, filter } = useStore();
  const go = useGoTo();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState(filter.q);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => setQ(filter.q), [filter.q]);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 12);
    f(); window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  const links: [TKey, string][] = [['nav.home', 'top'], ['nav.books', 'books'], ['nav.categories', 'categories'], ['nav.partners', 'partnerships'], ['nav.contact', 'contact']];
  const submit = (e: FormEvent) => { e.preventDefault(); setFilter({ q }); go('books'); setOpen(false); };
  const iconBtn = 'relative grid h-10 w-10 place-items-center text-[#1B2A41] transition-colors duration-300 hover:bg-[#1B2A41] hover:text-[#F6F1E7]';
  return (
    <header className={cn('sticky top-0 z-40 border-b transition-all duration-500', scrolled ? 'border-[#1B2A41]/15 bg-[#F6F1E7]/92 backdrop-blur-md' : 'border-transparent bg-[#F6F1E7]')}>
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-6 px-5 md:px-8">
        <Link href="/" onClick={() => go('top')} className="text-[#1B2A41]" data-testid="link-logo" aria-label={t('nav.home')}>
          <Logo />
        </Link>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="primary">
          {links.map(([k, id]) => (
            <button key={k} type="button" onClick={() => go(id)} className="link-u py-1 text-sm text-[#1B2A41]/80 hover:text-[#1B2A41]" data-testid={`link-nav-${id}`}>
              {t(k)}
            </button>
          ))}
        </nav>
        <form onSubmit={submit} className="ms-auto hidden items-center border-b border-[#1B2A41]/30 focus-within:border-[#B8893B] md:flex" role="search">
          <Search className="h-4 w-4 text-[#1B2A41]/50" />
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setFilter({ q: e.target.value }); }}
            placeholder={t('nav.search')}
            aria-label={t('f.search')}
            className="w-32 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-[#1B2A41]/40 lg:w-40"
            data-testid="input-nav-search"
          />
        </form>
        <div className="ms-auto flex items-center gap-1 md:ms-0">
          <button type="button" onClick={toggle} className="hidden h-10 items-center gap-1.5 px-3 text-xs font-medium text-[#1B2A41] transition-colors hover:bg-[#1B2A41] hover:text-[#F6F1E7] sm:flex" data-testid="button-lang">
            <Languages className="h-4 w-4" /> {t('nav.lang')}
          </button>
          <button type="button" onClick={() => setFavOpen(true)} className={iconBtn} aria-label={`${t('nav.favorites')} ${favs.length}`} data-testid="button-open-favs">
            <Heart className="h-5 w-5" /><CountBadge n={favs.length} />
          </button>
          <button type="button" onClick={() => setCartOpen(true)} className={iconBtn} aria-label={`${t('nav.cart')} ${cartCount}`} data-testid="button-open-cart">
            <ShoppingBag className="h-5 w-5" /><CountBadge n={cartCount} />
          </button>
          <button type="button" onClick={() => setOpen(true)} className={cn(iconBtn, 'lg:hidden')} aria-label={t('nav.menu')} data-testid="button-menu">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side={lang === 'ar' ? 'right' : 'left'} className="w-[86vw] max-w-sm border-none bg-[#1B2A41] p-0 text-[#F6F1E7] [&>button]:text-[#F6F1E7]">
          <SheetTitle className="sr-only">{t('nav.menu')}</SheetTitle>
          <SheetDescription className="sr-only">{t('slogan')}</SheetDescription>
          <div className="flex h-full flex-col p-7">
            <Logo inverted />
            <form onSubmit={submit} className="mt-10 flex items-center border-b border-[#F6F1E7]/30" role="search">
              <Search className="h-4 w-4 opacity-60" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('f.search')} className="w-full bg-transparent px-2 py-3 text-sm outline-none placeholder:text-[#F6F1E7]/40" data-testid="input-mobile-search" />
            </form>
            <nav className="mt-8 flex flex-col">
              {links.map(([k, id], i) => (
                <button key={k} type="button" onClick={() => { setOpen(false); setTimeout(() => go(id), 250); }} className="rise flex items-baseline gap-4 border-b border-[#F6F1E7]/10 py-4 text-start text-2xl font-light transition-colors hover:text-[#B8893B]" style={{ animationDelay: `${i * 50}ms` }} data-testid={`link-mobile-${id}`}>
                  <span className="text-xs text-[#B8893B] tabular-nums">0{i + 1}</span>{t(k)}
                </button>
              ))}
            </nav>
            <button type="button" onClick={toggle} className="mt-auto flex items-center justify-center gap-2 border border-[#F6F1E7]/30 py-3 text-sm transition-colors hover:bg-[#F6F1E7] hover:text-[#1B2A41]" data-testid="button-mobile-lang">
              <Languages className="h-4 w-4" /> {t('nav.lang')}
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}

function DrawerShell({ open, onOpenChange, title, children, footer, testid }: { open: boolean; onOpenChange: (v: boolean) => void; title: string; children: ReactNode; footer?: ReactNode; testid: string }) {
  const { lang, t } = useI18n();
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={lang === 'ar' ? 'left' : 'right'} className="flex w-full flex-col gap-0 border-[#1B2A41]/10 bg-[#F6F1E7] p-0 sm:max-w-md [&>button]:hidden" data-testid={testid}>
        <div className="flex items-center justify-between border-b border-[#1B2A41]/10 px-6 py-5">
          <SheetTitle className="text-xl font-medium text-[#1B2A41]">{title}</SheetTitle>
          <SheetDescription className="sr-only">{title}</SheetDescription>
          <button type="button" onClick={() => onOpenChange(false)} aria-label={t('common.close')} className="grid h-9 w-9 place-items-center transition-colors hover:bg-[#1B2A41] hover:text-[#F6F1E7]" data-testid={`button-close-${testid}`}>
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
        {footer}
      </SheetContent>
    </Sheet>
  );
}

function EmptyDrawer({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center py-16 text-center">
      <div className="lattice grid h-24 w-24 place-items-center border border-[#B8893B]/40 text-[#B8893B]">{icon}</div>
      <p className="mt-6 text-lg font-medium">{title}</p>
      <p className="mt-2 max-w-[16rem] text-sm font-light text-muted-foreground">{body}</p>
    </div>
  );
}

export function useBooksById() {
  const { data } = useListBooks({ query: { queryKey: getListBooksQueryKey() } });
  return useMemo(() => new Map((data ?? []).map((b) => [b.id, b])), [data]);
}

/** Once the live catalogue loads, drop retired/unknown ids from the saved cart and favourites. */
export function CatalogueSync() {
  const { data, isSuccess } = useListBooks({ query: { queryKey: getListBooksQueryKey() } });
  const { prune } = useStore();
  const pruneRef = useRef(prune);
  pruneRef.current = prune;
  useEffect(() => {
    if (isSuccess && data && data.length > 0) pruneRef.current(new Set(data.map((b) => b.id)));
  }, [data, isSuccess]);
  return null;
}

export function CartDrawer() {
  const { t, pick, lang } = useI18n();
  const { cart, cartOpen, setCartOpen, setQty, remove } = useStore();
  const byId = useBooksById();
  const [, setLocation] = useLocation();
  const lines = Object.entries(cart).map(([id, qty]) => ({ book: byId.get(Number(id)), qty, id: Number(id) })).filter((l): l is { book: Book; qty: number; id: number } => !!l.book);
  const subtotal = lines.reduce((s, l) => s + l.book.price * l.qty, 0);
  return (
    <DrawerShell
      open={cartOpen}
      onOpenChange={setCartOpen}
      title={t('cart.title')}
      testid="drawer-cart"
      footer={lines.length > 0 && (
        <div className="border-t border-[#1B2A41]/10 bg-[#EFE7D6] px-6 py-5">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">{t('cart.subtotal')}</span>
            <span className="text-2xl font-semibold tabular-nums" data-testid="text-cart-subtotal">{formatKWD(subtotal, lang)}</span>
          </div>
          <p className="mt-2 text-xs font-light text-muted-foreground">{t('cart.shipNote')}</p>
          <button type="button" onClick={() => { setCartOpen(false); setLocation('/checkout'); }} className="mt-4 w-full bg-[#1B2A41] py-4 text-sm font-medium text-[#F6F1E7] transition-colors duration-300 hover:bg-[#B8893B] hover:text-[#1B2A41]" data-testid="button-checkout">
            {t('cart.checkout')}
          </button>
        </div>
      )}
    >
      {lines.length === 0 ? (
        <EmptyDrawer icon={<ShoppingBag className="h-8 w-8" />} title={t('cart.empty')} body={t('cart.emptyBody')} />
      ) : (
        <ul className="divide-y divide-[#1B2A41]/10">
          {lines.map(({ book, qty }) => (
            <li key={book.id} className="flex gap-4 py-4" data-testid={`row-cart-${book.id}`}>
              <div className="w-16 shrink-0"><BookCover book={book} size="sm" /></div>
              <div className="flex flex-1 flex-col">
                <p className="text-sm font-medium leading-snug">{pick(book.title)}</p>
                <p className="text-xs font-light text-muted-foreground">{book.author.ar || book.author.en ? pick(book.author) : t('b.unknown')}</p>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center border border-[#1B2A41]/20" role="group" aria-label={t('cart.qty')}>
                    <button type="button" onClick={() => setQty(book.id, qty - 1)} disabled={qty <= 1} aria-label={t('cart.dec')} className="grid h-8 w-8 place-items-center transition-colors hover:bg-[#1B2A41] hover:text-[#F6F1E7] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-current" data-testid={`button-dec-${book.id}`}><Minus className="h-3 w-3" /></button>
                    <span className="w-8 text-center text-sm tabular-nums" data-testid={`text-qty-${book.id}`}>{formatNum(qty, lang)}</span>
                    <button type="button" onClick={() => setQty(book.id, qty + 1)} disabled={qty >= 99} aria-label={t('cart.inc')} className="grid h-8 w-8 place-items-center transition-colors hover:bg-[#1B2A41] hover:text-[#F6F1E7] disabled:opacity-30" data-testid={`button-inc-${book.id}`}><Plus className="h-3 w-3" /></button>
                  </div>
                  <span className="text-sm font-semibold tabular-nums">{formatKWD(book.price * qty, lang)}</span>
                </div>
              </div>
              <button type="button" onClick={() => remove(book.id)} aria-label={`${t('cart.remove')} ${pick(book.title)}`} className="self-start p-1.5 text-muted-foreground transition-colors hover:text-destructive" data-testid={`button-remove-${book.id}`}>
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </DrawerShell>
  );
}

export function FavDrawer() {
  const { t, pick, lang } = useI18n();
  const { favs, favOpen, setFavOpen, toggleFav, setQuick } = useStore();
  const byId = useBooksById();
  const { addToCart } = useBookActions();
  const books = favs.map((id) => byId.get(id)).filter((b): b is Book => !!b);
  return (
    <DrawerShell open={favOpen} onOpenChange={setFavOpen} title={t('fav.title')} testid="drawer-favs">
      {books.length === 0 ? (
        <EmptyDrawer icon={<Heart className="h-8 w-8" />} title={t('fav.empty')} body={t('fav.emptyBody')} />
      ) : (
        <ul className="divide-y divide-[#1B2A41]/10">
          {books.map((book) => (
            <li key={book.id} className="flex gap-4 py-4" data-testid={`row-fav-${book.id}`}>
              <button type="button" className="w-16 shrink-0 transition-transform hover:-translate-y-0.5" onClick={() => { setFavOpen(false); setQuick(book); }} aria-label={t('b.quick')}>
                <BookCover book={book} size="sm" />
              </button>
              <div className="flex flex-1 flex-col">
                <p className="text-sm font-medium">{pick(book.title)}</p>
                <p className="text-xs font-light text-muted-foreground">{book.author.ar || book.author.en ? pick(book.author) : t('b.unknown')}</p>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <span className="text-sm font-semibold tabular-nums">{formatKWD(book.price, lang)}</span>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => addToCart(book)} className="border border-[#1B2A41] px-3 py-1.5 text-xs transition-colors hover:bg-[#1B2A41] hover:text-[#F6F1E7]" data-testid={`button-fav-add-${book.id}`}>{t('b.add')}</button>
                    <button type="button" onClick={() => toggleFav(book.id)} aria-label={t('b.unfav')} className="p-1.5 text-muted-foreground hover:text-destructive" data-testid={`button-fav-remove-${book.id}`}><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </DrawerShell>
  );
}

export function QuickView() {
  const { t, pick, lang } = useI18n();
  const { quick, setQuick, favs } = useStore();
  const { addToCart, fav } = useBookActions();
  const m = useBookMeta();
  const b = quick;
  return (
    <Dialog open={!!b} onOpenChange={(o) => !o && setQuick(null)}>
      <DialogContent className="max-h-[92dvh] max-w-3xl overflow-y-auto border-none bg-[#F6F1E7] p-0 [&>button]:end-4 [&>button]:start-auto" data-testid="dialog-quickview">
        {b && (
          <div className="grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <div className="lattice bg-[#EFE7D6] p-10 md:p-12"><BookCover book={b} size="lg" /></div>
            <div className="flex flex-col p-7 md:p-10">
              <span className="text-xs tracking-wider text-[#B8893B]">{m.category(b)}{m.sub(b) && ` / ${m.sub(b)}`}</span>
              <DialogTitle className="mt-2 text-2xl font-semibold leading-tight text-[#1B2A41] md:text-3xl">{pick(b.title)}</DialogTitle>
              <p className="mt-1 font-light text-muted-foreground" data-testid="text-quick-author">{m.author(b)}</p>
              <p className="text-sm font-light text-muted-foreground" data-testid="text-quick-publisher">{t('b.publisher')}: {m.publisher(b)}</p>
              <BookFlags book={b} className="mt-3" />
              <DialogDescription className="mt-5 text-sm font-light leading-7 text-[#1B2A41]/85">{pick(b.description)}</DialogDescription>
              <dl className="mt-6 grid grid-cols-2 gap-px bg-[#1B2A41]/10 text-sm">
                {[
                  [t('b.author'), m.author(b)],
                  [t('b.publisher'), m.publisher(b)],
                  [t('b.category'), m.sub(b) || m.category(b)],
                  [t('b.level'), t(`lv.${b.level}`)],
                  [t('b.binding'), pick(b.binding) || t('b.tbd')],
                  [t('b.pages'), b.pages > 0 ? formatNum(b.pages, lang) : t('b.tbd')],
                  ...(m.volumes(b) ? [[t('b.volumes'), m.volumes(b)]] : []),
                ].map(([k, v]) => (
                  <div key={k} className="bg-[#F6F1E7] p-3">
                    <dt className="text-[11px] text-muted-foreground">{k}</dt>
                    <dd className="mt-0.5 font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8 flex items-center gap-3">
                <span className="flex flex-col"><span className="text-2xl font-semibold tabular-nums">{formatKWD(b.price, lang)}</span><span className="text-[10px] text-muted-foreground">{t('b.demoPrice')}</span></span>
                <button type="button" onClick={() => addToCart(b)} className="ms-auto bg-[#1B2A41] px-5 py-3 text-sm text-[#F6F1E7] transition-colors duration-300 hover:bg-[#B8893B] hover:text-[#1B2A41]" data-testid="button-quick-add">{t('b.add')}</button>
                <button type="button" onClick={() => fav(b)} aria-pressed={favs.includes(b.id)} aria-label={favs.includes(b.id) ? t('b.unfav') : t('b.fav')} className="grid h-11 w-11 place-items-center border border-[#1B2A41]/30 transition-colors hover:border-[#B8893B] hover:text-[#B8893B]" data-testid="button-quick-fav">
                  <Heart className={cn('h-4 w-4', favs.includes(b.id) && 'fill-[#B8893B] text-[#B8893B]')} />
                </button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
