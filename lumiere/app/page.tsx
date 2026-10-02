import Link from "next/link";
import { getProducts } from "@/lib/catalog";
import { posts } from "@/lib/journal";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import TryOn from "@/components/TryOn";
import ShadeQuiz from "@/components/ShadeQuiz";
import { BrandsMarquee, CategoryGrid, Hero, OfferBanner, SocialFeed, Testimonials, TrustBar, Values } from "@/components/HomeSections";
import { ArrowIcon } from "@/components/Icons";

export const revalidate = 60;

export default async function HomePage() {
  const products = await getProducts();
  const bySlug = (s: string) => products.find((p) => p.slug === s) ?? products[0];
  const best = [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 8);
  const hero = [bySlug("maison-rose-eau-de-parfum"), bySlug("glow-ritual-vitamin-c-serum"), bySlug("velvet-rouge-matte-lipstick")];
  const offer = bySlug("glow-ritual-vitamin-c-serum");

  return (
    <>
      <Hero featured={hero} />
      <TrustBar />
      <CategoryGrid />

      <section className="container-x pb-28">
        <Reveal className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Customer favourites</p>
            <h2 className="h-display mt-3 text-5xl sm:text-6xl">Bestsellers</h2>
          </div>
          <Link href="/shop" className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest">Shop all <ArrowIcon width={16} height={16} className="transition group-hover:translate-x-1" /></Link>
        </Reveal>
        <div className="grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
          {best.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      <OfferBanner product={offer} />
      <TryOn />
      <div id="finder"><ShadeQuiz /></div>
      <BrandsMarquee />
      <Testimonials />
      <Values />

      <section className="container-x py-24">
        <Reveal className="mb-12 flex items-end justify-between gap-6">
          <div><p className="eyebrow">The journal</p><h2 className="h-display mt-3 text-5xl">Beauty, explained</h2></div>
          <Link href="/journal" className="hidden text-sm font-semibold uppercase tracking-widest sm:block">Read more</Link>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {posts.slice(0, 3).map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.08}>
              <Link href={`/journal/${p.slug}`} className="group block">
                <div className="aspect-[4/3] overflow-hidden rounded-3xl"><div className="h-full w-full transition duration-700 group-hover:scale-105" style={{ background: `linear-gradient(135deg, ${p.tone[0]}, ${p.tone[1]})` }} /></div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-rose">{p.category} · {p.readTime}</p>
                <h3 className="mt-2 font-serif text-2xl leading-snug transition group-hover:text-rose">{p.title}</h3>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <SocialFeed products={products} />
    </>
  );
}
