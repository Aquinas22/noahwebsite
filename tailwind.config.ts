import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Driven by CSS variables (see globals.css for defaults, lib/theme.ts
        // for admin overrides) so the whole palette is themeable at runtime.
        cream: "rgb(var(--color-cream) / <alpha-value>)",
        sand: "rgb(var(--color-sand) / <alpha-value>)",
        bark: "rgb(var(--color-bark) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        moss: {
          50: "rgb(var(--color-moss-50) / <alpha-value>)",
          100: "rgb(var(--color-moss-100) / <alpha-value>)",
          200: "rgb(var(--color-moss-200) / <alpha-value>)",
          300: "rgb(var(--color-moss-300) / <alpha-value>)",
          400: "rgb(var(--color-moss-400) / <alpha-value>)",
          500: "rgb(var(--color-moss-500) / <alpha-value>)",
          600: "rgb(var(--color-moss-600) / <alpha-value>)",
          700: "rgb(var(--color-moss-700) / <alpha-value>)",
          800: "rgb(var(--color-moss-800) / <alpha-value>)",
          900: "rgb(var(--color-moss-900) / <alpha-value>)",
        },
        clay: {
          400: "rgb(var(--color-clay-400) / <alpha-value>)",
          500: "rgb(var(--color-clay-500) / <alpha-value>)",
          600: "rgb(var(--color-clay-600) / <alpha-value>)",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(36, 31, 24, 0.18)",
      },
      borderRadius: {
        btn: "var(--radius-btn)",
        card: "var(--radius-card)",
        field: "var(--radius-field)",
      },
    },
  },
  plugins: [],
};

export default config;
