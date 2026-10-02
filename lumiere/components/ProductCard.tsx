"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { discountPct, money } from "@/lib/format";
import { useHydrated, useStore } from "@/lib/store";
import ProductVisual from "./ProductVisual";
import Stars from "./Stars";
import { BagIcon, HeartIcon } from "./Icons";

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const add = useStore((s) => s.add);
  const wished = useStore((s) => s.wishlist.includes(product.id));
  const toggle = useStore((s) => s.toggleWishlist);
  const hydrated = useHydrated();
  const off = discountPct(product.price, product.compareAt);
  const multi = product.shades.length > 1;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: Math.min(index, 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-3xl" style={{ background: `linear-gradient(160deg, ${product.tone[0]}, #fff 140%)` }}>
        <Link href={`/product/${product.slug}`} className="block aspect-[4/5]" aria-label={product.name}>
          <ProductVisual visual={product.visual} tone={product.tone} className="h-full w-full p-8 transition duration-700 ease-out group-hover:scale-[1.07] group-hover:-rotate-2" />
        </Link>

        <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-1.5">
          {product.badge && (
            <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${product.badge === "Sale" ? "bg-rose text-white" : "bg-white/90 text-ink"}`}>
              {product.badge === "Sale" && off ? `-${off}%` : product.badge}
            </span>
          )}
          {product.stock > 0 && product.stock <= 6 && (
            <span className="rounded-full bg-ink px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">Only {product.stock} left</span>
          )}
        </div>

        <button
          onClick={() => toggle(product.id)}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={hydrated && wished}
          className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-ink shadow-soft backdrop-blur transition hover:scale-110 hover:text-rose"
        >
          <HeartIcon width={18} height={18} filled={hydrated && wished} className={hydrated && wished ? "text-rose" : ""} />
        </button>

        <div className="absolute inset-x-4 bottom-4 translate-y-3 opacity-0 transition duration-500 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 max-md:translate-y-0 max-md:opacity-100">
          {multi ? (
            <Link href={`/product/${product.slug}`} className="btn w-full bg-white/95 py-3 text-ink shadow-soft backdrop-blur hover:bg-ink hover:text-white">
              Select shade
            </Link>
          ) : (
            <button
              onClick={() => add(product)}
              disabled={product.stock === 0}
              className="btn w-full bg-ink/95 py-3 text-white shadow-soft backdrop-blur hover:bg-rose"
            >
              <BagIcon width={16} height={16} /> {product.stock === 0 ? "Sold out" : "Quick add"}
            </button>
          )}
        </div>
      </div>

      <div className="px-1 pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-mute">{product.brand}</p>
        <Link href={`/product/${product.slug}`} className="mt-1 block font-serif text-[19px] leading-snug transition hover:text-rose">
          {product.name}
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <Stars rating={product.rating} />
          <span className="text-xs text-mute">({product.reviewCount.toLocaleString()})</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <p className="flex items-baseline gap-2">
            <span className="text-base font-semibold">{money(product.price)}</span>
            {product.compareAt && <span className="text-sm text-mute line-through">{money(product.compareAt)}</span>}
          </p>
          {multi && (
            <span className="flex -space-x-1">
              {product.shades.slice(0, 5).map((s) => (
                <span key={s.name} title={s.name} className="h-4 w-4 rounded-full border-2 border-cream" style={{ background: s.hex }} />
              ))}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
