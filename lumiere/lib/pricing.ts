export const FREE_SHIPPING_THRESHOLD = 75;
export const SHIPPING_RATES = { standard: 6.95, express: 14.95 } as const;

export type PromoRule = { code: string; label: string; percent?: number; freeShipping?: boolean };

export const PROMOS: Record<string, PromoRule> = {
  WELCOME15: { code: "WELCOME15", label: "15% off your first order", percent: 15 },
  GLOW10: { code: "GLOW10", label: "10% off", percent: 10 },
  FREESHIP: { code: "FREESHIP", label: "Free shipping", freeShipping: true },
};

export function findPromo(code?: string | null): PromoRule | null {
  if (!code) return null;
  return PROMOS[code.trim().toUpperCase()] ?? null;
}

export interface Totals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  freeShippingRemaining: number;
}

const round = (n: number) => Math.round(n * 100) / 100;

export function computeTotals(subtotal: number, method: keyof typeof SHIPPING_RATES, promoCode?: string | null): Totals {
  const promo = findPromo(promoCode);
  const discount = promo?.percent ? round((subtotal * promo.percent) / 100) : 0;
  const qualifiesFree = subtotal - discount >= FREE_SHIPPING_THRESHOLD || !!promo?.freeShipping;
  const shipping = subtotal === 0 ? 0 : method === "standard" && qualifiesFree ? 0 : SHIPPING_RATES[method];
  return {
    subtotal: round(subtotal),
    discount,
    shipping,
    total: round(subtotal - discount + shipping),
    freeShippingRemaining: Math.max(0, round(FREE_SHIPPING_THRESHOLD - subtotal)),
  };
}
