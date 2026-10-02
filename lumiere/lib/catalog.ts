import { seedProducts } from "./data";
import { getPool, hasDb } from "./db";
import type { Product, Review } from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapRow(r: any, reviews: Review[]): Product {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    brand: r.brand,
    category: r.category,
    subcategory: r.subcategory,
    price: Number(r.price),
    compareAt: r.compare_at != null ? Number(r.compare_at) : undefined,
    rating: Number(r.rating),
    reviewCount: r.review_count,
    stock: r.stock,
    tagline: r.tagline,
    description: r.description,
    benefits: r.benefits,
    howToUse: r.how_to_use,
    ingredients: r.ingredients,
    skinTypes: r.skin_types,
    shades: r.shades,
    visual: r.visual,
    tone: r.tone,
    badge: r.badge ?? undefined,
    reviews,
    popularity: r.popularity,
    createdAt: new Date(r.created_at).toISOString().slice(0, 10),
  };
}

export async function getProducts(): Promise<Product[]> {
  if (!hasDb) return seedProducts;
  try {
    const pool = getPool();
    const [p, r] = await Promise.all([
      pool.query("SELECT * FROM products ORDER BY popularity DESC"),
      pool.query("SELECT * FROM reviews ORDER BY created_at DESC"),
    ]);
    if (p.rows.length === 0) return seedProducts;
    const byProduct = new Map<number, Review[]>();
    for (const row of r.rows) {
      const list = byProduct.get(row.product_id) ?? [];
      list.push({
        author: row.author,
        skin: row.skin,
        rating: row.rating,
        title: row.title,
        body: row.body,
        verified: row.verified,
        date: new Date(row.created_at).toISOString().slice(0, 10),
      });
      byProduct.set(row.product_id, list);
    }
    return p.rows.map((row: any) => mapRow(row, byProduct.get(row.id) ?? []));
  } catch (err) {
    console.error("[catalog] DB unavailable, using seed data:", err);
    return seedProducts;
  }
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return (await getProducts()).find((p) => p.slug === slug);
}

export async function getByCategory(category: string): Promise<Product[]> {
  return (await getProducts()).filter((p) => p.category === category);
}

export async function getRelated(product: Product, limit = 4): Promise<Product[]> {
  const all = await getProducts();
  const same = all.filter((p) => p.id !== product.id && p.category === product.category);
  const others = all.filter((p) => p.id !== product.id && p.category !== product.category);
  return [...same, ...others].slice(0, limit);
}

export function searchProducts(all: Product[], q: string): Product[] {
  const term = q.trim().toLowerCase();
  if (!term) return [];
  return all
    .filter((p) => `${p.name} ${p.brand} ${p.category} ${p.subcategory} ${p.tagline}`.toLowerCase().includes(term))
    .slice(0, 8);
}
