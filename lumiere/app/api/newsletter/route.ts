import { NextResponse } from "next/server";
import { z } from "zod";
import { getPool, hasDb } from "@/lib/db";

const schema = z.object({ email: z.string().email().max(160), source: z.string().max(30).optional() });

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please enter a valid email." }, { status: 422 });
  if (hasDb) {
    await getPool().query("INSERT INTO newsletter_subscribers (email, source) VALUES ($1,$2) ON CONFLICT (email) DO NOTHING", [
      parsed.data.email.toLowerCase(), parsed.data.source ?? "footer",
    ]);
  } else {
    console.log("[newsletter]", parsed.data.email);
  }
  return NextResponse.json({ ok: true, code: "WELCOME15" });
}
