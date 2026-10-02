"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartLine, Product } from "./types";

export const lineKey = (l: { productId: number; shade?: string }) => `${l.productId}:${l.shade ?? ""}`;

interface State {
  lines: CartLine[];
  open: boolean;
  promo: string | null;
  wishlist: number[];
  orders: { code: string; total: number; date: string; items: number }[];
  add: (product: Product, opts?: { shade?: string; shadeHex?: string; qty?: number; openCart?: boolean }) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
  setPromo: (code: string | null) => void;
  toggleWishlist: (id: number) => void;
  recordOrder: (o: { code: string; total: number; items: number }) => void;
}

export const useStore = create<State>()(
  persist(
    (set) => ({
      lines: [],
      open: false,
      promo: null,
      wishlist: [],
      orders: [],
      add: (product, opts = {}) =>
        set((s) => {
          const shade = opts.shade ?? product.shades[0]?.name;
          const shadeHex = opts.shadeHex ?? product.shades[0]?.hex;
          const qty = opts.qty ?? 1;
          const key = lineKey({ productId: product.id, shade });
          const existing = s.lines.find((l) => lineKey(l) === key);
          const lines = existing
            ? s.lines.map((l) => (lineKey(l) === key ? { ...l, qty: Math.min(10, l.qty + qty) } : l))
            : [
                ...s.lines,
                {
                  productId: product.id, slug: product.slug, name: product.name, brand: product.brand,
                  price: product.price, shade, shadeHex, qty, visual: product.visual, tone: product.tone,
                },
              ];
          return { lines, open: opts.openCart === false ? s.open : true };
        }),
      setQty: (key, qty) =>
        set((s) => ({
          lines: qty <= 0 ? s.lines.filter((l) => lineKey(l) !== key) : s.lines.map((l) => (lineKey(l) === key ? { ...l, qty: Math.min(10, qty) } : l)),
        })),
      remove: (key) => set((s) => ({ lines: s.lines.filter((l) => lineKey(l) !== key) })),
      clear: () => set({ lines: [], promo: null }),
      setOpen: (open) => set({ open }),
      setPromo: (promo) => set({ promo }),
      toggleWishlist: (id) =>
        set((s) => ({ wishlist: s.wishlist.includes(id) ? s.wishlist.filter((x) => x !== id) : [...s.wishlist, id] })),
      recordOrder: (o) => set((s) => ({ orders: [{ ...o, date: new Date().toISOString() }, ...s.orders].slice(0, 20) })),
    }),
    {
      name: "lumiere-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ lines: s.lines, promo: s.promo, wishlist: s.wishlist, orders: s.orders }),
    },
  ),
);

/** True once mounted on the client — use to avoid SSR/localStorage hydration mismatches. */
export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}

export const cartSubtotal = (lines: CartLine[]) => lines.reduce((s, l) => s + l.price * l.qty, 0);
export const cartCount = (lines: CartLine[]) => lines.reduce((s, l) => s + l.qty, 0);
