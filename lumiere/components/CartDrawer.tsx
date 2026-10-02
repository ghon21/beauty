"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cartSubtotal, lineKey, useHydrated, useStore } from "@/lib/store";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/pricing";
import { money } from "@/lib/format";
import { seedProducts } from "@/lib/data";
import ProductVisual from "./ProductVisual";
import { BagIcon, CloseIcon, MinusIcon, PlusIcon, TruckIcon } from "./Icons";

export default function CartDrawer() {
  const hydrated = useHydrated();
  const { lines, open, setOpen, setQty, remove, add } = useStore();
  const subtotal = cartSubtotal(lines);
  const progress = Math.min(1, subtotal / FREE_SHIPPING_THRESHOLD);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  // Cross-sell: popular products not already in the bag, preferring a different category.
  const upsell = useMemo(() => {
    const inBag = new Set(lines.map((l) => l.productId));
    const cats = new Set(lines.map((l) => seedProducts.find((p) => p.id === l.productId)?.category));
    const pool = seedProducts.filter((p) => !inBag.has(p.id) && p.stock > 0 && p.price <= 40);
    return (pool.find((p) => !cats.has(p.category)) ?? pool[0]) ?? null;
  }, [lines]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[70] bg-ink/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
          <motion.aside
            role="dialog" aria-modal="true" aria-label="Shopping bag"
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-[460px] flex-col bg-cream shadow-lift"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 32, stiffness: 280 }}
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <h2 className="font-serif text-2xl">Your bag <span className="text-base text-mute">({hydrated ? lines.reduce((s, l) => s + l.qty, 0) : 0})</span></h2>
              <button onClick={() => setOpen(false)} aria-label="Close bag" className="grid h-10 w-10 place-items-center rounded-full hover:bg-ink/5"><CloseIcon /></button>
            </div>

            <div className="border-b border-ink/10 bg-blush/60 px-6 py-4">
              <p className="flex items-center gap-2 text-[13px]">
                <TruckIcon width={18} height={18} className="text-rose" />
                {remaining > 0 ? (<span>You&apos;re <strong>{money(remaining)}</strong> away from free shipping</span>) : (<strong className="text-rose">You&apos;ve unlocked free shipping 🎉</strong>)}
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-rose-light to-rose" animate={{ width: `${progress * 100}%` }} transition={{ type: "spring", damping: 24 }} />
              </div>
            </div>

            {!hydrated || lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
                <span className="grid h-20 w-20 place-items-center rounded-full bg-blush text-rose"><BagIcon width={32} height={32} /></span>
                <p className="font-serif text-2xl">Your bag is empty</p>
                <p className="text-sm text-mute">Discover our bestsellers and find something you&apos;ll love.</p>
                <Link href="/shop" onClick={() => setOpen(false)} className="btn-primary">Start shopping</Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-ink/10 overflow-y-auto px-6">
                  <AnimatePresence initial={false}>
                    {lines.map((l) => {
                      const key = lineKey(l);
                      return (
                        <motion.li key={key} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                          <div className="flex gap-4 py-5">
                            <Link href={`/product/${l.slug}`} onClick={() => setOpen(false)} className="grid h-24 w-24 shrink-0 place-items-center rounded-2xl" style={{ background: l.tone[0] }}>
                              <ProductVisual visual={l.visual} tone={l.tone} shade={l.shadeHex} className="h-20 w-20" />
                            </Link>
                            <div className="flex flex-1 flex-col">
                              <p className="text-[10px] font-semibold uppercase tracking-widest text-mute">{l.brand}</p>
                              <Link href={`/product/${l.slug}`} onClick={() => setOpen(false)} className="font-serif text-lg leading-tight hover:text-rose">{l.name}</Link>
                              {l.shade && <p className="mt-1 flex items-center gap-1.5 text-xs text-mute"><span className="h-3 w-3 rounded-full border border-ink/10" style={{ background: l.shadeHex }} />{l.shade}</p>}
                              <div className="mt-auto flex items-center justify-between pt-3">
                                <div className="flex items-center rounded-full border border-ink/15">
                                  <button aria-label="Decrease quantity" className="grid h-8 w-8 place-items-center" onClick={() => setQty(key, l.qty - 1)}><MinusIcon width={14} height={14} /></button>
                                  <span className="w-6 text-center text-sm font-medium" aria-live="polite">{l.qty}</span>
                                  <button aria-label="Increase quantity" className="grid h-8 w-8 place-items-center" onClick={() => setQty(key, l.qty + 1)}><PlusIcon width={14} height={14} /></button>
                                </div>
                                <p className="font-semibold">{money(l.price * l.qty)}</p>
                              </div>
                              <button onClick={() => remove(key)} className="mt-2 self-start text-xs text-mute underline-offset-4 hover:text-rose hover:underline">Remove</button>
                            </div>
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>

                  {upsell && (
                    <li className="py-5">
                      <p className="eyebrow mb-3">Complete your ritual</p>
                      <div className="flex items-center gap-4 rounded-2xl bg-white p-3">
                        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-xl" style={{ background: upsell.tone[0] }}>
                          <ProductVisual visual={upsell.visual} tone={upsell.tone} className="h-14 w-14" />
                        </span>
                        <div className="flex-1">
                          <p className="font-serif leading-tight">{upsell.name}</p>
                          <p className="text-sm text-mute">{money(upsell.price)}</p>
                        </div>
                        <button onClick={() => add(upsell, { openCart: false })} className="rounded-full border border-ink px-4 py-2 text-xs font-semibold uppercase tracking-wider transition hover:bg-ink hover:text-white">Add</button>
                      </div>
                    </li>
                  )}
                </ul>

                <div className="border-t border-ink/10 bg-white px-6 py-5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-mute">Subtotal</span>
                    <span className="font-serif text-2xl">{money(subtotal)}</span>
                  </div>
                  <p className="mt-1 text-xs text-mute">Shipping and discount codes are calculated at checkout.</p>
                  <Link href="/checkout" onClick={() => setOpen(false)} className="btn-primary mt-4 w-full">Checkout securely</Link>
                  <button onClick={() => setOpen(false)} className="mt-3 w-full text-center text-xs font-medium uppercase tracking-widest text-mute hover:text-ink">Continue shopping</button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
