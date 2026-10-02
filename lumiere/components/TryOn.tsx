"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

const lips = [
  { name: "Rosewood", hex: "#a8475c" }, { name: "Berry Noir", hex: "#6d1f3a" }, { name: "Nude Silk", hex: "#c58b7b" },
  { name: "Crimson Muse", hex: "#b3203a" }, { name: "Soft Mauve", hex: "#a87085" }, { name: "Terracotta", hex: "#b9573a" },
];
const eyes = [
  { name: "Rose Quartz", hex: "#d89aa6" }, { name: "Bronze", hex: "#a97545" }, { name: "Smoked Plum", hex: "#6b3f5c" }, { name: "Champagne", hex: "#e6cfa3" },
];
const cheeks = [
  { name: "Peach", hex: "#f2a287" }, { name: "Rose", hex: "#e87b8f" }, { name: "Berry", hex: "#b8506b" },
];
const skins = ["#f6d9c5", "#e8bd9b", "#c68e66", "#8d5a3b", "#5c3a26"];

export default function TryOn() {
  const [lip, setLip] = useState(lips[0]);
  const [eye, setEye] = useState(eyes[0]);
  const [cheek, setCheek] = useState(cheeks[0]);
  const [skin, setSkin] = useState(skins[1]);

  return (
    <section className="container-x py-28">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <div className="relative mx-auto aspect-square w-full max-w-[520px]">
          <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-blush to-rose-pale" />
          <svg viewBox="0 0 400 400" className="relative h-full w-full" role="img" aria-label={`Face preview wearing ${lip.name} lipstick`}>
            <defs>
              <radialGradient id="shade" cx="50%" cy="40%" r="60%">
                <stop offset="0" stopColor="#fff" stopOpacity=".35" /><stop offset="1" stopColor="#000" stopOpacity=".12" />
              </radialGradient>
              <filter id="soft"><feGaussianBlur stdDeviation="9" /></filter>
            </defs>
            <path d="M120 400c4-52 34-72 80-72s76 20 80 72Z" fill={skin} />
            <rect x="178" y="270" width="44" height="70" rx="16" fill={skin} />
            <path d="M92 190C92 96 140 56 200 56s108 40 108 134c0 82-50 142-108 142S92 272 92 190Z" fill="#2a1620" opacity=".92" transform="translate(0 -8)" />
            <path d="M104 196c0-72 38-110 96-110s96 38 96 110c0 78-46 130-96 130s-96-52-96-130Z" fill={skin} />
            <path d="M104 196c0-72 38-110 96-110s96 38 96 110c0 78-46 130-96 130s-96-52-96-130Z" fill="url(#shade)" />
            <motion.ellipse cx="144" cy="228" rx="30" ry="20" fill={cheek.hex} filter="url(#soft)" animate={{ fill: cheek.hex }} opacity=".55" />
            <motion.ellipse cx="256" cy="228" rx="30" ry="20" fill={cheek.hex} filter="url(#soft)" animate={{ fill: cheek.hex }} opacity=".55" />
            {[148, 252].map((cx) => (
              <g key={cx}>
                <motion.ellipse cx={cx} cy="186" rx="30" ry="15" animate={{ fill: eye.hex }} opacity=".75" filter="url(#soft)" />
                <ellipse cx={cx} cy="192" rx="17" ry="8" fill="#fff" />
                <circle cx={cx} cy="192" r="6.500" fill="#3a2418" />
                <circle cx={cx + 2} cy="190" r="1.800" fill="#fff" />
                <path d={`M${cx - 20} 190q20-14 40 0`} stroke="#1c1417" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d={`M${cx - 26} 160q26-16 52 0`} stroke="#2a1620" strokeWidth="5" fill="none" strokeLinecap="round" />
              </g>
            ))}
            <path d="M200 196c-4 22-10 40-6 50 3 5 9 6 12 0" stroke="#000" strokeOpacity=".15" strokeWidth="3" fill="none" strokeLinecap="round" />
            <motion.path
              d="M162 280c10-10 24-12 38-5 14-7 28-5 38 5-10 18-24 26-38 26s-28-8-38-26Z"
              animate={{ fill: lip.hex }} transition={{ duration: 0.45 }}
            />
            <path d="M162 280c10-10 24-12 38-5 14-7 28-5 38 5" stroke="#000" strokeOpacity=".18" strokeWidth="1.500" fill="none" />
            <path d="M184 276c8-3 24-3 32 0" stroke="#fff" strokeOpacity=".4" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
        </div>

        <div>
          <p className="eyebrow">Virtual try-on</p>
          <h2 className="h-display mt-3 text-5xl sm:text-6xl">See it on <span className="italic text-rose">you</span> before you buy</h2>
          <p className="mt-5 max-w-lg text-mute">Pick a skin tone and play with lips, eyes and cheeks. Found a favourite? Jump straight to the product.</p>

          <Group label="Skin tone">
            {skins.map((s) => (
              <button key={s} onClick={() => setSkin(s)} aria-label={`Skin tone ${s}`} aria-pressed={skin === s} className={`h-9 w-9 rounded-full border-2 transition ${skin === s ? "scale-110 border-ink" : "border-white"}`} style={{ background: s }} />
            ))}
          </Group>
          <Group label={`Lips — ${lip.name}`}>
            {lips.map((s) => <Swatch key={s.name} s={s} active={lip.name === s.name} onClick={() => setLip(s)} />)}
          </Group>
          <Group label={`Eyes — ${eye.name}`}>
            {eyes.map((s) => <Swatch key={s.name} s={s} active={eye.name === s.name} onClick={() => setEye(s)} />)}
          </Group>
          <Group label={`Cheeks — ${cheek.name}`}>
            {cheeks.map((s) => <Swatch key={s.name} s={s} active={cheek.name === s.name} onClick={() => setCheek(s)} />)}
          </Group>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/product/velvet-rouge-matte-lipstick" className="btn-primary">Shop Velvet Rouge</Link>
            <Link href="/product/rose-quartz-eyeshadow-palette" className="btn-ghost">Shop the palette</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-7">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-mute">{label}</p>
      <div className="flex flex-wrap gap-3">{children}</div>
    </div>
  );
}

function Swatch({ s, active, onClick }: { s: { name: string; hex: string }; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} title={s.name} aria-label={s.name} aria-pressed={active} className={`h-9 w-9 rounded-full border-2 border-white shadow-soft ring-offset-2 transition hover:scale-110 ${active ? "ring-2 ring-ink" : ""}`} style={{ background: s.hex }} />
  );
}
