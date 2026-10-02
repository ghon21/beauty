"use client";

import Link from "next/link";
import { useMemo } from "react";
import { seedProducts } from "@/lib/data";
import { money } from "@/lib/format";
import { useHydrated, useStore } from "@/lib/store";
import ProductCard from "@/components/ProductCard";

const tiers = [
  { name: "Petal", min: 0, perk: "Earn 1 point per $1" },
  { name: "Bloom", min: 250, perk: "Free express shipping" },
  { name: "Luminary", min: 750, perk: "Early access & birthday gift" },
];

export default function AccountPage() {
  const hydrated = useHydrated();
  const wishlist = useStore((s) => s.wishlist);
  const orders = useStore((s) => s.orders);
  const saved = useMemo(() => seedProducts.filter((p) => wishlist.includes(p.id)), [wishlist]);
  const points = Math.round(orders.reduce((s, o) => s + o.total, 0));
  const tier = [...tiers].reverse().find((t) => points >= t.min) ?? tiers[0];
  const next = tiers.find((t) => t.min > points);
  const pct = next ? Math.min(100, ((points - tier.min) / (next.min - tier.min)) * 100) : 100;

  if (!hydrated) return <div className="container-x min-h-[60vh] py-16" />;

  return (
    <div className="container-x py-16">
      <p className="eyebrow">My Lumière</p>
      <h1 className="h-display mt-3 text-6xl sm:text-7xl">Welcome back</h1>

      <section className="mt-12 overflow-hidden rounded-[2.5rem] bg-plum p-10 text-white sm:p-14">
        <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <p className="eyebrow text-rose-light">Loyalty club</p>
            <p className="mt-2 font-serif text-5xl">{tier.name} <span className="text-2xl text-white/50">· {points} pts</span></p>
            <p className="mt-2 text-white/70">{tier.perk}</p>
            <div className="mt-6 h-2 max-w-md overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-gradient-to-r from-rose-light to-gold-light transition-all duration-1000" style={{ width: `${pct}%` }} /></div>
            <p className="mt-2 text-xs text-white/60">{next ? `${next.min - points} points to ${next.name}` : "You've reached our highest tier"}</p>
          </div>
          <Link href="/shop" className="btn-light">Earn more points</Link>
        </div>
      </section>

      <section className="mt-20">
        <h2 className="font-serif text-4xl">Wishlist <span className="text-xl text-mute">({saved.length})</span></h2>
        {saved.length === 0 ? (
          <p className="mt-6 text-mute">Tap the heart on any product to save it here. <Link href="/shop" className="text-rose underline">Browse products</Link></p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">{saved.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</div>
        )}
      </section>

      <section className="mt-20">
        <h2 className="font-serif text-4xl">Order history</h2>
        {orders.length === 0 ? (
          <p className="mt-6 text-mute">No orders yet on this device.</p>
        ) : (
          <ul className="mt-6 divide-y divide-ink/10 rounded-3xl bg-white">
            {orders.map((o) => (
              <li key={o.code} className="flex flex-wrap items-center justify-between gap-4 p-6">
                <div><p className="font-semibold">{o.code}</p><p className="text-sm text-mute">{new Date(o.date).toLocaleDateString()} · {o.items} items</p></div>
                <p className="font-serif text-xl">{money(o.total)}</p>
                <Link href="/contact#track" className="btn-ghost px-5 py-2.5">Track</Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
