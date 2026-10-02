"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import NewsletterForm from "./NewsletterForm";
import { CloseIcon } from "./Icons";

const KEY = "lumiere-exit-shown";

/** Shows once per session when the cursor leaves the viewport (desktop) or after 45s of browsing (mobile). */
export default function ExitIntent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let shown = false;
    try { shown = sessionStorage.getItem(KEY) === "1"; } catch { /* storage blocked */ }
    if (shown) return;
    const show = () => {
      setOpen(true);
      try { sessionStorage.setItem(KEY, "1"); } catch { /* ignore */ }
      cleanup();
    };
    const onLeave = (e: MouseEvent) => { if (e.clientY <= 0) show(); };
    const timer = window.setTimeout(() => { if (window.matchMedia("(pointer: coarse)").matches) show(); }, 45_000);
    const arm = window.setTimeout(() => document.addEventListener("mouseleave", onLeave), 8_000);
    function cleanup() {
      document.removeEventListener("mouseleave", onLeave);
      window.clearTimeout(timer);
      window.clearTimeout(arm);
    }
    return cleanup;
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[80] grid place-items-center bg-ink/60 p-5 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
          <motion.div
            role="dialog" aria-modal="true" aria-label="Wait — 15% off"
            className="relative w-full max-w-lg overflow-hidden rounded-[2rem] bg-cream p-10 text-center shadow-lift"
            initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-rose/20 blur-3xl" />
            <button onClick={() => setOpen(false)} aria-label="Close" className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full hover:bg-ink/5"><CloseIcon /></button>
            <p className="eyebrow">Before you go</p>
            <h2 className="h-display mt-3 text-5xl">Wait — take <span className="shimmer-text italic">15% off</span></h2>
            <p className="mx-auto mt-4 max-w-xs text-sm text-mute">Join Lumière and get 15% off your first order, plus early access to new launches.</p>
            <div className="mt-7 flex justify-center"><NewsletterForm source="exit-intent" /></div>
            <button onClick={() => setOpen(false)} className="mt-5 text-xs text-mute underline underline-offset-4 hover:text-ink">No thanks, I prefer full price</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
