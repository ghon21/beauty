export type CategorySlug = "makeup" | "skincare" | "haircare" | "fragrance" | "tools";
export type Visual = "lipstick" | "bottle" | "jar" | "tube" | "palette" | "brush" | "perfume" | "dropper" | "mascara" | "compact";

export interface Category {
  slug: CategorySlug;
  name: string;
  tagline: string;
  blurb: string;
  from: string;
  to: string;
}

export interface Shade {
  name: string;
  hex: string;
}

export interface Review {
  author: string;
  skin: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  date: string;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  brand: string;
  category: CategorySlug;
  subcategory: string;
  price: number;
  compareAt?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  tagline: string;
  description: string;
  benefits: string[];
  howToUse: string;
  ingredients: string;
  skinTypes: string[];
  shades: Shade[];
  visual: Visual;
  tone: [string, string];
  badge?: "Bestseller" | "New" | "Sale" | "Limited";
  reviews: Review[];
  popularity: number;
  createdAt: string;
}

export interface CartLine {
  productId: number;
  slug: string;
  name: string;
  brand: string;
  price: number;
  shade?: string;
  shadeHex?: string;
  qty: number;
  visual: Visual;
  tone: [string, string];
}

export interface OrderInput {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  postal: string;
  shipping: "standard" | "express";
  payment: "card" | "wallet";
  promo?: string;
  lines: { productId: number; qty: number; shade?: string }[];
}
