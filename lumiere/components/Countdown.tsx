"use client";

import { useEffect, useState } from "react";

function endOfDay() {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}

export default function Countdown() {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setLeft(Math.max(0, endOfDay() - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const s = left === null ? 0 : Math.floor(left / 1000);
  const parts = [
    ["Hours", Math.floor(s / 3600)],
    ["Minutes", Math.floor((s % 3600) / 60)],
    ["Seconds", s % 60],
  ] as const;

  return (
    <div className="flex gap-3" role="timer" aria-label="Time remaining on today's offer">
      {parts.map(([label, v]) => (
        <div key={label} className="min-w-[78px] rounded-2xl bg-white/10 px-4 py-3 text-center backdrop-blur">
          <p className="font-serif text-4xl tabular-nums leading-none text-white">{left === null ? "––" : String(v).padStart(2, "0")}</p>
          <p className="mt-1.5 text-[10px] uppercase tracking-[0.2em] text-white/60">{label}</p>
        </div>
      ))}
    </div>
  );
}
