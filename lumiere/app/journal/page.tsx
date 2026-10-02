import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "@/lib/journal";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = { title: "The Journal", description: "Skincare routines, makeup tutorials and fragrance guides from the Lumière beauty team." };

export default function JournalPage() {
  const [lead, ...rest] = posts;
  return (
    <div className="container-x py-16">
      <p className="eyebrow">The Journal</p>
      <h1 className="h-display mt-3 text-6xl sm:text-8xl">Beauty, <span className="italic text-rose">explained</span></h1>

      <Reveal className="mt-14">
        <Link href={`/journal/${lead.slug}`} className="group grid overflow-hidden rounded-[2.5rem] bg-white lg:grid-cols-2">
          <div className="min-h-[320px] transition duration-700 group-hover:scale-[1.02]" style={{ background: `linear-gradient(135deg, ${lead.tone[0]}, ${lead.tone[1]})` }} />
          <div className="p-10 sm:p-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-rose">{lead.category} · {lead.readTime}</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight transition group-hover:text-rose">{lead.title}</h2>
            <p className="mt-4 text-mute">{lead.excerpt}</p>
            <span className="mt-8 inline-block text-sm font-semibold uppercase tracking-widest">Read article →</span>
          </div>
        </Link>
      </Reveal>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {rest.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.08}>
            <Link href={`/journal/${p.slug}`} className="group block">
              <div className="aspect-[4/3] overflow-hidden rounded-3xl"><div className="h-full w-full transition duration-700 group-hover:scale-105" style={{ background: `linear-gradient(135deg, ${p.tone[0]}, ${p.tone[1]})` }} /></div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-rose">{p.category} · {p.readTime}</p>
              <h2 className="mt-2 font-serif text-2xl leading-snug transition group-hover:text-rose">{p.title}</h2>
              <p className="mt-2 text-sm text-mute">{p.excerpt}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
