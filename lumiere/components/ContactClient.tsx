"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { faqs } from "@/lib/data";
import { WHATSAPP } from "@/lib/format";
import { CheckIcon, ChevronIcon, InstagramIcon } from "./Icons";

const STEPS = ["processing", "packed", "shipped", "delivered"];

export default function ContactClient() {
  const [msg, setMsg] = useState({ name: "", contact: "", message: "" });
  const [sent, setSent] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [track, setTrack] = useState({ code: "", email: "" });
  const [result, setResult] = useState<{ status?: string; error?: string; demo?: boolean } | null>(null);
  const [open, setOpen] = useState<number | null>(0);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setSent("loading");
    const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(msg) }).catch(() => null);
    setSent(res?.ok ? "ok" : "err");
  }

  async function lookup(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/track?code=${encodeURIComponent(track.code)}&email=${encodeURIComponent(track.email)}`).catch(() => null);
    setResult(res ? await res.json() : { error: "Network error. Please try again." });
  }

  const stepIdx = result?.status ? STEPS.indexOf(result.status) : -1;

  return (
    <div className="container-x py-16">
      <p className="eyebrow">Help centre</p>
      <h1 className="h-display mt-3 text-6xl sm:text-8xl">We&apos;re here to <span className="italic text-rose">help</span></h1>

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="rounded-3xl bg-[#25D366] p-8 text-white transition hover:-translate-y-1 hover:shadow-lift"><p className="font-serif text-3xl">WhatsApp</p><p className="mt-2 text-white/85">Fastest replies · 9am-9pm daily</p></a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="rounded-3xl bg-plum p-8 text-white transition hover:-translate-y-1 hover:shadow-lift"><p className="flex items-center gap-2 font-serif text-3xl"><InstagramIcon /> Instagram</p><p className="mt-2 text-white/70">DM @lumiere.beauty</p></a>
        <a href="mailto:hello@lumiere.example" className="rounded-3xl bg-blush p-8 transition hover:-translate-y-1 hover:shadow-lift"><p className="font-serif text-3xl">Email</p><p className="mt-2 text-mute">hello@lumiere.example · within 24h</p></a>
      </div>

      <div className="mt-20 grid gap-14 lg:grid-cols-2">
        <section aria-labelledby="msg-h">
          <h2 id="msg-h" className="font-serif text-4xl">Send a message</h2>
          {sent === "ok" ? (
            <p className="mt-8 flex items-center gap-3 rounded-3xl bg-rose-pale p-6"><CheckIcon className="text-rose" /> Thank you — we&apos;ll reply within 24 hours.</p>
          ) : (
            <form onSubmit={send} className="mt-8 space-y-5">
              <div><label className="label" htmlFor="cn">Name</label><input id="cn" required className="input" value={msg.name} onChange={(e) => setMsg({ ...msg, name: e.target.value })} /></div>
              <div><label className="label" htmlFor="cc">Email or phone</label><input id="cc" required className="input" value={msg.contact} onChange={(e) => setMsg({ ...msg, contact: e.target.value })} /></div>
              <div><label className="label" htmlFor="cm">Message</label><textarea id="cm" required minLength={5} rows={5} className="input resize-none" value={msg.message} onChange={(e) => setMsg({ ...msg, message: e.target.value })} /></div>
              {sent === "err" && <p role="alert" className="text-sm text-rose">Something went wrong. Please try again.</p>}
              <button disabled={sent === "loading"} className="btn-primary">{sent === "loading" ? "Sending…" : "Send message"}</button>
            </form>
          )}
        </section>

        <section id="track" aria-labelledby="track-h" className="scroll-mt-28">
          <h2 id="track-h" className="font-serif text-4xl">Track your order</h2>
          <form onSubmit={lookup} className="mt-8 space-y-5">
            <div><label className="label" htmlFor="tc">Order code</label><input id="tc" required placeholder="LM-1A2B3C" className="input uppercase" value={track.code} onChange={(e) => setTrack({ ...track, code: e.target.value })} /></div>
            <div><label className="label" htmlFor="te">Email used at checkout</label><input id="te" type="email" required className="input" value={track.email} onChange={(e) => setTrack({ ...track, email: e.target.value })} /></div>
            <button className="btn-ghost">Check status</button>
          </form>
          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 rounded-3xl bg-white p-7">
                {result.error ? <p className="text-rose">{result.error}</p> : (
                  <>
                    <ol className="flex items-center justify-between">
                      {STEPS.map((s, i) => (
                        <li key={s} className="flex flex-1 flex-col items-center text-center text-xs capitalize">
                          <span className={`grid h-9 w-9 place-items-center rounded-full ${i <= stepIdx ? "bg-rose text-white" : "bg-ink/10"}`}>{i <= stepIdx ? <CheckIcon width={16} height={16} /> : i + 1}</span>
                          <span className="mt-2">{s}</span>
                        </li>
                      ))}
                    </ol>
                    {result.demo && <p className="mt-5 text-xs text-mute">Demo mode: connect PostgreSQL to see real order statuses.</p>}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      <section id="faq" className="mx-auto mt-28 max-w-3xl scroll-mt-28">
        <h2 className="text-center font-serif text-5xl">Frequently asked</h2>
        <div className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
          {faqs.map((f, i) => (
            <div key={f.q}>
              <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-4 py-6 text-left font-serif text-xl">
                {f.q}<ChevronIcon className={`shrink-0 transition ${open === i ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence initial={false}>
                {open === i && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pb-6 leading-relaxed text-mute">{f.a}</motion.p>}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
