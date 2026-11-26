import type { Config } from "tailwindcss";
import { compactNavigation } from "./data/layout.config";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        foreground: "var(--text)",
        "glass-border": "var(--glass-border)",
        muted: "var(--muted)",
        accent: "var(--accent)",
        primary: "var(--primary)",
        "rs-gold": "var(--rs-gold)",
        focus: "var(--secondary-accent)",
      },
      fontFamily: {
        sans: ["var(--body-font)"],
        heading: ["var(--heading-font)"],
      },
      screens: {
        navigation: { raw: compactNavigation },
        tablet: { max: "850px" },
        mobile: { max: "767px" },
        compact: { max: "420px" },
        narrow: { max: "383px" },
        wide: { min: "1480px" },
      },
    },
  },
};

export default config;
