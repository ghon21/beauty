import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { LeafIcon, ShieldIcon, SparkleIcon } from "@/components/Icons";

export const metadata: Metadata = { title: "Our story", description: "Lumière was founded on a simple belief: beauty should be authentic, accessible and joyful." };

const stats = [["120K+", "Happy customers"], ["500+", "Authentic products"], ["8", "Years of craft"], ["4.8★", "Average rating"]];
const values = [
  { icon: ShieldIcon, t: "Authentic, always", d: "Every product comes straight from the brand or an authorised distributor, with a batch authenticity card in the box." },
  { icon: LeafIcon, t: "Kind by design", d: "Cruelty-free, increasingly vegan, and packaged with recyclable materials wherever possible." },
  { icon: SparkleIcon, t: "Joyful service", d: "Real beauty advisors answer your questions fast — by chat, WhatsApp or email — with honest advice." },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-rose-pale to-cream py-28 text-center">
        <div className="container-x max-w-4xl">
          <p className="eyebrow">Our story</p>
          <h1 className="h-display mt-4 text-6xl sm:text-8xl">Beauty with <span className="italic text-rose">integrity</span></h1>
          <p className="mx-auto mt-8 max-w-2xl text-xl leading-relaxed text-mute">Lumière began in 2018 with a single question: why is it so hard to buy beauty products you can actually trust? We built the answer — a house of carefully chosen, genuinely authentic products, delivered with care.</p>
        </div>
      </section>

      <section className="container-x grid gap-16 py-24 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <div className="aspect-[4/5] rounded-[3rem] bg-gradient-to-br from-blush via-rose-light/40 to-gold/30 p-10">
            <div className="grid h-full place-items-center rounded-[2rem] border border-white/60 text-center"><p className="font-serif text-4xl italic leading-snug text-plum">“Confidence is the<br />best thing you can wear.”</p></div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="eyebrow">The founder&apos;s note</p>
          <h2 className="h-display mt-3 text-5xl">Born from a love of ritual</h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink/80">
            <p>We started as a small team of makeup artists and skincare obsessives who were tired of counterfeits, vague claims and impersonal service.</p>
            <p>Today, we work directly with brands and distributors, test what we sell, and write honest guides to help you choose. If it doesn&apos;t earn a place in our own routines, it doesn&apos;t make it onto the shelves.</p>
          </div>
          <Link href="/shop" className="btn-primary mt-8">Explore the collection</Link>
        </Reveal>
      </section>

      <section className="bg-plum py-20 text-white">
        <div className="container-x grid grid-cols-2 gap-10 text-center lg:grid-cols-4">
          {stats.map(([n, l], i) => (
            <Reveal key={l} delay={i * 0.08}><p className="font-serif text-6xl text-rose-light">{n}</p><p className="mt-2 text-xs uppercase tracking-[0.25em] text-white/60">{l}</p></Reveal>
          ))}
        </div>
      </section>

      <section className="container-x py-24">
        <div className="grid gap-12 md:grid-cols-3">
          {values.map(({ icon: Icon, t, d }, i) => (
            <Reveal key={t} delay={i * 0.1}><Icon width={34} height={34} className="text-rose" /><h3 className="mt-5 font-serif text-3xl">{t}</h3><p className="mt-3 leading-relaxed text-mute">{d}</p></Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
