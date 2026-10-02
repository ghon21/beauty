# Lumière — Beauty Store

A premium e-commerce storefront built from your website plan.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · Node.js API routes · PostgreSQL (optional)

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

The store works immediately with its built-in catalogue (17 products). To use PostgreSQL:

```bash
cp .env.example .env          # set DATABASE_URL
npm run db:init               # creates tables and seeds products
npm run dev
```

With `DATABASE_URL` set, products, orders (with stock decrement in a transaction), newsletter signups and contact messages are stored in Postgres.

## What's implemented (mapped to your plan)

| Plan item | Where |
|---|---|
| Hero, trust bar, categories, bestsellers, timed offer, brands, reviews, Instagram | `app/page.tsx`, `components/HomeSections.tsx` |
| Category pages + filters (brand, skin type, price, rating, sort) | `app/category/[slug]`, `components/ShopClient.tsx` |
| Product page: gallery, shades, low-stock, Add to bag + Buy now, reviews by skin type | `components/ProductClient.tsx` |
| Slide-out cart, free-shipping progress, upsell | `components/CartDrawer.tsx` |
| 3-step guest checkout, promo codes, server-side pricing | `app/checkout`, `app/api/orders`, `lib/pricing.ts` |
| Exit-intent popup (WELCOME15), newsletter | `components/ExitIntent.tsx`, `NewsletterForm.tsx` |
| WhatsApp button on every page | `components/WhatsAppButton.tsx` |
| Virtual try-on + shade/skin finder | `components/TryOn.tsx`, `ShadeQuiz.tsx` |
| Blog, About, Contact, FAQ, order tracking, account (wishlist, loyalty) | `app/journal`, `app/about`, `app/contact`, `app/account` |
| SEO: metadata, product + FAQ + article JSON-LD, sitemap, robots | `app/**`, `app/sitemap.ts` |

Promo codes: `WELCOME15`, `GLOW10`, `FREESHIP`.

## Before you launch

- **Payments:** `app/api/orders/route.ts` has a marked spot to create a Stripe (or other gateway) session. No card data is collected by the site.
- **Content:** reviews, ratings and review counts are demo seed data — replace with real ones. Add real photography in place of the generated product illustrations (`components/ProductVisual.tsx`).
- **Set** `NEXT_PUBLIC_WHATSAPP` and `NEXT_PUBLIC_SITE_URL` in `.env`.
- **Abandoned-cart emails** and a camera-based AR try-on (e.g. ModiFace) need third-party services and are not included.
