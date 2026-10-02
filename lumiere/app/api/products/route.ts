import { NextResponse } from "next/server";
import { getProducts, searchProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const category = searchParams.get("category");
  let products = await getProducts();
  if (q) products = searchProducts(products, q);
  if (category) products = products.filter((p) => p.category === category);
  return NextResponse.json({
    products: products.map((p) => ({
      id: p.id, slug: p.slug, name: p.name, brand: p.brand, category: p.category,
      price: p.price, compareAt: p.compareAt, rating: p.rating, stock: p.stock,
      visual: p.visual, tone: p.tone, tagline: p.tagline,
    })),
  });
}
