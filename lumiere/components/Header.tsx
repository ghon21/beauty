"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { categories } from "@/lib/data";
import { cartCount, useHydrated, useStore } from "@/lib/store";
import { money } from "@/lib/format";
import ProductVisual from "./ProductVisual";
import { BagIcon, CloseIcon, HeartIcon, MenuIcon, SearchIcon, UserIcon } from "./Icons";
import type { Visual } from "@/lib/types";

const announcements = [
  "Free standard shipping on orders over $75",
  "14-day returns · 100% authentic products",
  "New here? Use code WELCOME15 for 15% off your first order",
  "Complimentary gift wrapping on every order",
];

interface Hit {
  id: number; slug: string; name: string; brand: string; price: number; visual: Visual; tone: [string, string];
}

export default function Header() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const count = useStore((s) => cartCount(s.lines));
  const wishCount = useStore((s) => s.wishlist.length);
  const setOpen = useStore((s) => s.setOpen);
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenu(false);
    setSearch(false);
  }, [pathname]);

  useEffect(() => {
    if (search) setTimeout(() => inputRef.current?.focus(), 80);
    document.body.style.overflow = search || menu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [search, menu]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearch(false);
        setMenu(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearch(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (q.trim().length < 2) {
      setHits([]);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(q)}`, { signal: ctrl.signal });
        const data = await res.json();
        setHits(data.products ?? []);
      } catch {
        /* aborted */
      }
    }, 180);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  const links = [
    { href: "/shop", label: "Shop all" },
    ...categories.slice(0, 4).map((c) => ({ href: `/category/${c.slug}`, label: c.name })),
    { href: "/journal", label: "Journal" },
  ];

  return (
    <>
      <div className="relative z-50 overflow-hidden bg-plum py-2.5 text-[11px] font-medium uppercase tracking-[0.22em] text-white/85">
        <div className="flex w-max animate-marquee gap-16 whitespace-nowrap">
          {[...announcements, ...announcements, ...announcements, ...announcements].map((a, i) => (
            <span key={i} className="flex items-center gap-16">
              {a} <span className="text-gold-light">✦</span>
            </span>
          ))}
        </div>
      </div>

      <header className={`sticky top-0 z-40 transition-all duration-500 ${scrolled ? "bg-cream/85 shadow-[0_1px_0_rgba(28,20,23,.08)] backdrop-blur-xl" : "bg-cream"}`}>
        <div className="container-x flex h-[72px] items-center justify-between gap-6">
          <button className="-ml-2 p-2 lg:hidden" onClick={() => setMenu(true)} aria-label="Open menu">
            <MenuIcon />
          </button>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {links.slice(0, 3).map((l) => (
              <NavLink key={l.href} {...l} active={pathname === l.href} />
            ))}
          </nav>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2 text-center" aria-label="Lumière home">
            <span className="block font-serif text-[28px] font-semibold leading-none tracking-tight">
              Lumi<span className="italic text-rose">è</span>re
            </span>
            <span className="mt-0.5 block text-[8px] font-semibold uppercase tracking-[0.5em] text-mute">Beauty House</span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Secondary">
            {links.slice(3).map((l) => (
              <NavLink key={l.href} {...l} active={pathname === l.href} />
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <button onClick={() => setSearch(true)} className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-ink/5" aria-label="Search (Ctrl+K)">
              <SearchIcon />
            </button>
            <Link href="/account" className="hidden h-10 w-10 place-items-center rounded-full transition hover:bg-ink/5 sm:grid" aria-label="Account and wishlist">
              <span className="relative">
                <HeartIcon />
                {hydrated && wishCount > 0 && <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-rose px-1 text-[9px] font-bold text-white">{wishCount}</span>}
              </span>
            </Link>
            <Link href="/account" className="hidden h-10 w-10 place-items-center rounded-full transition hover:bg-ink/5 md:grid" aria-label="Account">
              <UserIcon />
            </Link>
            <button onClick={() => setOpen(true)} className="relative grid h-10 w-10 place-items-center rounded-full transition hover:bg-ink/5" aria-label={`Open bag, ${hydrated ? count : 0} items`}>
              <BagIcon />
              <AnimatePresence>
                {hydrated && count > 0 && (
                  <motion.span key={count} initial={{ scale: 0.4 }} animate={{ scale: 1 }} className="absolute right-0 top-0 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-rose px-1 text-[10px] font-bold text-white">
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menu && (
          <>
            <motion.div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenu(false)} />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 flex w-[86%] max-w-sm flex-col bg-cream p-8"
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 30, stiffness: 260 }}
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-2xl font-semibold">Lumi<span className="italic text-rose">è</span>re</span>
                <button onClick={() => setMenu(false)} aria-label="Close menu" className="p-2"><CloseIcon /></button>
              </div>
              <nav className="mt-10 flex flex-col gap-1">
                {[...links, { href: "/about", label: "Our story" }, { href: "/contact", label: "Help & contact" }, { href: "/account", label: "Account & wishlist" }].map((l, i) => (
                  <motion.div key={l.href} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                    <Link href={l.href} className="block border-b border-ink/10 py-4 font-serif text-2xl">{l.label}</Link>
                  </motion.div>
                ))}
              </nav>
              <p className="mt-auto text-xs text-mute">Free shipping over $75 · 14-day returns</p>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {search && (
          <motion.div className="fixed inset-0 z-[60] overflow-y-auto bg-cream/95 backdrop-blur-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label="Search">
            <div className="container-x max-w-3xl pt-8">
              <div className="flex items-center gap-4 border-b-2 border-ink pb-4">
                <SearchIcon width={26} height={26} />
                <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search lipstick, serum, perfume…" className="w-full bg-transparent font-serif text-3xl outline-none placeholder:text-mute/50 sm:text-4xl" />
                <button onClick={() => setSearch(false)} aria-label="Close search" className="p-2"><CloseIcon /></button>
              </div>
              {q.trim().length >= 2 && hits.length === 0 && <p className="mt-10 text-mute">No results for “{q}”. Try “serum”, “lipstick” or “SPF”.</p>}
              {q.trim().length < 2 && (
                <div className="mt-10">
                  <p className="eyebrow">Popular searches</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["Vitamin C", "Lipstick", "SPF", "Rose perfume", "Hair mask", "Brushes"].map((t) => (
                      <button key={t} onClick={() => setQ(t)} className="chip">{t}</button>
                    ))}
                  </div>
                </div>
              )}
              <ul className="mt-6 divide-y divide-ink/10 pb-16">
                {hits.map((h) => (
                  <li key={h.id}>
                    <Link href={`/product/${h.slug}`} className="flex items-center gap-5 py-4 transition hover:translate-x-1">
                      <span className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl" style={{ background: h.tone[0] }}>
                        <ProductVisual visual={h.visual} tone={h.tone} className="h-16 w-16" />
                      </span>
                      <span className="flex-1">
                        <span className="block text-[11px] font-semibold uppercase tracking-widest text-mute">{h.brand}</span>
                        <span className="block font-serif text-xl">{h.name}</span>
                      </span>
                      <span className="font-semibold">{money(h.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link href={href} className="group relative py-2 text-[13px] font-medium uppercase tracking-[0.16em]">
      {label}
      <span className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-rose transition-transform duration-500 ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
    </Link>
  );
}
