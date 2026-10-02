import type { Metadata, Viewport } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ExitIntent from "@/components/ExitIntent";
import WhatsAppButton from "@/components/WhatsAppButton";
import { SITE_URL } from "@/lib/format";

const serif = Playfair_Display({ subsets: ["latin"], variable: "--font-serif", display: "swap", style: ["normal", "italic"] });
const sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Lumière — Authentic Beauty, Beautifully Delivered", template: "%s | Lumière" },
  description: "Shop authentic makeup, skincare, haircare and fragrance. Free shipping over $75, 14-day returns and 100% genuine products.",
  openGraph: { type: "website", siteName: "Lumière", title: "Lumière — Authentic Beauty, Beautifully Delivered", description: "Authentic makeup, skincare, haircare and fragrance." },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#fdf9f6", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-white">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <CartDrawer />
        <ExitIntent />
        <WhatsAppButton />
      </body>
    </html>
  );
}
