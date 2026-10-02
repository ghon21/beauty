"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { discountPct, money } from "@/lib/format";
import { useHydrated, useStore } from "@/lib/store";
import ProductVisual from "./ProductVisual";
import Stars from "./Stars";
import { CheckIcon, ChevronIcon, HeartIcon, MinusIcon, PlusIcon, ReturnIcon, ShieldIcon, TruckIcon } from "./Icons";

export default function ProductClient({ product }: { product: Product }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const add = useStore((s) => s.add);
  const wished = useStore((s) => s.wishlist.includes(product.id));
  const toggleWish = useStore((s) => s.toggleWishlist);
  const [shade, setShade] = useState(product.shades[0]);
  const [qty, setQty] = useState(1);
  const [view, setView] = useState(0);
  const [open, setOpen] = useState<string | null>("Benefits");
  const [skinFilter, setSkinFilter] = useState("All");
  const [justAdded, setJustAdded] = useState(false);

  const off = discountPct(product.price, product.compareAt);
  const soldOut = product.stock === 0;
  const low = product.stock > 0 && product.stock <= 6;

  const reviews = useMemo(() => (skinFilter === "All" ? product.reviews : product.reviews.filter((r) => r.skin === skinFilter)), [product.reviews, skinFilter]);
  const skins = useMemo(() => ["All", ...Array.from(new Set(product.reviews.map((r) => r.skin)))], [product.reviews]);
  const dist = [5, 4, 3, 2, 1].map((n) => ({ n, pct: n === 5 ? 78 : n === 4 ? 16 : n === 3 ? 4 : n === 2 ? 1 : 1 }));

  const views = [
    <ProductVisual key="front" visual={product.visual} tone={product.tone} shade={shade.hex} className="h-full w-full p-10 sm:p-16" />,
    <ProductVisual key="angle" visual={product.visual} tone={product.tone} shade={shade.hex} rotate={-12} className="h-full w-full p-14 sm:p-20" />,
    <div key="swatch" className="grid h-full w-full place-items-center p-8">
      <div className="relative h-4/5 w-4/5 overflow-hidden rounded-[3rem]" style={{ background: `radial-gradient(circle at 30% 30%, #fff8, transparent 40%), ${shade.hex}` }}>
        <div className="absolute inset-x-0 bottom-0 bg-white/80 p-5 text-center backdrop-blur"><p className="font-serif text-xl">{shade.name}</p><p className="text-xs text-mute">Swatch preview</p></div>
      </div>
    </div>,
    <div key="mood" className="grid h-full w-full place-items-center p-8" style={{ background: `linear-gradient(135deg, ${product.tone[1]}, ${product.tone[0]})` }}>
      <div className="flex items-end gap-4">
        <ProductVisual visual={product.visual} tone={product.tone} shade={shade.hex} className="w-40 sm:w-52" rotate={-8} />
        <ProductVisual visual={product.visual} tone={product.tone} shade={shade.hex} className="w-28 opacity-80 sm:w-36" rotate={10} />
      </div>
    </div>,
  ];

  const addToBag = (open = true) => {
    add(product, { shade: shade.name, shadeHex: shade.hex, qty, openCart: open });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  const sections: [string, React.ReactNode][] = [
    ["Benefits", <ul key="b" className="space-y-2.5">{product.benefits.map((b) => <li key={b} className="flex gap-3"><CheckIcon className="mt-0.5 shrink-0 text-rose" width={18} height={18} />{b}</li>)}</ul>],
    ["How to use", <p key="h">{product.howToUse}</p>],
    ["Ingredients", <p key="i" className="text-sm text-mute">{product.ingredients}</p>],
    ["Shipping & returns", <p key="s">Free standard shipping over $75 (3-5 business days). Express 1-2 days. Return unopened items within 14 days for a full refund.</p>],
  ];

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative aspect-square overflow-hidden rounded-[2.5rem]" style={{ background: `linear-gradient(160deg, ${product.tone[0]}, #fff 130%)` }}>
            <AnimatePresence mode="wait">
              <motion.div key={view} className="h-full w-full" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
                {views[view]}
              </motion.div>
            </AnimatePresence>
            {product.badge && <span className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest">{product.badge}</span>}
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {views.map((_, i) => (
              <button key={i} onClick={() => setView(i)} aria-label={`View ${i + 1}`} aria-pressed={view === i} className={`aspect-square overflow-hidden rounded-2xl border-2 transition ${view === i ? "border-ink" : "border-transparent opacity-70 hover:opacity-100"}`} style={{ background: product.tone[0] }}>
                <div className="pointer-events-none h-full w-full scale-90">{views[i]}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mute">{product.brand} · {product.subcategory}</p>
          <h1 className="h-display mt-3 text-4xl sm:text-5xl">{product.name}</h1>
          <a href="#reviews" className="mt-4 inline-flex items-center gap-3">
            <Stars rating={product.rating} size={17} /><span className="text-sm underline-offset-4 hover:underline">{product.rating} · {product.reviewCount.toLocaleString()} reviews</span>
          </a>
          <p className="mt-5 text-lg text-ink/80">{product.tagline}</p>

          <p className="mt-6 flex items-baseline gap-3">
            <span className="font-serif text-4xl">{money(product.price)}</span>
            {product.compareAt && (<><span className="text-lg text-mute line-through">{money(product.compareAt)}</span><span className="rounded-full bg-rose px-3 py-1 text-xs font-bold text-white">Save {off}%</span></>)}
          </p>

          {product.shades.length > 1 && (
            <div className="mt-8">
              <p className="text-sm"><span className="font-semibold">Shade:</span> {shade.name}</p>
              <div className="mt-3 flex flex-wrap gap-3" role="radiogroup" aria-label="Choose shade">
                {product.shades.map((s) => (
                  <button key={s.name} role="radio" aria-checked={shade.name === s.name} aria-label={s.name} title={s.name} onClick={() => setShade(s)}
                    className={`relative h-11 w-11 rounded-full border-2 border-white shadow-soft transition hover:scale-110 ${shade.name === s.name ? "ring-2 ring-ink ring-offset-2" : ""}`} style={{ background: s.hex }}>
                    {shade.name === s.name && <CheckIcon className="absolute inset-0 m-auto text-white mix-blend-difference" width={18} height={18} />}
                  </button>
                ))}
              </div>
            </div>
          )}
          {product.shades.length === 1 && <p className="mt-6 text-sm text-mute">Size: {product.shades[0].name}</p>}

          {low && <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-rose-pale px-4 py-2 text-sm font-medium text-rose-deep"><span className="h-2 w-2 animate-pulse rounded-full bg-rose" />Only {product.stock} left in stock — order soon</p>}

          <div className="mt-8 flex items-center gap-3">
            <div className="flex items-center rounded-full border border-ink/20">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" className="grid h-12 w-12 place-items-center"><MinusIcon width={16} height={16} /></button>
              <span className="w-8 text-center font-medium" aria-live="polite">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(Math.min(10, product.stock || 1), q + 1))} aria-label="Increase quantity" className="grid h-12 w-12 place-items-center"><PlusIcon width={16} height={16} /></button>
            </div>
            <button onClick={() => addToBag()} disabled={soldOut} className="btn-primary flex-1 py-4">
              {soldOut ? "Sold out" : justAdded ? (<><CheckIcon width={18} height={18} /> Added</>) : `Add to bag — ${money(product.price * qty)}`}
            </button>
            <button onClick={() => toggleWish(product.id)} aria-label={wished ? "Remove from wishlist" : "Add to wishlist"} aria-pressed={hydrated && wished} className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full border border-ink/20 transition hover:border-rose hover:text-rose">
              <HeartIcon filled={hydrated && wished} className={hydrated && wished ? "text-rose" : ""} />
            </button>
          </div>
          <button onClick={() => { addToBag(false); router.push("/checkout"); }} disabled={soldOut} className="btn-rose mt-3 w-full py-4">Buy it now</button>

          <ul className="mt-8 grid grid-cols-3 gap-3 text-center text-xs">
            {[[TruckIcon, "Free shipping over $75"], [ReturnIcon, "14-day returns"], [ShieldIcon, "100% authentic"]].map(([Icon, t], i) => {
              const I = Icon as typeof TruckIcon;
              return <li key={i} className="rounded-2xl bg-white p-4"><I className="mx-auto mb-2 text-rose" />{t as string}</li>;
            })}
          </ul>

          <p className="mt-10 leading-relaxed text-ink/80">{product.description}</p>

          <div className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
            {sections.map(([title, body]) => (
              <div key={title}>
                <button onClick={() => setOpen(open === title ? null : title)} aria-expanded={open === title} className="flex w-full items-center justify-between py-5 text-left font-serif text-xl">
                  {title}<ChevronIcon className={`transition ${open === title ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {open === title && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="pb-6 text-ink/80">{body}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section id="reviews" className="mt-28 scroll-mt-28">
        <div className="grid gap-12 lg:grid-cols-[320px_1fr]">
          <div>
            <p className="eyebrow">Reviews</p>
            <h2 className="h-display mt-3 text-4xl">What customers say</h2>
            <p className="mt-6 font-serif text-7xl">{product.rating}</p>
            <Stars rating={product.rating} size={20} />
            <p className="mt-2 text-sm text-mute">{product.reviewCount.toLocaleString()} verified reviews</p>
            <div className="mt-6 space-y-2">
              {dist.map((d) => (
                <div key={d.n} className="flex items-center gap-3 text-xs"><span className="w-3">{d.n}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink/10"><motion.div className="h-full bg-gold" initial={{ width: 0 }} whileInView={{ width: `${d.pct}%` }} viewport={{ once: true }} transition={{ duration: 0.9 }} /></div>
                  <span className="w-8 text-right text-mute">{d.pct}%</span></div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex flex-wrap gap-2">
              {skins.map((s) => <button key={s} onClick={() => setSkinFilter(s)} className={`chip ${skinFilter === s ? "chip-active" : ""}`}>{s === "All" ? "All skin types" : `${s} skin`}</button>)}
            </div>
            <ul className="mt-6 space-y-5">
              {reviews.map((r, i) => (
                <li key={i} className="rounded-3xl bg-white p-7">
                  <div className="flex items-center justify-between"><Stars rating={r.rating} /><span className="text-xs text-mute">{r.date}</span></div>
                  <h3 className="mt-3 font-serif text-xl">{r.title}</h3>
                  <p className="mt-2 text-ink/80">{r.body}</p>
                  <p className="mt-4 flex flex-wrap items-center gap-2 text-xs text-mute"><strong className="text-ink">{r.author}</strong> · {r.skin} skin{r.verified && <span className="inline-flex items-center gap-1 text-rose"><ShieldIcon width={13} height={13} />Verified buyer</span>}</p>
                </li>
              ))}
              {reviews.length === 0 && <p className="text-mute">No reviews for this skin type yet.</p>}
            </ul>
          </div>
        </div>
      </section>

      {/* Sticky mobile purchase bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-cream/95 p-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1"><p className="truncate font-serif leading-tight">{product.name}</p><p className="text-sm font-semibold">{money(product.price)}</p></div>
          <button onClick={() => addToBag()} disabled={soldOut} className="btn-primary px-6 py-3">{soldOut ? "Sold out" : "Add to bag"}</button>
        </div>
      </div>
    </>
  );
}
