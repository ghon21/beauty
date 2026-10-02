import type { MetadataRoute } from "next";
import { categories, seedProducts } from "@/lib/data";
import { posts } from "@/lib/journal";
import { SITE_URL } from "@/lib/format";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ["", "/shop", "/about", "/journal", "/contact"].map((p) => ({ url: `${SITE_URL}${p}`, lastModified: now, priority: p === "" ? 1 : 0.7 }));
  return [
    ...pages,
    ...categories.map((c) => ({ url: `${SITE_URL}/category/${c.slug}`, lastModified: now, priority: 0.8 })),
    ...seedProducts.map((p) => ({ url: `${SITE_URL}/product/${p.slug}`, lastModified: now, priority: 0.9 })),
    ...posts.map((p) => ({ url: `${SITE_URL}/journal/${p.slug}`, lastModified: new Date(p.date), priority: 0.6 })),
  ];
}
