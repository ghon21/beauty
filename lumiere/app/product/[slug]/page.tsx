import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getRelated } from "@/lib/catalog";
import { seedProducts } from "@/lib/data";
import { SITE_URL } from "@/lib/format";
import ProductClient from "@/components/ProductClient";
import ProductCard from "@/components/ProductCard";

export const revalidate = 60;

export function generateStaticParams() {
  return seedProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await getProduct(params.slug);
  if (!p) return {};
  return {
    title: `${p.name} | ${p.brand}`,
    description: p.tagline + " " + p.description.slice(0, 110),
    alternates: { canonical: `/product/${p.slug}` },
    openGraph: { title: p.name, description: p.tagline, type: "website" },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();
  const related = await getRelated(product, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: product.brand },
    sku: `LM-${product.id}`,
    url: `${SITE_URL}/product/${product.slug}`,
    aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviewCount },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <div className="container-x py-10 pb-28 lg:pb-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="mb-8 text-xs uppercase tracking-widest text-mute">
        <Link href="/" className="hover:text-ink">Home</Link> / <Link href={`/category/${product.category}`} className="capitalize hover:text-ink">{product.category}</Link> / <span className="text-ink">{product.name}</span>
      </nav>
      <ProductClient product={product} />
      <section className="mt-28">
        <p className="eyebrow">Pairs well with</p>
        <h2 className="h-display mt-3 text-4xl sm:text-5xl">You may also love</h2>
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>
    </div>
  );
}
