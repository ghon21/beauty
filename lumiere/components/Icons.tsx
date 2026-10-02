import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = (p: P) => ({
  width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
  strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true, ...p,
});

export const SearchIcon = (p: P) => (<svg {...base(p)}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>);
export const BagIcon = (p: P) => (<svg {...base(p)}><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>);
export const HeartIcon = ({ filled, ...p }: P & { filled?: boolean }) => (<svg {...base(p)} fill={filled ? "currentColor" : "none"}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" /></svg>);
export const UserIcon = (p: P) => (<svg {...base(p)}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>);
export const MenuIcon = (p: P) => (<svg {...base(p)}><path d="M4 7h16M4 12h16M4 17h10" /></svg>);
export const CloseIcon = (p: P) => (<svg {...base(p)}><path d="M6 6l12 12M18 6 6 18" /></svg>);
export const PlusIcon = (p: P) => (<svg {...base(p)}><path d="M12 5v14M5 12h14" /></svg>);
export const MinusIcon = (p: P) => (<svg {...base(p)}><path d="M5 12h14" /></svg>);
export const ArrowIcon = (p: P) => (<svg {...base(p)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
export const ChevronIcon = (p: P) => (<svg {...base(p)}><path d="m6 9 6 6 6-6" /></svg>);
export const CheckIcon = (p: P) => (<svg {...base(p)}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>);
export const StarIcon = ({ fill = 1, ...p }: P & { fill?: number }) => {
  const id = `s${Math.round(fill * 100)}`;
  return (
    <svg {...base(p)} width={p.width ?? 14} height={p.height ?? 14} strokeWidth={1}>
      <defs><linearGradient id={id}><stop offset={`${fill * 100}%`} stopColor="#b8883a" /><stop offset={`${fill * 100}%`} stopColor="transparent" /></linearGradient></defs>
      <path d="m12 3 2.7 5.8 6.3.8-4.6 4.4 1.2 6.3L12 17.2 6.4 20.3l1.2-6.3L3 9.6l6.3-.8L12 3Z" fill={`url(#${id})`} stroke="#b8883a" />
    </svg>
  );
};
export const TruckIcon = (p: P) => (<svg {...base(p)}><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" /><circle cx="7.5" cy="17.5" r="1.8" /><circle cx="17.5" cy="17.5" r="1.8" /></svg>);
export const ReturnIcon = (p: P) => (<svg {...base(p)}><path d="M9 14 4 9l5-5" /><path d="M4 9h10a6 6 0 0 1 0 12h-3" /></svg>);
export const ShieldIcon = (p: P) => (<svg {...base(p)}><path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.500 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></svg>);
export const SparkleIcon = (p: P) => (<svg {...base(p)}><path d="M12 3v5M12 16v5M3 12h5M16 12h5M6 6l2.5 2.5M15.500 15.500 18 18M18 6l-2.500 2.500M8.500 15.500 6 18" /></svg>);
export const ChatIcon = (p: P) => (<svg {...base(p)}><path d="M4 5h16v11H9l-5 4V5Z" /></svg>);
export const LockIcon = (p: P) => (<svg {...base(p)}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>);
export const GiftIcon = (p: P) => (<svg {...base(p)}><rect x="3" y="8" width="18" height="4" /><path d="M5 12v8h14v-8M12 8v12M12 8S9 8 8 6s1-3 2-3 2 2 2 5Zm0 0s3 0 4-2-1-3-2-3-2 2-2 5Z" /></svg>);
export const LeafIcon = (p: P) => (<svg {...base(p)}><path d="M5 19c0-9 5-14 15-14 0 10-5 15-14 15" /><path d="M5 19c3-5 6-8 10-10" /></svg>);
export const InstagramIcon = (p: P) => (<svg {...base(p)}><rect x="4" y="4" width="16" height="16" rx="5" /><circle cx="12" cy="12" r="3.5" /><circle cx="17" cy="7" r=".6" fill="currentColor" /></svg>);
