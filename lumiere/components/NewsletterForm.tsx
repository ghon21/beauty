"use client";

import { useState } from "react";
import { CheckIcon } from "./Icons";

export default function NewsletterForm({ source = "footer", dark = false }: { source?: string; dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, source }) });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className={`flex items-center gap-2 text-sm ${dark ? "text-white" : "text-ink"}`}>
        <CheckIcon className="text-rose-light" /> You&apos;re in! Use code <strong className="tracking-widest">WELCOME15</strong> at checkout.
      </p>
    );
  }
  return (
    <form onSubmit={submit} className="flex w-full max-w-md flex-col gap-2 sm:flex-row" noValidate>
      <label htmlFor={`nl-${source}`} className="sr-only">Email address</label>
      <input
        id={`nl-${source}`} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address"
        className={`flex-1 rounded-full border px-5 py-3.5 text-sm outline-none transition ${dark ? "border-white/20 bg-white/5 text-white placeholder:text-white/40 focus:border-rose-light" : "border-ink/15 bg-white focus:border-rose"}`}
      />
      <button disabled={state === "loading"} className="btn-rose whitespace-nowrap">{state === "loading" ? "Joining…" : "Get 15% off"}</button>
      {state === "error" && <p className="text-xs text-rose-light sm:absolute sm:mt-14">Please enter a valid email.</p>}
    </form>
  );
}
