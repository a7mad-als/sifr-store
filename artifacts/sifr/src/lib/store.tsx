import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Book } from '@workspace/api-client-react';

type CartMap = Record<number, number>;
type Ctx = {
  cart: CartMap;
  favs: number[];
  add: (id: number, qty?: number) => void;
  setQty: (id: number, qty: number) => void;
  remove: (id: number) => void;
  clear: () => void;
  toggleFav: (id: number) => boolean;
  cartCount: number;
  cartOpen: boolean; setCartOpen: (v: boolean) => void;
  favOpen: boolean; setFavOpen: (v: boolean) => void;
  quick: Book | null; setQuick: (b: Book | null) => void;
  aiOpen: boolean; setAiOpen: (v: boolean) => void;
  filter: { category: string; sub: string; q: string; nonce: number };
  setFilter: (f: { category?: string; sub?: string; q?: string }) => void;
  /** Drop cart/favourite ids that are not in the live catalogue (e.g. retired books). */
  prune: (valid: Set<number>) => void;
};
const StoreCtx = createContext<Ctx | null>(null);

function load<T>(k: string, d: T): T {
  try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : d; } catch { return d; }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartMap>(() => load('sifr.cart', {}));
  const [favs, setFavs] = useState<number[]>(() => load('sifr.favs', []));
  const [cartOpen, setCartOpen] = useState(false);
  const [favOpen, setFavOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [quick, setQuick] = useState<Book | null>(null);
  const [filter, setF] = useState({ category: 'all', sub: 'all', q: '', nonce: 0 });
  useEffect(() => localStorage.setItem('sifr.cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('sifr.favs', JSON.stringify(favs)), [favs]);
  const clamp = (n: number) => Math.max(1, Math.min(99, n));
  const value: Ctx = {
    cart, favs,
    add: (id, qty = 1) => setCart((c) => ({ ...c, [id]: clamp((c[id] ?? 0) + qty) })),
    setQty: (id, qty) => setCart((c) => ({ ...c, [id]: clamp(qty) })),
    remove: (id) => setCart((c) => { const n = { ...c }; delete n[id]; return n; }),
    clear: () => setCart({}),
    toggleFav: (id) => { const on = !favs.includes(id); setFavs((f) => (on ? [...f, id] : f.filter((x) => x !== id))); return on; },
    cartCount: Object.values(cart).reduce((a, b) => a + b, 0),
    cartOpen, setCartOpen, favOpen, setFavOpen, quick, setQuick, aiOpen, setAiOpen,
    filter,
    setFilter: (f) => setF((p) => {
      const category = f.category ?? p.category;
      const sub = f.sub ?? (category !== p.category ? 'all' : p.sub);
      return { category, sub, q: f.q ?? p.q, nonce: p.nonce + 1 };
    }),
    prune: (valid) => {
      setCart((c) => {
        const bad = Object.keys(c).filter((id) => !valid.has(Number(id)));
        if (!bad.length) return c;
        const n = { ...c }; bad.forEach((id) => delete n[Number(id)]); return n;
      });
      setFavs((f) => (f.every((id) => valid.has(id)) ? f : f.filter((id) => valid.has(id))));
    },
  };
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error('useStore outside provider');
  return c;
}

export const RECEIPT_KEY = 'sifr.receipt';
