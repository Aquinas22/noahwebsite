// Turns the admin's appearance settings into a `:root { ... }` CSS string that
// overrides the Tailwind color/radius/layout variables defined in globals.css.
import type { Settings } from "./settings";
import { SETTING_DEFAULTS } from "./settings-schema";
import { headingFontVar, bodyFontVar } from "./fonts";

type RGB = { r: number; g: number; b: number };

function hexToRgb(hex: string): RGB {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  if (h.length !== 6 || Number.isNaN(n)) return { r: 0, g: 0, b: 0 };
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

const channels = (c: RGB) => `${Math.round(c.r)} ${Math.round(c.g)} ${Math.round(c.b)}`;

function mix(a: RGB, b: RGB, amount: number): RGB {
  return {
    r: a.r + (b.r - a.r) * amount,
    g: a.g + (b.g - a.g) * amount,
    b: a.b + (b.b - a.b) * amount,
  };
}

const WHITE: RGB = { r: 255, g: 255, b: 255 };
const NEAR_BLACK: RGB = { r: 17, g: 19, b: 14 };

// Lightness steps for a 50–900 scale, anchored on the chosen color at 600.
const TINTS: Record<number, number> = { 50: 0.92, 100: 0.82, 200: 0.62, 300: 0.4, 400: 0.2, 500: 0.08 };
const SHADES: Record<number, number> = { 700: 0.22, 800: 0.35, 900: 0.45 };

/** Generate a full Tailwind-style 50..900 scale from one base color (at 600). */
function scaleVars(prefix: string, baseHex: string): string {
  const base = hexToRgb(baseHex);
  const lines: string[] = [];
  for (const [step, amt] of Object.entries(TINTS)) {
    lines.push(`--color-${prefix}-${step}: ${channels(mix(base, WHITE, amt))};`);
  }
  lines.push(`--color-${prefix}-600: ${channels(base)};`);
  for (const [step, amt] of Object.entries(SHADES)) {
    lines.push(`--color-${prefix}-${step}: ${channels(mix(base, NEAR_BLACK, amt))};`);
  }
  return lines.join(" ");
}

const RADIUS: Record<string, { btn: string; card: string; field: string }> = {
  rounded: { btn: "9999px", card: "1rem", field: "0.75rem" },
  soft: { btn: "0.6rem", card: "0.75rem", field: "0.5rem" },
  sharp: { btn: "0.25rem", card: "0.25rem", field: "0.25rem" },
};

const CONTAINER: Record<string, string> = {
  narrow: "64rem",
  normal: "72rem",
  wide: "80rem",
};

function get(s: Settings, key: string): string {
  return s[key] || SETTING_DEFAULTS[key] || "";
}

/** Builds the CSS variable overrides for the current theme settings. */
export function themeCss(s: Settings): string {
  const radius = RADIUS[get(s, "theme_radius")] ?? RADIUS.rounded;
  const container = CONTAINER[get(s, "container_width")] ?? CONTAINER.normal;

  const parts = [
    // Accent → the "moss" scale used throughout the UI.
    scaleVars("moss", get(s, "theme_accent")),
    // Coffee / secondary accent → the "clay" scale (only 400/500/600 are used).
    scaleVars("clay", get(s, "theme_coffee")),
    `--color-cream: ${channels(hexToRgb(get(s, "theme_bg")))};`,
    `--color-sand: ${channels(hexToRgb(get(s, "theme_surface")))};`,
    `--color-bark: ${channels(hexToRgb(get(s, "theme_text")))};`,
    `--color-ink: ${channels(hexToRgb(get(s, "theme_heading")))};`,
    `--radius-btn: ${radius.btn};`,
    `--radius-card: ${radius.card};`,
    `--radius-field: ${radius.field};`,
    `--container-max: ${container};`,
    `--font-serif: var(${headingFontVar(get(s, "font_heading"))});`,
    `--font-sans: var(${bodyFontVar(get(s, "font_body"))});`,
  ];

  return `:root{${parts.join(" ")}}`;
}
