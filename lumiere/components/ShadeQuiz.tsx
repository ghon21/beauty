"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { seedProducts } from "@/lib/data";
import ProductCard from "./ProductCard";

const steps = [
  { key: "skin", q: "What best describes your skin?", options: ["Oily", "Dry", "Combination", "Sensitive", "Normal"] },
  { key: "goal", q: "What's your main goal?", options: ["Glow & brightness", "Hydration", "Sun protection", "Anti-ageing", "Colour & makeup"] },
  { key: "finish", q: "Which finish do you love?", options: ["Natural & dewy", "Soft matte", "Full glam"] },
] as const;

export default function ShadeQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const done = step >= steps.length;

  const results = useMemo(() => {
    if (!done) return [];
    const skin = answers.skin;
    const goal = answers.goal;
    const score = (p: (typeof seedProducts)[number]) => {
      let s = p.popularity / 100;
      if (p.skinTypes.includes(skin) || p.skinTypes.includes("All")) s += 1;
      if (goal === "Glow & brightness" && /vitamin|serum|glow/i.test(p.name)) s += 3;
      if (goal === "Hydration" && /moistur|toner|cloud|dew/i.test(p.name)) s += 3;
      if (goal === "Sun protection" && /spf|shield/i.test(p.name)) s += 3;
      if (goal === "Anti-ageing" && /night|retin|repair/i.test(p.name)) s += 3;
      if (goal === "Colour & makeup" && p.category === "makeup") s += 3;
      if (answers.finish === "Soft matte" && /matte|spf|shield/i.test(p.name)) s += 1;
      if (answers.finish === "Natural & dewy" && /serum|dew|glow|veil/i.test(p.name)) s += 1;
      return s;
    };
    return [...seedProducts].filter((p) => p.stock > 0).sort((a, b) => score(b) - score(a)).slice(0, 3);
  }, [done, answers]);

  return (
    <section className="bg-blush py-28">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Beauty finder</p>
          <h2 className="h-display mt-3 text-5xl sm:text-6xl">Find your perfect match</h2>
          <p className="mt-4 text-mute">Three quick questions. Personalised picks in seconds.</p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <div className="mb-8 flex gap-2" aria-hidden="true">
            {steps.map((_, i) => <span key={i} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i <= step ? "bg-rose" : "bg-ink/10"}`} />)}
          </div>

          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }}>
                <h3 className="text-center font-serif text-3xl">{steps[step].q}</h3>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  {steps[step].options.map((o) => (
                    <button
                      key={o}
                      onClick={() => { setAnswers((a) => ({ ...a, [steps[step].key]: o })); setStep(step + 1); }}
                      className="rounded-full border border-ink/15 bg-white px-7 py-4 text-sm font-medium transition hover:-translate-y-1 hover:border-rose hover:text-rose hover:shadow-soft"
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h3 className="text-center font-serif text-3xl">Your edit</h3>
                <p className="mt-2 text-center text-sm text-mute">{answers.skin} skin · {answers.goal.toLowerCase()} · {answers.finish.toLowerCase()}</p>
                <div className="mt-10 grid gap-6 sm:grid-cols-3">
                  {results.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
                </div>
                <div className="mt-10 text-center">
                  <button onClick={() => { setStep(0); setAnswers({}); }} className="btn-ghost">Retake quiz</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
