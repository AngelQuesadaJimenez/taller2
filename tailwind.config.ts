import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Azul eléctrico = confianza, energía, tecnología
        brand: {
          50: "#eaf2fb",
          100: "#cfe0f4",
          200: "#9dc0e8",
          300: "#6a9fdb",
          400: "#3d80ce",
          500: "#0b4f9e", // primario
          600: "#093f80",
          700: "#0a2f5e",
          800: "#0a2540", // navy profundo
          900: "#071a2e",
        },
        // Ámbar = la "chispa" del arranque, energía, acción
        spark: {
          50: "#fff8e6",
          100: "#ffedbf",
          200: "#ffdd85",
          300: "#ffca4d",
          400: "#ffb300", // acento CTA
          500: "#e69a00",
          600: "#b87a00",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 24px -6px rgba(10, 37, 64, 0.12)",
        cardHover: "0 12px 40px -8px rgba(10, 37, 64, 0.22)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.95)", opacity: "0.7" },
          "70%": { transform: "scale(1.3)", opacity: "0" },
          "100%": { opacity: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        "pulse-ring": "pulse-ring 2s ease-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
