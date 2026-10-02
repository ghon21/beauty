"use client";

import { motion } from "framer-motion";
import { WHATSAPP } from "@/lib/format";

export default function WhatsAppButton() {
  return (
    <motion.a
      href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hi Lumière! I have a question about a product.")}`}
      target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 left-5 z-30 flex items-center gap-3 rounded-full bg-[#25D366] py-3 pl-3 pr-3 text-white shadow-lift transition-all hover:pr-5 sm:bottom-6 sm:left-6"
      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2, type: "spring" }} whileHover={{ scale: 1.04 }}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.9L2 22l5.25-1.5A9.9 9.9 0 1 0 12.04 2Zm5.8 14.1c-.25.7-1.45 1.35-2 1.4-.52.05-1 .25-3.4-.7-2.9-1.15-4.75-4.1-4.9-4.3-.14-.2-1.15-1.55-1.15-2.95s.73-2.1 1-2.4c.25-.28.55-.35.75-.35h.55c.18 0 .42-.07.65.5.25.6.85 2.1.92 2.25.08.15.12.33.02.52-.1.2-.15.32-.3.5l-.45.5c-.15.15-.3.3-.13.6.18.3.78 1.28 1.68 2.07 1.15 1.02 2.12 1.34 2.42 1.5.3.15.48.12.65-.07.18-.2.75-.87.95-1.17.2-.3.4-.25.68-.15l2.2 1.05c.3.15.5.22.57.35.08.12.08.72-.17 1.4Z" /></svg>
      <span className="hidden pr-2 text-sm font-semibold sm:inline">Chat with a beauty advisor</span>
    </motion.a>
  );
}
