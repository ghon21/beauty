import type { Metadata } from "next";
import { getProducts } from "@/lib/catalog";
import ShopClient from "@/components/ShopClient";

export const metadata: Metadata = {
  title: "Shop all beauty",
  description: "Browse authentic makeup, skincare, haircare, fragrance and tools. Filter by brand, skin type and price.",
};
export const revalidate = 60;

export default async function ShopPage() {
  const products = await getProducts();
  return (
    <div className="container-x py-14">
      <div className="mb-12 max-w-2xl">
        <p className="eyebrow">The collection</p>
        <h1 className="h-display mt-3 text-6xl sm:text-7xl">Shop all</h1>
        <p className="mt-4 text-mute">Every product is 100% authentic and shipped in gift-ready packaging.</p>
      </div>
      <ShopClient products={products} />
    </div>
  );
}
