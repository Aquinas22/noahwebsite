// Curated font set. next/font/google requires statically-analyzable calls, so
// every selectable font is loaded here and exposed as a CSS variable. The active
// heading/body fonts are chosen at runtime by aliasing --font-serif / --font-sans
// to one of these in the injected theme CSS (see lib/theme.ts).
import {
  Fraunces,
  Playfair_Display,
  Lora,
  Inter,
  Poppins,
  Work_Sans,
} from "next/font/google";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-poppins", display: "swap" });
const workSans = Work_Sans({ subsets: ["latin"], variable: "--font-work-sans", display: "swap" });

/** className applied to <html> so every font's CSS variable is defined. */
export const ALL_FONT_CLASSNAMES = [
  fraunces.variable,
  playfair.variable,
  lora.variable,
  inter.variable,
  workSans.variable,
  poppins.variable,
].join(" ");

/** Maps a font name (from settings) to the CSS variable that holds its family. */
export const FONT_VARS: Record<string, string> = {
  Fraunces: "--font-fraunces",
  "Playfair Display": "--font-playfair",
  Lora: "--font-lora",
  Inter: "--font-inter",
  Poppins: "--font-poppins",
  "Work Sans": "--font-work-sans",
};

export function headingFontVar(name: string): string {
  return FONT_VARS[name] ?? "--font-fraunces";
}

export function bodyFontVar(name: string): string {
  return FONT_VARS[name] ?? "--font-inter";
}
