import type { Metadata } from "next";
import ContactClient from "@/components/ContactClient";
import { faqs } from "@/lib/data";

export const metadata: Metadata = { title: "Contact & support", description: "Chat on WhatsApp, track your order and find answers about shipping, returns and authenticity." };

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ContactClient />
    </>
  );
}
