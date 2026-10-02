"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cartSubtotal, lineKey, useHydrated, useStore } from "@/lib/store";
import { computeTotals, findPromo, FREE_SHIPPING_THRESHOLD, SHIPPING_RATES } from "@/lib/pricing";
import { money } from "@/lib/format";
import ProductVisual from "@/components/ProductVisual";
import { CheckIcon, LockIcon } from "@/components/Icons";

type Form = { email: string; firstName: string; lastName: string; phone: string; address: string; city: string; postal: string };
const empty: Form = { email: "", firstName: "", lastName: "", phone: "", address: "", city: "", postal: "" };
const steps = ["Contact & address", "Delivery & payment", "Review"];

export default function CheckoutPage() {
  const hydrated = useHydrated();
  const { lines, promo, setPromo, clear, recordOrder } = useStore();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [shipping, setShipping] = useState<"standard" | "express">("standard");
  const [payment, setPayment] = useState<"card" | "wallet">("card");
  const [code, setCode] = useState("");
  const [promoMsg, setPromoMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ code: string; total: number } | null>(null);

  const subtotal = cartSubtotal(lines);
  const totals = computeTotals(subtotal, shipping, promo);
  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function validate(): boolean {
    const e: Partial<Record<keyof Form, string>> = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (form.phone.replace(/\D/g, "").length < 6) e.phone = "Enter a valid phone number";
    if (form.address.trim().length < 4) e.address = "Required";
    if (form.city.trim().length < 2) e.city = "Required";
    if (form.postal.trim().length < 3) e.postal = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function applyPromo() {
    const p = findPromo(code);
    if (p) { setPromo(p.code); setPromoMsg(`${p.code} applied — ${p.label}`); setCode(""); }
    else setPromoMsg("That code isn't valid.");
  }

  async function placeOrder() {
    setBusy(true); setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, shipping, payment, promo: promo ?? undefined, lines: lines.map((l) => ({ productId: l.productId, qty: l.qty, shade: l.shade })) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      recordOrder({ code: data.code, total: data.totals.total, items: lines.reduce((s, l) => s + l.qty, 0) });
      setDone({ code: data.code, total: data.totals.total });
      clear();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  if (!hydrated) return <div className="container-x min-h-[60vh] py-20" />;

  if (done) {
    return (
      <div className="container-x grid min-h-[70vh] place-items-center py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg">
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-rose text-white"><CheckIcon width={44} height={44} /></motion.span>
          <p className="eyebrow mt-8">Order confirmed</p>
          <h1 className="h-display mt-3 text-5xl">Thank you, {form.firstName}!</h1>
          <p className="mt-4 text-mute">Your order <strong className="text-ink">{done.code}</strong> ({money(done.total)}) is being prepared. A confirmation will be sent to {form.email}.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/shop" className="btn-primary">Keep shopping</Link>
            <Link href="/contact#track" className="btn-ghost">Track order</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="container-x grid min-h-[60vh] place-items-center py-20 text-center">
        <div><h1 className="h-display text-5xl">Your bag is empty</h1><p className="mt-3 text-mute">Add something lovely to get started.</p><Link href="/shop" className="btn-primary mt-8">Shop now</Link></div>
      </div>
    );
  }

  return (
    <div className="container-x py-14">
      <h1 className="h-display text-5xl">Checkout</h1>
      <ol className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-sm" aria-label="Checkout steps">
        {steps.map((s, i) => (
          <li key={s} className={`flex items-center gap-2 ${i <= step ? "text-ink" : "text-mute"}`}>
            <span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${i < step ? "bg-rose text-white" : i === step ? "bg-ink text-white" : "bg-ink/10"}`}>{i < step ? "✓" : i + 1}</span>{s}
          </li>
        ))}
      </ol>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_440px]">
        <div>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.form key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={(e) => { e.preventDefault(); if (validate()) setStep(1); }} noValidate className="space-y-5">
                <p className="text-sm text-mute">Checking out as a guest — no account needed.</p>
                <Field label="Email" id="email" type="email" value={form.email} onChange={set("email")} error={errors.email} autoComplete="email" />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="First name" id="fn" value={form.firstName} onChange={set("firstName")} error={errors.firstName} autoComplete="given-name" />
                  <Field label="Last name" id="ln" value={form.lastName} onChange={set("lastName")} error={errors.lastName} autoComplete="family-name" />
                </div>
                <Field label="Phone" id="phone" type="tel" value={form.phone} onChange={set("phone")} error={errors.phone} autoComplete="tel" />
                <Field label="Address" id="addr" value={form.address} onChange={set("address")} error={errors.address} autoComplete="street-address" />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="City" id="city" value={form.city} onChange={set("city")} error={errors.city} autoComplete="address-level2" />
                  <Field label="Postal code" id="zip" value={form.postal} onChange={set("postal")} error={errors.postal} autoComplete="postal-code" />
                </div>
                <button className="btn-primary w-full py-4">Continue to delivery</button>
              </motion.form>
            )}

            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <fieldset>
                  <legend className="mb-4 font-serif text-2xl">Delivery</legend>
                  <div className="space-y-3">
                    <Option on={shipping === "standard"} onClick={() => setShipping("standard")} title="Standard (3-5 days)" sub={`Free over $${FREE_SHIPPING_THRESHOLD}`} price={computeTotals(subtotal, "standard", promo).shipping === 0 ? "Free" : money(SHIPPING_RATES.standard)} />
                    <Option on={shipping === "express"} onClick={() => setShipping("express")} title="Express (1-2 days)" sub="Order before 2pm for fastest delivery" price={money(SHIPPING_RATES.express)} />
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="mb-4 font-serif text-2xl">Payment</legend>
                  <div className="space-y-3">
                    <Option on={payment === "card"} onClick={() => setPayment("card")} title="Credit / debit card" sub="Secure hosted payment page" price="" />
                    <Option on={payment === "wallet"} onClick={() => setPayment("wallet")} title="Digital wallet" sub="Apple Pay · Google Pay" price="" />
                  </div>
                  <p className="mt-4 flex items-center gap-2 text-xs text-mute"><LockIcon width={14} height={14} /> Card details are never stored on our servers. Connect your payment provider in <code>app/api/orders/route.ts</code>.</p>
                </fieldset>
                <div className="flex gap-3"><button onClick={() => setStep(0)} className="btn-ghost">Back</button><button onClick={() => setStep(2)} className="btn-primary flex-1 py-4">Review order</button></div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h2 className="font-serif text-2xl">Review & place order</h2>
                <dl className="divide-y divide-ink/10 rounded-3xl bg-white p-2 text-sm">
                  <Row k="Contact" v={`${form.email} · ${form.phone}`} />
                  <Row k="Ship to" v={`${form.firstName} ${form.lastName}, ${form.address}, ${form.city} ${form.postal}`} />
                  <Row k="Delivery" v={shipping === "standard" ? "Standard (3-5 days)" : "Express (1-2 days)"} />
                  <Row k="Payment" v={payment === "card" ? "Credit / debit card" : "Digital wallet"} />
                </dl>
                {error && <p role="alert" className="rounded-2xl bg-rose-pale p-4 text-sm text-rose-deep">{error}</p>}
                <div className="flex gap-3"><button onClick={() => setStep(1)} className="btn-ghost" disabled={busy}>Back</button>
                  <button onClick={placeOrder} disabled={busy} className="btn-rose flex-1 py-4"><LockIcon width={16} height={16} /> {busy ? "Placing order…" : `Place order — ${money(totals.total)}`}</button></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <aside className="h-fit rounded-[2rem] bg-white p-7 lg:sticky lg:top-28">
          <h2 className="font-serif text-2xl">Order summary</h2>
          <ul className="mt-5 divide-y divide-ink/10">
            {lines.map((l) => (
              <li key={lineKey(l)} className="flex gap-4 py-4">
                <span className="relative grid h-16 w-16 shrink-0 place-items-center rounded-xl" style={{ background: l.tone[0] }}>
                  <ProductVisual visual={l.visual} tone={l.tone} shade={l.shadeHex} className="h-14 w-14" />
                  <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-ink text-[10px] font-bold text-white">{l.qty}</span>
                </span>
                <div className="flex-1 text-sm"><p className="font-serif text-base leading-tight">{l.name}</p>{l.shade && <p className="text-xs text-mute">{l.shade}</p>}</div>
                <p className="text-sm font-semibold">{money(l.price * l.qty)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex gap-2">
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Discount code" aria-label="Discount code" className="input" />
            <button onClick={applyPromo} className="btn-ghost px-5">Apply</button>
          </div>
          {(promoMsg || promo) && <p className="mt-2 text-xs text-rose">{promoMsg || `${promo} applied`} {promo && <button onClick={() => { setPromo(null); setPromoMsg(""); }} className="ml-1 underline">remove</button>}</p>}
          <dl className="mt-6 space-y-2.5 border-t border-ink/10 pt-5 text-sm">
            <div className="flex justify-between"><dt className="text-mute">Subtotal</dt><dd>{money(totals.subtotal)}</dd></div>
            {totals.discount > 0 && <div className="flex justify-between text-rose"><dt>Discount</dt><dd>-{money(totals.discount)}</dd></div>}
            <div className="flex justify-between"><dt className="text-mute">Shipping</dt><dd>{totals.shipping === 0 ? "Free" : money(totals.shipping)}</dd></div>
            <div className="flex items-baseline justify-between border-t border-ink/10 pt-4"><dt className="font-semibold">Total</dt><dd className="font-serif text-3xl">{money(totals.total)}</dd></div>
          </dl>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, id, error, ...rest }: { label: string; id: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <input id={id} aria-invalid={!!error} aria-describedby={error ? `${id}-e` : undefined} className={`input ${error ? "border-rose" : ""}`} {...rest} />
      {error && <p id={`${id}-e`} className="mt-1.5 text-xs text-rose">{error}</p>}
    </div>
  );
}

function Option({ on, onClick, title, sub, price }: { on: boolean; onClick: () => void; title: string; sub: string; price: string }) {
  return (
    <button type="button" onClick={onClick} role="radio" aria-checked={on} className={`flex w-full items-center gap-4 rounded-2xl border-2 bg-white p-5 text-left transition ${on ? "border-ink" : "border-transparent hover:border-ink/20"}`}>
      <span className={`grid h-5 w-5 place-items-center rounded-full border-2 ${on ? "border-ink" : "border-ink/30"}`}>{on && <span className="h-2.5 w-2.5 rounded-full bg-ink" />}</span>
      <span className="flex-1"><span className="block font-medium">{title}</span><span className="block text-xs text-mute">{sub}</span></span>
      <span className="font-semibold">{price}</span>
    </button>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex gap-4 p-4"><dt className="w-24 shrink-0 text-mute">{k}</dt><dd>{v}</dd></div>;
}
