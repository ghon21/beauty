import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts } from "@/lib/journal";
import { getProduct } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = posts.find((x) => x.slug === params.slug);
  return p ? { title: p.title, description: p.excerpt, keywords: p.keywords, alternates: { canonical: `/journal/${p.slug}` } } : {};
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) notFound();
  const product = await getProduct(post.related);
  const jsonLd = { "@context": "https://schema.org", "@type": "Article", headline: post.title, datePublished: post.date, description: post.excerpt };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="py-20 text-center" style={{ background: `linear-gradient(180deg, ${post.tone[0]}, #fdf9f6)` }}>
        <div className="container-x max-w-3xl">
          <p className="eyebrow">{post.category} · {post.readTime} read</p>
          <h1 className="h-display mt-4 text-4xl sm:text-6xl">{post.title}</h1>
          <p className="mt-5 text-lg text-mute">{post.excerpt}</p>
        </div>
      </header>
      <div className="container-x max-w-2xl py-14">
        {post.body.map((b, i) => (
          <section key={i} className="mb-8">
            {b.h && <h2 className="mb-3 font-serif text-3xl">{b.h}</h2>}
            <p className="text-lg leading-[1.85] text-ink/85">{b.p}</p>
          </section>
        ))}
        {product && (
          <aside className="mt-14 rounded-[2rem] bg-blush p-8">
            <p className="eyebrow mb-6 text-center">Shop this article</p>
            <div className="mx-auto max-w-[260px]"><ProductCard product={product} /></div>
          </aside>
        )}
        <Link href="/journal" className="mt-12 inline-block text-sm font-semibold uppercase tracking-widest">← Back to the journal</Link>
      </div>
    </article>
  );
}
