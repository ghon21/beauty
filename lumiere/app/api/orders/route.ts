import { NextResponse } from "next/server";
import { z } from "zod";
import { randomBytes } from "node:crypto";
import { getProducts } from "@/lib/catalog";
import { getPool, hasDb } from "@/lib/db";
import { computeTotals, findPromo } from "@/lib/pricing";

const schema = z.object({
  email: z.string().email().max(160),
  firstName: z.string().trim().min(1).max(60),
  lastName: z.string().trim().min(1).max(60),
  phone: z.string().trim().min(6).max(30),
  address: z.string().trim().min(4).max(200),
  city: z.string().trim().min(2).max(80),
  postal: z.string().trim().min(3).max(12),
  shipping: z.enum(["standard", "express"]),
  payment: z.enum(["card", "wallet"]),
  promo: z.string().max(30).optional(),
  lines: z
    .array(z.object({ productId: z.number().int(), qty: z.number().int().min(1).max(10), shade: z.string().max(60).optional() }))
    .min(1)
    .max(40),
});

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check your details and try again.", issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  }
  const input = parsed.data;

  // Prices & stock always come from the server — never trust the client.
  const catalog = await getProducts();
  const priced: { productId: number; name: string; shade?: string; unit: number; qty: number }[] = [];
  for (const line of input.lines) {
    const p = catalog.find((c) => c.id === line.productId);
    if (!p) return NextResponse.json({ error: "A product in your bag is no longer available." }, { status: 409 });
    if (p.stock < line.qty) return NextResponse.json({ error: `Only ${p.stock} left of ${p.name}.` }, { status: 409 });
    priced.push({ productId: p.id, name: p.name, shade: line.shade, unit: p.price, qty: line.qty });
  }
  const subtotal = priced.reduce((s, l) => s + l.unit * l.qty, 0);
  const promo = findPromo(input.promo);
  const totals = computeTotals(subtotal, input.shipping, promo?.code);
  const code = `LM-${randomBytes(3).toString("hex").toUpperCase()}`;

  if (hasDb) {
    const client = await getPool().connect();
    try {
      await client.query("BEGIN");
      const o = await client.query(
        `INSERT INTO orders (code, email, first_name, last_name, phone, address, city, postal, shipping, payment, promo,
           subtotal, discount, shipping_cost, total)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING id`,
        [code, input.email.toLowerCase(), input.firstName, input.lastName, input.phone, input.address, input.city, input.postal,
          input.shipping, input.payment, promo?.code ?? null, totals.subtotal, totals.discount, totals.shipping, totals.total],
      );
      for (const l of priced) {
        const upd = await client.query("UPDATE products SET stock = stock - $1 WHERE id = $2 AND stock >= $1", [l.qty, l.productId]);
        if (upd.rowCount === 0) throw new Error(`Out of stock: ${l.name}`);
        await client.query(
          "INSERT INTO order_items (order_id, product_id, name, shade, unit_price, qty) VALUES ($1,$2,$3,$4,$5,$6)",
          [o.rows[0].id, l.productId, l.name, l.shade ?? null, l.unit, l.qty],
        );
      }
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      console.error("[orders] failed", e);
      return NextResponse.json({ error: "We couldn't place your order. Please try again." }, { status: 500 });
    } finally {
      client.release();
    }
  }

  // Payment gateway hook: create a Stripe / Zarinpal / IDPay session here and return its redirect URL.
  return NextResponse.json({ code, status: "processing", totals, persisted: hasDb }, { status: 201 });
}
