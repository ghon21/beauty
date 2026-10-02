import { NextResponse } from "next/server";
import { z } from "zod";
import { getPool, hasDb } from "@/lib/db";

const schema = z.object({
  name: z.string().trim().min(1).max(80),
  contact: z.string().trim().min(3).max(160),
  message: z.string().trim().min(5).max(2000),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please fill in all fields." }, { status: 422 });
  if (hasDb) {
    await getPool().query("INSERT INTO contact_messages (name, contact, message) VALUES ($1,$2,$3)", [
      parsed.data.name, parsed.data.contact, parsed.data.message,
    ]);
  } else {
    console.log("[contact]", parsed.data);
  }
  return NextResponse.json({ ok: true });
}
