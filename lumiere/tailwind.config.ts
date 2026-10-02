import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1c1417",
        plum: "#2a1620",
        rose: { DEFAULT: "#c4536a", light: "#e8839a", pale: "#fbeef1", deep: "#9c3a50" },
        gold: { DEFAULT: "#b8883a", light: "#d9b574" },
        blush: "#f8ece8",
        cream: "#fdf9f6",
        sand: "#efe3dc",
        mute: "#85707a",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 40px -12px rgba(42,22,32,0.18)",
        lift: "0 24px 60px -20px rgba(42,22,32,0.32)",
      },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        shimmer: { from: { backgroundPosition: "-200% 0" }, to: { backgroundPosition: "200% 0" } },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
