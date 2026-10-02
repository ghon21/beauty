import { NextResponse } from "next/server";
import { getPool, hasDb } from "@/lib/db";

export const dynamic = "force-dynamic";

const STEPS = ["processing", "packed", "shipped", "delivered"] as const;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = (searchParams.get("code") ?? "").trim().toUpperCase();
  const email = (searchParams.get("email") ?? "").trim().toLowerCase();
  if (!/^LM-[A-F0-9]{6}$/.test(code) || !email) {
    return NextResponse.json({ error: "Enter your order code (e.g. LM-1A2B3C) and email." }, { status: 422 });
  }
  if (hasDb) {
    const r = await getPool().query("SELECT status, created_at, total FROM orders WHERE code = $1 AND lower(email) = $2", [code, email]);
    if (r.rowCount === 0) return NextResponse.json({ error: "We couldn't find that order." }, { status: 404 });
    return NextResponse.json({ code, status: r.rows[0].status, placedAt: r.rows[0].created_at, total: Number(r.rows[0].total) });
  }
  // Demo mode (no database): derive a stable status from the code.
  const idx = parseInt(code.slice(-1), 16) % STEPS.length;
  return NextResponse.json({ code, status: STEPS[idx], placedAt: new Date().toISOString(), demo: true });
}
