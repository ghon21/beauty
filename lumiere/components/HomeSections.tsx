"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { brands, categories, testimonials } from "@/lib/data";
import type { Product } from "@/lib/types";
import ProductVisual from "./ProductVisual";
import Stars from "./Stars";
import Reveal from "./Reveal";
import Countdown from "./Countdown";
import { ArrowIcon, GiftIcon, InstagramIcon, LeafIcon, ReturnIcon, ShieldIcon, TruckIcon } from "./Icons";
import { money } from "@/lib/format";

export function Hero({ featured }: { featured: Product[] }) {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 600], [0, -70]);
  const y2 = useTransform(scrollY, [0, 600], [0, 50]);
  const [a, b, c] = featured;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-rose-pale via-blush to-cream">
      <div className="pointer-events-none absolute -left-40 top-10 h-[520px] w-[520px] rounded-full bg-rose/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[460px] w-[460px] rounded-full bg-gold/20 blur-[120px]" />
      <div className="container-x relative grid min-h-[calc(100vh-110px)] items-center gap-10 py-16 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="eyebrow flex items-center gap-3">
            <span className="h-px w-10 bg-rose" /> Autumn Collection 2026
          </motion.p>
          <h1 className="h-display mt-6 text-[clamp(3.4rem,8vw,7.5rem)]">
            {["Real beauty", "begins here."].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-2">
                <motion.span className={`block ${i === 1 ? "italic text-rose" : ""}`} initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.2 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}>
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-7 max-w-md text-lg leading-relaxed text-mute">
            Authentic makeup, skincare, hair and fragrance — curated by experts, delivered in beautiful packaging.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }} className="mt-10 flex flex-wrap gap-4">
            <Link href="/shop" className="btn-primary px-9 py-4">Shop now <ArrowIcon width={16} height={16} /></Link>
            <Link href="#finder" className="btn-ghost px-9 py-4">Find my match</Link>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="mt-12 flex items-center gap-4">
            <Stars rating={4.8} size={18} />
            <p className="text-sm"><strong>4.8/5</strong> from over 12,000 happy customers</p>
          </motion.div>
        </div>

        <div className="relative mx-auto aspect-[4/5] w-full max-w-[560px]">
          <motion.div style={{ y: y1 }} className="absolute left-[6%] top-[4%] z-10 w-[56%] animate-float rounded-[2.5rem] p-6 shadow-lift" >
            <div className="absolute inset-0 -z-10 rounded-[2.5rem]" style={{ background: `linear-gradient(160deg, ${a.tone[0]}, ${a.tone[1]})` }} />
            <ProductVisual visual={a.visual} tone={a.tone} className="w-full" />
          </motion.div>
          <motion.div style={{ y: y2 }} className="absolute bottom-[2%] right-[2%] w-[48%] rounded-[2.5rem] p-5 shadow-lift">
            <div className="absolute inset-0 -z-10 rounded-[2.5rem]" style={{ background: `linear-gradient(160deg, ${b.tone[0]}, ${b.tone[1]})` }} />
            <ProductVisual visual={b.visual} tone={b.tone} className="w-full" />
          </motion.div>
          <motion.div style={{ y: y1 }} className="absolute bottom-[10%] left-0 w-[34%] rounded-[2rem] p-4 shadow-lift">
            <div className="absolute inset-0 -z-10 rounded-[2rem]" style={{ background: `linear-gradient(160deg, ${c.tone[0]}, ${c.tone[1]})` }} />
            <ProductVisual visual={c.visual} tone={c.tone} className="w-full" />
          </motion.div>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2, type: "spring" }} className="absolute right-0 top-[14%] z-20 grid h-28 w-28 place-items-center rounded-full bg-ink text-center text-white shadow-lift">
            <span className="font-serif text-lg leading-tight">Free<br /><em className="text-rose-light">shipping</em><br /><span className="text-[10px] uppercase tracking-widest">over $75</span></span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const trust = [
  { icon: TruckIcon, title: "Free shipping", text: "On orders over $75" },
  { icon: ReturnIcon, title: "14-day returns", text: "Hassle-free refunds" },
  { icon: ShieldIcon, title: "100% authentic", text: "Direct from the brands" },
  { icon: GiftIcon, title: "Free gift wrap", text: "On every order" },
];

