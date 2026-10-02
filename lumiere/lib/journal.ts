export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  tone: [string, string];
  keywords: string[];
  related: string; // product slug
  body: { h?: string; p: string }[];
}

export const posts: Post[] = [
  {
    slug: "best-sunscreen-for-oily-skin",
    title: "The best sunscreen for oily skin, and how to wear it without the shine",
    excerpt: "Texture, finish and filters: what actually matters when you choose SPF for oily and combination skin.",
    category: "Skincare", readTime: "6 min", date: "2026-09-18", tone: ["#fff3cf", "#f5c95a"],
    keywords: ["sunscreen for oily skin", "best SPF 50", "non greasy sunscreen"],
    related: "daily-shield-spf-50-fluid",
    body: [
      { p: "If you have oily skin, sunscreen is probably the step you skip. It feels heavy, it makes your face shine by noon and it pills under makeup. The good news: modern fluid formulas have solved most of those problems." },
      { h: "Look for a fluid or gel texture", p: "Thick creams are formulated for dry skin. Choose a fluid, gel-cream or milk with a light, watery feel. Mattifying ingredients such as silica or starch absorb excess oil through the day." },
      { h: "Choose a broad-spectrum SPF 50", p: "Broad-spectrum protection covers UVA (ageing) and UVB (burning). Higher SPF filters most of the UVB, but only if you apply enough — roughly two finger-lengths for face and neck." },
      { h: "Apply it as the last skincare step", p: "Cleanser, serum, moisturiser (a gel one for oily skin), then sunscreen. Wait two minutes before applying makeup so the layers set instead of sliding." },
      { h: "Reapply without ruining your makeup", p: "Press a small amount of fluid over makeup with a damp sponge, or reach for a powder SPF. Do this every two hours when you are outdoors." },
    ],
  },
  {
    slug: "morning-skincare-routine-that-works",
    title: "A five-step morning skincare routine that actually works",
    excerpt: "Skip the 12-step fantasy. This is the routine dermatologists keep recommending — simple, effective, repeatable.",
    category: "Rituals", readTime: "5 min", date: "2026-09-05", tone: ["#fdeccd", "#f1b449"],
    keywords: ["morning skincare routine", "vitamin c serum", "skincare order"],
    related: "glow-ritual-vitamin-c-serum",
    body: [
      { p: "Consistency beats complexity. Five well-chosen steps will do more for your skin than a shelf of products you never finish." },
      { h: "1. Cleanse gently", p: "Use a low-foaming cleanser or simply rinse with water if your skin is dry. The goal is fresh skin, not squeaky skin." },
      { h: "2. Treat with vitamin C", p: "A vitamin C serum brightens, fades dark spots and defends against pollution. Apply 3-4 drops to dry skin and let it absorb for a minute." },
      { h: "3. Moisturise", p: "A ceramide-rich moisturiser supports the skin barrier. Oily skin can use a gel; dry skin benefits from a cream." },
      { h: "4. Protect with SPF", p: "Sunscreen is the single most effective anti-ageing product you can use. Every day, even when it is cloudy." },
      { h: "5. Finish with colour", p: "A swipe of tinted balm or lipstick and you are done in under five minutes." },
    ],
  },
  {
    slug: "how-to-make-lipstick-last-all-day",
    title: "How to make your lipstick last all day (without feathering)",
    excerpt: "A professional makeup artist's step-by-step for long-wear, transfer-free lips.",
    category: "Tutorials", readTime: "4 min", date: "2026-08-22", tone: ["#f8dfe4", "#e9a3b3"],
    keywords: ["long lasting lipstick", "how to apply lipstick", "matte lipstick tips"],
    related: "velvet-rouge-matte-lipstick",
    body: [
      { p: "Long-wear lipstick is part product, part technique. These five steps are what professionals use backstage." },
      { h: "Prep lips first", p: "Exfoliate gently, then apply a thin layer of balm. Blot off the excess so lips are soft but not slippery." },
      { h: "Line and fill", p: "Outline your natural shape with a pencil close to your lipstick shade, then fill in the entire lip. This creates an anchor for colour." },
      { h: "Apply, blot, repeat", p: "Apply lipstick, blot with a tissue, and apply a second coat. The thin layers grip far better than one thick one." },
      { h: "Set it", p: "Place a tissue over your lips and lightly dust translucent powder through it. The colour locks in without looking dry." },
    ],
  },
  {
    slug: "how-to-choose-your-signature-fragrance",
    title: "How to choose a signature fragrance you will love for years",
    excerpt: "Notes, families and testing tips — a calm guide to finding the scent that feels like you.",
    category: "Fragrance", readTime: "7 min", date: "2026-08-02", tone: ["#fbe2e8", "#d9788f"],
    keywords: ["how to choose perfume", "best rose perfume", "fragrance families"],
    related: "maison-rose-eau-de-parfum",
    body: [
      { p: "A great fragrance is not about the most expensive bottle — it is about the one that feels like an extension of you." },
      { h: "Know the families", p: "Floral, woody, amber, fresh and gourmand are the main families. Think about what you already love: fresh-cut flowers, cedar furniture, warm vanilla." },
      { h: "Understand the pyramid", p: "Top notes fade in minutes, heart notes define the character, and base notes linger for hours. Always judge a perfume after the dry-down, not the first spray." },
      { h: "Test on skin, not paper", p: "Skin chemistry changes everything. Spray one scent on each wrist, then walk away for an hour." },
      { h: "Layer with intention", p: "Pair a soft floral like Maison Rose with a smoky amber such as Amber Noir for a fragrance that is entirely yours." },
    ],
  },
];
