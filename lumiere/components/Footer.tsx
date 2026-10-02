import Link from "next/link";
import NewsletterForm from "./NewsletterForm";
import { InstagramIcon, LockIcon } from "./Icons";
import { categories } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="mt-32 bg-plum text-white/80">
      <div className="container-x grid gap-14 py-20 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="font-serif text-4xl font-medium text-white">Lumi<span className="italic text-rose-light">è</span>re</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
            Authentic, thoughtfully-curated beauty — delivered beautifully. Join the list for 15% off your first order, early access and rituals worth keeping.
          </p>
          <div className="mt-6"><NewsletterForm dark /></div>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white">
            <InstagramIcon width={18} height={18} /> @lumiere.beauty
          </a>
        </div>
        <FooterCol title="Shop" links={[["All products", "/shop"], ...categories.map((c) => [c.name, `/category/${c.slug}`] as [string, string])]} />
        <FooterCol title="Lumière" links={[["Our story", "/about"], ["Journal", "/journal"], ["Account", "/account"], ["Wishlist", "/account"]]} />
        <FooterCol title="Help" links={[["Contact us", "/contact"], ["Track an order", "/contact#track"], ["Shipping & returns", "/contact#faq"], ["FAQ", "/contact#faq"]]} />
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-4 py-6 text-xs text-white/45 sm:flex-row">
          <p>© {new Date().getFullYear()} Lumière Beauty House. All rights reserved.</p>
          <p className="flex items-center gap-2"><LockIcon width={14} height={14} /> Secure SSL checkout · Visa · Mastercard · Apple Pay · Google Pay</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-white">{title}</p>
      <ul className="space-y-3 text-sm">
        {links.map(([label, href]) => (
          <li key={label}><Link href={href} className="text-white/60 transition hover:text-white">{label}</Link></li>
        ))}
      </ul>
    </div>
  );
}