export function TrustBar() {
  return (
    <section className="border-y border-ink/10 bg-white">
      <div className="container-x grid grid-cols-2 gap-y-6 py-8 lg:grid-cols-4">
        {trust.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-4 lg:justify-center">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-rose-pale text-rose"><Icon width={22} height={22} /></span>
            <div><p className="text-sm font-semibold">{title}</p><p className="text-xs text-mute">{text}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CategoryGrid() {
  return (
    <section className="container-x py-28">
      <Reveal className="mb-14 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">Shop by category</p>
          <h2 className="h-display mt-3 text-5xl sm:text-6xl">Everything you <span className="italic text-rose">love</span></h2>
        </div>
        <Link href="/shop" className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest">View all <ArrowIcon className="transition group-hover:translate-x-1" width={16} height={16} /></Link>
      </Reveal>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
        {categories.map((c, i) => (
          <Reveal key={c.slug} delay={i * 0.07} className={i < 2 ? "lg:col-span-3" : "lg:col-span-2"}>
            <Link href={`/category/${c.slug}`} className="group relative block overflow-hidden rounded-[2rem]" style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})`, aspectRatio: i < 2 ? "16/10" : "4/5" }}>
              <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-white/25 blur-2xl transition duration-700 group-hover:scale-150" />
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] opacity-80">{c.tagline}</p>
                <h3 className="font-serif text-4xl">{c.name}</h3>
                <span className="mt-3 inline-flex translate-y-2 items-center gap-2 text-xs font-semibold uppercase tracking-widest opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">Explore <ArrowIcon width={14} height={14} /></span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function OfferBanner({ product }: { product: Product }) {
  return (
    <section className="container-x">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-plum px-8 py-16 text-white sm:px-16">
        <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-rose/40 blur-[100px]" />
        <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="eyebrow text-rose-light">Today only</p>
            <h2 className="h-display mt-3 text-5xl sm:text-6xl">The Glow Edit — <em className="text-rose-light">30% off</em></h2>
            <p className="mt-4 max-w-md text-white/70">Our award-winning Vitamin C serum, now {money(product.price)} (was {money(product.compareAt ?? product.price)}). Offer ends at midnight.</p>
            <div className="mt-8"><Countdown /></div>
            <Link href={`/product/${product.slug}`} className="btn-light mt-9">Shop the offer <ArrowIcon width={16} height={16} /></Link>
          </div>
          <div className="mx-auto w-64 animate-float sm:w-72">
            <ProductVisual visual={product.visual} tone={product.tone} className="w-full drop-shadow-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function BrandsMarquee() {
  return (
    <section className="overflow-hidden py-20" aria-label="Brands we carry">
      <p className="eyebrow mb-8 text-center">Brands we trust</p>
      <div className="flex w-max animate-marquee gap-20 whitespace-nowrap font-serif text-4xl italic text-ink/30">
        {[...brands, ...brands, ...brands, ...brands, ...brands, ...brands].map((b, i) => <span key={i}>{b}</span>)}
      </div>
    </section>
  );
}

export function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % testimonials.length), 6500);
    return () => clearInterval(id);
  }, []);
  const t = testimonials[i];
  return (
    <section className="container-x py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow">Loved by thousands</p>
        <div className="relative mt-8 min-h-[280px]" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.figure key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
              <div className="flex justify-center"><Stars rating={t.rating} size={20} /></div>
              <blockquote className="mt-6 font-serif text-3xl leading-snug sm:text-4xl">“{t.quote}”</blockquote>
              <figcaption className="mt-6 text-sm"><strong>{t.name}</strong> <span className="text-mute">· {t.skin} · bought {t.product}</span></figcaption>
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-rose"><ShieldIcon width={14} height={14} /> Verified purchase</p>
            </motion.figure>
          </AnimatePresence>
        </div>
        <div className="mt-6 flex justify-center gap-2">
          {testimonials.map((_, n) => (
            <button key={n} onClick={() => setI(n)} aria-label={`Show review ${n + 1}`} className={`h-2 rounded-full transition-all ${n === i ? "w-8 bg-rose" : "w-2 bg-ink/20"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function SocialFeed({ products }: { products: Product[] }) {
  return (
    <section className="container-x pb-8">
      <Reveal className="mb-10 text-center">
        <p className="eyebrow">@lumiere.beauty</p>
        <h2 className="h-display mt-3 text-4xl sm:text-5xl">Join the glow on Instagram</h2>
      </Reveal>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {products.slice(0, 6).map((p, i) => (
          <motion.a key={p.id} href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label={`Instagram post featuring ${p.name}`}
            initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
            className="group relative grid aspect-square place-items-center overflow-hidden rounded-2xl" style={{ background: `linear-gradient(${140 + i * 25}deg, ${p.tone[0]}, ${p.tone[1]})` }}>
            <ProductVisual visual={p.visual} tone={p.tone} className="h-[80%] transition duration-700 group-hover:scale-110" rotate={i % 2 ? 6 : -6} />
            <span className="absolute inset-0 grid place-items-center bg-ink/50 text-white opacity-0 transition group-hover:opacity-100"><InstagramIcon width={30} height={30} /></span>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

export function Values() {
  const items = [
    { icon: ShieldIcon, t: "Guaranteed authentic", d: "Every product is sourced directly from the brand or an authorised distributor." },
    { icon: LeafIcon, t: "Clean & cruelty-free", d: "We champion formulas that are kind to skin, animals and the planet." },
    { icon: GiftIcon, t: "Gift-ready always", d: "Complimentary wrapping and a handwritten note on every order." },
  ];
  return (
    <section className="container-x py-16">
      <div className="grid gap-10 md:grid-cols-3">
        {items.map(({ icon: Icon, t, d }, i) => (
          <Reveal key={t} delay={i * 0.1}>
            <Icon width={32} height={32} className="text-rose" />
            <h3 className="mt-5 font-serif text-2xl">{t}</h3>
            <p className="mt-2 text-sm leading-relaxed text-mute">{d}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
