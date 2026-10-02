import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories } from "@/lib/data";
import { getByCategory } from "@/lib/catalog";
import ShopClient from "@/components/ShopClient";

export const revalidate = 60;

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const c = categories.find((x) => x.slug === params.slug);
  if (!c) return {};
  return { title: `Shop ${c.name}`, description: c.blurb, alternates: { canonical: `/category/${c.slug}` } };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const cat = categories.find((c) => c.slug === params.slug);
  if (!cat) notFound();
  const products = await getByCategory(cat.slug);

  return (
    <>
      <section className="relative overflow-hidden" style={{ background: `linear-gradient(120deg, ${cat.from}, ${cat.to})` }}>
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/25 blur-3xl" />
        <div className="container-x relative py-20 text-white">
          <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-widest opacity-80"><Link href="/">Home</Link> / <Link href="/shop">Shop</Link> / {cat.name}</nav>
          <h1 className="h-display mt-5 text-6xl sm:text-8xl">{cat.name}</h1>
          <p className="mt-4 max-w-xl text-lg text-white/90">{cat.blurb}</p>
        </div>
      </section>
      <div className="container-x py-14">
        <ShopClient products={products} showCategories={false} />
      </div>
    </>
  );
}
