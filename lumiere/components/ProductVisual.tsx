import { useId } from "react";
import type { Visual } from "@/lib/types";

interface Props {
  visual: Visual;
  tone: [string, string];
  shade?: string;
  className?: string;
  rotate?: number;
}

/** Hand-drawn SVG product renders — no external images required. */
export default function ProductVisual({ visual, tone, shade, className = "", rotate = 0 }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [a, b] = tone;
  const accent = shade ?? b;
  const g = `g${uid}`;
  const glass = `gl${uid}`;
  const metal = `m${uid}`;

  return (
    <svg viewBox="0 0 200 240" className={className} role="img" aria-hidden="true" style={{ transform: rotate ? `rotate(${rotate}deg)` : undefined }}>
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={accent} />
        </linearGradient>
        <linearGradient id={glass} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".85" />
          <stop offset=".45" stopColor="#ffffff" stopOpacity=".35" />
          <stop offset="1" stopColor="#ffffff" stopOpacity=".6" />
        </linearGradient>
        <linearGradient id={metal} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8a6a2a" />
          <stop offset=".35" stopColor="#f0d79b" />
          <stop offset=".6" stopColor="#c9a24e" />
          <stop offset="1" stopColor="#8a6a2a" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="222" rx="52" ry="7" fill="#1c1417" opacity=".12" />
      {visual === "lipstick" && (
        <g>
          <rect x="72" y="140" width="56" height="74" rx="7" fill={`url(#${metal})`} />
          <rect x="72" y="130" width="56" height="14" rx="4" fill="#2a1620" />
          <rect x="78" y="86" width="44" height="46" rx="4" fill="#2a1620" />
          <path d="M80 100 L80 62 Q80 44 100 36 L120 52 L120 100 Z" fill={accent} />
          <path d="M80 62 Q80 44 100 36 L100 100 L80 100Z" fill="#fff" opacity=".18" />
          <rect x="82" y="150" width="4" height="56" rx="2" fill="#fff" opacity=".35" />
        </g>
      )}
      {visual === "bottle" && (
        <g>
          <rect x="82" y="26" width="36" height="34" rx="5" fill={`url(#${metal})`} />
          <rect x="88" y="58" width="24" height="16" fill={accent} opacity=".6" />
          <rect x="58" y="72" width="84" height="142" rx="22" fill={`url(#${g})`} />
          <rect x="58" y="72" width="84" height="142" rx="22" fill={`url(#${glass})`} opacity=".7" />
          <rect x="72" y="120" width="56" height="52" rx="6" fill="#fff" opacity=".88" />
          <rect x="80" y="130" width="40" height="3" rx="1.500" fill="#2a1620" />
          <rect x="84" y="140" width="32" height="2" rx="1" fill="#2a1620" opacity=".5" />
          <rect x="88" y="148" width="24" height="2" rx="1" fill="#2a1620" opacity=".5" />
        </g>
      )}
      {visual === "jar" && (
        <g>
          <rect x="46" y="96" width="108" height="104" rx="18" fill={`url(#${g})`} />
          <rect x="46" y="96" width="108" height="104" rx="18" fill={`url(#${glass})`} opacity=".6" />
          <rect x="40" y="66" width="120" height="38" rx="12" fill={`url(#${metal})`} />
          <rect x="40" y="66" width="120" height="10" rx="5" fill="#fff" opacity=".3" />
          <rect x="64" y="132" width="72" height="40" rx="6" fill="#fff" opacity=".9" />
          <rect x="74" y="143" width="52" height="3" rx="1.500" fill="#2a1620" />
          <rect x="82" y="152" width="36" height="2" rx="1" fill="#2a1620" opacity=".5" />
        </g>
      )}
      {visual === "tube" && (
        <g>
          <path d="M64 46h72l8 14H56z" fill={`url(#${metal})`} />
          <rect x="62" y="28" width="76" height="22" rx="6" fill="#2a1620" />
          <path d="M56 60h88l-8 148H64z" fill={`url(#${g})`} />
          <path d="M56 60h88l-8 148H64z" fill={`url(#${glass})`} opacity=".45" />
          <rect x="72" y="104" width="56" height="62" rx="6" fill="#fff" opacity=".9" />
          <rect x="80" y="116" width="40" height="4" rx="2" fill="#2a1620" />
          <text x="100" y="146" textAnchor="middle" fontFamily="serif" fontWeight="700" fontSize="20" fill={accent}>50</text>
          <path d="M64 208h72v8H64z" fill={accent} opacity=".6" />
        </g>
      )}
      {visual === "palette" && (
        <g>
          <rect x="20" y="52" width="160" height="136" rx="14" fill="#2a1620" />
          <rect x="20" y="52" width="160" height="136" rx="14" fill={`url(#${metal})`} opacity=".14" />
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const cx = 48 + (i % 3) * 52;
            const cy = 90 + Math.floor(i / 3) * 52;
            const shades = [a, accent, "#c98998", "#e8c5c9", "#8d5662", "#f3dcd2"];
            return <g key={i}><circle cx={cx} cy={cy} r="21" fill={shades[i]} /><circle cx={cx - 6} cy={cy - 7} r="6" fill="#fff" opacity=".28" /></g>;
          })}
          <rect x="20" y="52" width="160" height="12" rx="6" fill={`url(#${metal})`} />
        </g>
      )}
      {visual === "brush" && (
        <g>
          <g transform="rotate(-16 100 120)">
            <rect x="92" y="108" width="16" height="108" rx="8" fill={`url(#${g})`} />
            <rect x="90" y="84" width="20" height="30" rx="4" fill={`url(#${metal})`} />
            <path d="M88 84C84 60 90 36 100 28c10 8 16 32 12 56Z" fill="#fff" stroke={accent} strokeWidth="2" />
            <path d="M92 80C92 58 96 44 100 36" stroke={accent} strokeWidth="2" fill="none" opacity=".5" />
          </g>
          <g transform="rotate(14 100 120)" opacity=".92">
            <rect x="92" y="130" width="14" height="86" rx="7" fill={`url(#${g})`} />
            <rect x="90" y="110" width="18" height="24" rx="4" fill={`url(#${metal})`} />
            <ellipse cx="99" cy="84" rx="14" ry="28" fill={a} stroke={accent} strokeWidth="2" />
          </g>
        </g>
      )}
      {visual === "perfume" && (
        <g>
          <rect x="78" y="22" width="44" height="40" rx="6" fill={`url(#${metal})`} />
          <rect x="78" y="22" width="44" height="10" rx="5" fill="#fff" opacity=".3" />
          <rect x="92" y="60" width="16" height="12" fill={accent} opacity=".6" />
          <rect x="48" y="70" width="104" height="142" rx="16" fill={`url(#${g})`} />
          <rect x="48" y="70" width="104" height="142" rx="16" fill={`url(#${glass})`} opacity=".65" />
          <rect x="62" y="86" width="76" height="110" rx="8" fill="#fff" opacity=".28" />
          <rect x="68" y="124" width="64" height="44" rx="4" fill="#fff" opacity=".92" />
          <text x="100" y="143" textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize="14" fill="#2a1620">Lumière</text>
          <rect x="82" y="152" width="36" height="2" rx="1" fill="#2a1620" opacity=".5" />
        </g>
      )}
      {visual === "dropper" && (
        <g>
          <path d="M88 20c0-8 24-8 24 0v44H88z" fill="#2a1620" />
          <rect x="84" y="58" width="32" height="20" rx="3" fill={`url(#${metal})`} />
          <rect x="52" y="76" width="96" height="136" rx="18" fill={`url(#${g})`} />
          <rect x="52" y="76" width="96" height="136" rx="18" fill={`url(#${glass})`} opacity=".7" />
          <rect x="66" y="124" width="68" height="52" rx="6" fill="#fff" opacity=".9" />
          <rect x="76" y="136" width="48" height="4" rx="2" fill="#2a1620" />
          <rect x="84" y="148" width="32" height="2" rx="1" fill="#2a1620" opacity=".5" />
          <rect x="88" y="156" width="24" height="2" rx="1" fill="#2a1620" opacity=".5" />
        </g>
      )}
      {visual === "mascara" && (
        <g transform="rotate(8 100 120)">
          <rect x="82" y="20" width="36" height="104" rx="14" fill="#2a1620" />
          <rect x="82" y="108" width="36" height="14" fill={`url(#${metal})`} />
          <rect x="76" y="122" width="48" height="92" rx="12" fill={`url(#${g})`} />
          <rect x="76" y="122" width="48" height="92" rx="12" fill={`url(#${glass})`} opacity=".5" />
          <rect x="86" y="144" width="28" height="3" rx="1.500" fill="#fff" />
          <rect x="90" y="154" width="20" height="2" rx="1" fill="#fff" opacity=".6" />
          <rect x="88" y="28" width="4" height="70" rx="2" fill="#fff" opacity=".2" />
        </g>
      )}
      {visual === "compact" && (
        <g>
          <circle cx="100" cy="124" r="76" fill={`url(#${metal})`} />
          <circle cx="100" cy="124" r="68" fill="#2a1620" />
          <path d="M100 56a68 68 0 0 0 0 136Z" fill={a} />
          <path d="M100 56a68 68 0 0 1 0 136Z" fill={accent} />
          <circle cx="76" cy="96" r="14" fill="#fff" opacity=".22" />
          <rect x="97" y="56" width="6" height="136" fill="#2a1620" />
        </g>
      )}
    </svg>
  );
}
