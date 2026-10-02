"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";
import { ChevronIcon, CloseIcon } from "./Icons";
import { money } from "@/lib/format";

type Sort = "popular" | "new" | "low" | "high" | "rating";

const sorts: { v: Sort; label: string }[] = [
  { v: "popular", label: "Bestselling" },
  { v: "new", label: "Newest" },
  { v: "rating", label: "Top rated" },
  { v: "low", label: "Price: low to high" },
  { v: "high", label: "Price: high to low" },
];

export default function ShopClient({ products, showCategories = true }: { products: Product[]; showCategories?: boolean }) {
  const maxPrice = Math.ceil(Math.max(...products.map((p) => p.price)) / 10) * 10;
  const [sort, setSort] = useState<Sort>("popular");
  const [cats, setCats] = useState<string[]>([]);
  const [brandSel, setBrandSel] = useState<string[]>([]);
  const [skin, setSkin] = useState<string[]>([]);
  const [price, setPrice] = useState(maxPrice);
  const [minRating, setMinRating] = useState(0);
  const [inStock, setInStock] = useState(false);
  const [panel, setPanel] = useState(false);

  const brandList = useMemo(() => Array.from(new Set(products.map((p) => p.brand))).sort(), [products]);
  const catList = useMemo(() => Array.from(new Set(products.map((p) => p.category))), [products]);
  const skinList = useMemo(() => Array.from(new Set(products.flatMap((p) => p.skinTypes))).filter((s) => s !== "All").sort(), [products]);

  const filtered = useMemo(() => {
    const list = products.filter(
      (p) =>
        (cats.length === 0 || cats.includes(p.category)) &&
        (brandSel.length === 0 || brandSel.includes(p.brand)) &&
        (skin.length === 0 || p.skinTypes.some((s) => skin.includes(s) || s === "All")) &&
        p.price <= price && p.rating >= minRating && (!inStock || p.stock > 0),
    );
    const by: Record<Sort, (a: Product, b: Product) => number> = {
      popular: (a, b) => b.popularity - a.popularity,
      new: (a, b) => b.createdAt.localeCompare(a.createdAt),
      rating: (a, b) => b.rating - a.rating,
      low: (a, b) => a.price - b.price,
      high: (a, b) => b.price - a.price,
    };
    return [...list].sort(by[sort]);
  }, [products, cats, brandSel, skin, price, minRating, inStock, sort]);

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const active = cats.length + brandSel.length + skin.length + (price < maxPrice ? 1 : 0) + (minRating ? 1 : 0) + (inStock ? 1 : 0);
  const reset = () => { setCats([]); setBrandSel([]); setSkin([]); setPrice(maxPrice); setMinRating(0); setInStock(false); };

  const filters = (
    <div className="space-y-9">
      {showCategories && catList.length > 1 && (
        <Group title="Category">{catList.map((c) => <Check key={c} label={c} on={cats.includes(c)} onChange={() => toggle(cats, setCats, c)} cap />)}</Group>
      )}
      <Group title="Brand">{brandList.map((b) => <Check key={b} label={b} on={brandSel.includes(b)} onChange={() => toggle(brandSel, setBrandSel, b)} />)}</Group>
      <Group title="Skin / hair type">{skinList.map((s) => <Check key={s} label={s} on={skin.includes(s)} onChange={() => toggle(skin, setSkin, s)} />)}</Group>
      <Group title={`Max price — ${money(price)}`}>
        <input type="range" min={10} max={maxPrice} step={5} value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full accent-rose" aria-label="Maximum price" />
      </Group>
      <Group title="Rating">
        <div className="flex flex-wrap gap-2">
          {[0, 4, 4.5, 4.8].map((r) => <button key={r} onClick={() => setMinRating(r)} className={`chip ${minRating === r ? "chip-active" : ""}`}>{r === 0 ? "Any" : `${r}+ ★`}</button>)}
        </div>
      </Group>
      <label className="flex cursor-pointer items-center gap-3 text-sm"><input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="h-4 w-4 accent-rose" /> In stock only</label>
      {active > 0 && <button onClick={reset} className="text-sm text-rose underline underline-offset-4">Clear all filters ({active})</button>}
    </div>
  );

  return (
    <div className="grid gap-12 lg:grid-cols-[250px_1fr]">
      <aside className="hidden lg:block"><div className="sticky top-28">{filters}</div></aside>

      <div>
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-5">
          <p className="text-sm text-mute"><strong className="text-ink">{filtered.length}</strong> {filtered.length === 1 ? "product" : "products"}</p>
          <div className="flex items-center gap-3">
            <button onClick={() => setPanel(true)} className="btn-ghost px-5 py-2.5 lg:hidden">Filters{active > 0 && ` (${active})`}</button>
            <div className="relative">
              <label htmlFor="sort" className="sr-only">Sort by</label>
              <select id="sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="appearance-none rounded-full border border-ink/15 bg-white py-2.5 pl-5 pr-11 text-sm outline-none focus:border-rose">
                {sorts.map((s) => <option key={s.v} value={s.v}>{s.label}</option>)}
              </select>
              <ChevronIcon className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" width={16} height={16} />
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-serif text-3xl">No products match your filters</p>
            <button onClick={reset} className="btn-primary mt-6">Clear filters</button>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {panel && (
          <>
            <motion.div className="fixed inset-0 z-[65] bg-ink/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPanel(false)} />
            <motion.div className="fixed inset-x-0 bottom-0 z-[65] max-h-[85vh] overflow-y-auto rounded-t-[2rem] bg-cream p-7" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 260 }}>
              <div className="mb-6 flex items-center justify-between"><h2 className="font-serif text-2xl">Filters</h2><button onClick={() => setPanel(false)} aria-label="Close filters"><CloseIcon /></button></div>
              {filters}
              <button onClick={() => setPanel(false)} className="btn-primary mt-8 w-full">Show {filtered.length} results</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-4 text-xs font-semibold uppercase tracking-[0.2em]">{title}</legend>
      <div className="space-y-2.5">{children}</div>
    </fieldset>
  );
}

function Check({ label, on, onChange, cap }: { label: string; on: boolean; onChange: () => void; cap?: boolean }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm text-ink/80 transition hover:text-ink">
      <input type="checkbox" checked={on} onChange={onChange} className="h-4 w-4 rounded accent-rose" />
      <span className={cap ? "capitalize" : ""}>{label}</span>
    </label>
  );
}
