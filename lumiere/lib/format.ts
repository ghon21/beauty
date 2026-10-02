const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export const money = (n: number) => fmt.format(n);

export const discountPct = (price: number, compareAt?: number) =>
  compareAt && compareAt > price ? Math.round(((compareAt - price) / compareAt) * 100) : 0;

export const SITE_NAME = "Lumière";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP ?? "15551234567";
