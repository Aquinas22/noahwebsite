// Central registry of every editable site setting.
//
// This is the single source of truth: the admin form renders from it, the
// save action knows which keys to persist from it, and the database seeds its
// defaults from it. Adding a new editable field is now a one-line change here.

export type FieldType =
  | "text"
  | "textarea"
  | "url"
  | "email"
  | "color"
  | "select"
  | "toggle";

export type SettingField = {
  key: string;
  label: string;
  type: FieldType;
  group: string;
  default: string;
  placeholder?: string;
  help?: string;
  rows?: number;
  options?: { value: string; label: string }[];
};

export const GROUPS = {
  identity: "Identity",
  appearance: "Appearance",
  layout: "Typography & layout",
  home: "Home page",
  about: "About page",
  nav: "Navigation & sections",
  contact: "Contact page",
  seo: "SEO & sharing",
  coffee: "Buy me a coffee",
  social: "Contact & social",
  footer: "Footer",
} as const;

export const HEADING_FONT_OPTIONS = [
  "Fraunces",
  "Playfair Display",
  "Lora",
] as const;

export const BODY_FONT_OPTIONS = ["Inter", "Poppins", "Work Sans"] as const;

export const SETTINGS_SCHEMA: SettingField[] = [
  // ---- Identity ----
  { key: "site_title", label: "Site / your name", type: "text", group: "identity", default: "Noah Roe" },
  { key: "tagline", label: "Tagline", type: "text", group: "identity", default: "Power Systems Engineer" },
  { key: "location", label: "Location", type: "text", group: "identity", default: "Plymouth, Minnesota" },
  {
    key: "bio",
    label: "Bio",
    type: "textarea",
    group: "identity",
    rows: 5,
    default:
      "I'm Noah — a 25-year-old power systems engineer in Plymouth, Minnesota. I design and build things that keep the lights on, and tinker with side projects and websites in my spare time. My wife Jessica and I dream of one day starting a little hobby farm of our own.",
  },

  // ---- Appearance (theme colors) ----
  { key: "theme_accent", label: "Accent color", type: "color", group: "appearance", default: "#436330", help: "Buttons, links, highlights. A full tint/shade scale is generated from this." },
  { key: "theme_bg", label: "Page background", type: "color", group: "appearance", default: "#f7f3ec" },
  { key: "theme_surface", label: "Surface / cards", type: "color", group: "appearance", default: "#efe7d8" },
  { key: "theme_text", label: "Body text", type: "color", group: "appearance", default: "#3b3228" },
  { key: "theme_heading", label: "Headings", type: "color", group: "appearance", default: "#241f18" },
  { key: "theme_coffee", label: "Coffee button color", type: "color", group: "appearance", default: "#b5713f" },

  // ---- Typography & layout ----
  {
    key: "font_heading",
    label: "Heading font",
    type: "select",
    group: "layout",
    default: "Fraunces",
    options: HEADING_FONT_OPTIONS.map((f) => ({ value: f, label: f })),
  },
  {
    key: "font_body",
    label: "Body font",
    type: "select",
    group: "layout",
    default: "Inter",
    options: BODY_FONT_OPTIONS.map((f) => ({ value: f, label: f })),
  },
  {
    key: "theme_radius",
    label: "Corner style",
    type: "select",
    group: "layout",
    default: "rounded",
    options: [
      { value: "rounded", label: "Rounded (pill buttons)" },
      { value: "soft", label: "Soft" },
      { value: "sharp", label: "Sharp / square" },
    ],
  },
  {
    key: "container_width",
    label: "Content width",
    type: "select",
    group: "layout",
    default: "normal",
    options: [
      { value: "narrow", label: "Narrow" },
      { value: "normal", label: "Normal" },
      { value: "wide", label: "Wide" },
    ],
  },

  // ---- Home page ----
  { key: "hero_heading", label: "Hero heading", type: "text", group: "home", default: "Hi, I'm Noah." },
  {
    key: "hero_intro",
    label: "Hero intro",
    type: "textarea",
    group: "home",
    rows: 3,
    default:
      "I'm Noah — a 25-year-old power systems engineer in Plymouth, Minnesota. I design and build things that keep the lights on, and tinker with side projects and websites in my spare time. My wife Jessica and I dream of one day starting a little hobby farm of our own.",
  },
  { key: "hero_cta1_label", label: "Primary button label", type: "text", group: "home", default: "See my work" },
  { key: "hero_cta1_url", label: "Primary button link", type: "text", group: "home", default: "/projects" },
  { key: "hero_cta2_label", label: "Secondary button label", type: "text", group: "home", default: "About me" },
  { key: "hero_cta2_url", label: "Secondary button link", type: "text", group: "home", default: "/about" },
  { key: "hero_card_title", label: "Hero card — line 1", type: "text", group: "home", default: "Engineer by trade." },
  { key: "hero_card_subtitle", label: "Hero card — line 2", type: "text", group: "home", default: "Builder by nature." },
  {
    key: "hero_card_text",
    label: "Hero card — text",
    type: "textarea",
    group: "home",
    rows: 3,
    default:
      "By day I keep the grid running as a power systems engineer. By night I build websites and side projects — and dream up the little hobby farm Jessica and I hope to call home.",
  },
  { key: "home_projects_title", label: "Projects section heading", type: "text", group: "home", default: "Featured projects" },
  { key: "home_websites_title", label: "Websites section heading", type: "text", group: "home", default: "Websites I've built" },
  { key: "home_posts_title", label: "Journal section heading", type: "text", group: "home", default: "Latest writing" },

  // ---- About page ----
  { key: "about_heading", label: "About heading", type: "text", group: "about", default: "A little about Noah" },
  {
    key: "about_body",
    label: "About body (Markdown)",
    type: "textarea",
    group: "about",
    rows: 10,
    help: "Markdown supported — headings, bold, links, lists.",
    default:
      "I'm Noah Roe, a power systems engineer based in Plymouth, Minnesota. My work lives at the intersection of big infrastructure and careful detail — the kind of engineering where reliability isn't optional.\n\nAway from the grid, I love building things on the web and chasing side projects. My wife **Jessica** and I are partners in everything, and together we're working toward a dream we share: a little hobby farm of our own, with room to grow, raise animals, and build a quiet life close to the land.\n\nThis site is my corner of the internet — a place to collect the projects I'm proud of, the websites I've built, and notes from along the way.",
  },
  {
    key: "about_glance",
    label: "“At a glance” rows",
    type: "textarea",
    group: "about",
    rows: 4,
    help: "One per line, as “Label: Value”. Your email is added automatically if set.",
    default: "Role: Power Systems Engineer\nBased in: Plymouth, Minnesota\nDreaming of: A hobby farm with Jessica 🌾",
  },
  {
    key: "skills",
    label: "Skills / tools",
    type: "textarea",
    group: "about",
    rows: 3,
    help: "Comma-separated — shown as tags on the About page.",
    default: "Power Systems Engineering, Grid Reliability, Next.js, TypeScript, React, Web Development",
  },
  { key: "resume_url", label: "Résumé / CV link", type: "url", group: "about", default: "", placeholder: "/uploads/your-cv.pdf or a link", help: "Shows a “Download résumé” button. Paste a link, or upload a file under Photos and use its /uploads/… path." },

  // ---- Navigation & sections ----
  { key: "nav_home_label", label: "Home label", type: "text", group: "nav", default: "Home" },
  { key: "nav_about_label", label: "About label", type: "text", group: "nav", default: "About" },
  { key: "show_about", label: "Show About", type: "toggle", group: "nav", default: "1" },
  { key: "nav_projects_label", label: "Projects label", type: "text", group: "nav", default: "Projects" },
  { key: "show_projects", label: "Show Projects", type: "toggle", group: "nav", default: "1" },
  { key: "nav_websites_label", label: "Websites label", type: "text", group: "nav", default: "Websites" },
  { key: "show_websites", label: "Show Websites", type: "toggle", group: "nav", default: "1" },
  { key: "nav_blog_label", label: "Journal label", type: "text", group: "nav", default: "Journal" },
  { key: "show_blog", label: "Show Journal", type: "toggle", group: "nav", default: "1" },
  { key: "nav_gallery_label", label: "Photos label", type: "text", group: "nav", default: "Photos" },
  { key: "show_gallery", label: "Show Photos", type: "toggle", group: "nav", default: "1" },
  { key: "nav_contact_label", label: "Contact label", type: "text", group: "nav", default: "Contact" },
  { key: "show_contact", label: "Show Contact", type: "toggle", group: "nav", default: "1" },

  // ---- Contact page ----
  { key: "contact_heading", label: "Contact heading", type: "text", group: "contact", default: "Get in touch" },
  {
    key: "contact_intro",
    label: "Contact intro",
    type: "textarea",
    group: "contact",
    rows: 3,
    default: "Have a project in mind, a question, or just want to say hi? Drop me a line and I'll get back to you.",
  },

  // ---- SEO & sharing ----
  { key: "site_url", label: "Site URL", type: "url", group: "seo", default: "", placeholder: "https://noahroe.com", help: "Your public address — used for canonical links, the sitemap, and social previews." },
  {
    key: "seo_description",
    label: "Search / social description",
    type: "textarea",
    group: "seo",
    rows: 3,
    help: "Shown in search results and link previews. Falls back to your bio if blank.",
    default: "",
  },
  { key: "og_image", label: "Social share image", type: "text", group: "seo", default: "", placeholder: "/uploads/share.png", help: "Optional — overrides the auto-generated preview card. Use an uploaded /uploads/… path or a full URL (ideally 1200×630)." },

  // ---- Buy me a coffee ----
  { key: "coffee_url", label: "Coffee link URL", type: "url", group: "coffee", default: "https://buymeacoffee.com/", placeholder: "https://buymeacoffee.com/noahroe" },
  { key: "coffee_label", label: "Button label", type: "text", group: "coffee", default: "Buy me a coffee", placeholder: "Buy me a coffee" },

  // ---- Contact & social ----
  { key: "email", label: "Email", type: "email", group: "social", default: "", placeholder: "you@example.com" },
  { key: "github", label: "GitHub URL", type: "url", group: "social", default: "", placeholder: "https://github.com/you" },
  { key: "linkedin", label: "LinkedIn URL", type: "url", group: "social", default: "", placeholder: "https://linkedin.com/in/you" },
  { key: "twitter", label: "X / Twitter URL", type: "url", group: "social", default: "", placeholder: "https://x.com/you" },

  // ---- Footer ----
  { key: "footer_note", label: "Footer note", type: "text", group: "footer", default: "Built and maintained by Noah Roe." },
];

export const SETTING_KEYS: string[] = SETTINGS_SCHEMA.map((f) => f.key);

export const TOGGLE_KEYS: string[] = SETTINGS_SCHEMA.filter(
  (f) => f.type === "toggle"
).map((f) => f.key);

export const SETTING_DEFAULTS: Record<string, string> = Object.fromEntries(
  SETTINGS_SCHEMA.map((f) => [f.key, f.default])
);

/** A toggle is "on" unless its stored value is empty or "0". */
export function isOn(s: Record<string, string>, key: string): boolean {
  const v = s[key] ?? SETTING_DEFAULTS[key] ?? "";
  return v !== "" && v !== "0";
}

export type NavLink = { href: string; label: string };

/** Visible nav/footer links, honoring per-section labels and show/hide. */
export function navLinks(s: Record<string, string>): NavLink[] {
  const lbl = (k: string) => s[k] || SETTING_DEFAULTS[k] || "";
  const links: NavLink[] = [{ href: "/", label: lbl("nav_home_label") }];
  if (isOn(s, "show_about")) links.push({ href: "/about", label: lbl("nav_about_label") });
  if (isOn(s, "show_projects")) links.push({ href: "/projects", label: lbl("nav_projects_label") });
  if (isOn(s, "show_websites")) links.push({ href: "/websites", label: lbl("nav_websites_label") });
  if (isOn(s, "show_blog")) links.push({ href: "/blog", label: lbl("nav_blog_label") });
  if (isOn(s, "show_gallery")) links.push({ href: "/gallery", label: lbl("nav_gallery_label") });
  if (isOn(s, "show_contact")) links.push({ href: "/contact", label: lbl("nav_contact_label") });
  return links;
}

export type ThemePreset = {
  name: string;
  dark?: boolean;
  theme_accent: string;
  theme_bg: string;
  theme_surface: string;
  theme_text: string;
  theme_heading: string;
  theme_coffee: string;
};

export const THEME_PRESETS: ThemePreset[] = [
  { name: "Earthy", theme_accent: "#436330", theme_bg: "#f7f3ec", theme_surface: "#efe7d8", theme_text: "#3b3228", theme_heading: "#241f18", theme_coffee: "#b5713f" },
  { name: "Slate", theme_accent: "#3b5bdb", theme_bg: "#f5f7fa", theme_surface: "#e9edf3", theme_text: "#2b3340", theme_heading: "#1a2030", theme_coffee: "#e8590c" },
  { name: "Rose", theme_accent: "#c2255c", theme_bg: "#fff5f7", theme_surface: "#ffe3ea", theme_text: "#4a2c35", theme_heading: "#2e171e", theme_coffee: "#e8590c" },
  { name: "Ocean", theme_accent: "#0c8599", theme_bg: "#f0fafb", theme_surface: "#d9f0f3", theme_text: "#234148", theme_heading: "#10282d", theme_coffee: "#e67700" },
  { name: "Midnight", dark: true, theme_accent: "#9775fa", theme_bg: "#1a1b26", theme_surface: "#24263a", theme_text: "#c3c8d8", theme_heading: "#f0f2f8", theme_coffee: "#f0883e" },
];

export type ThemeColorKey =
  | "theme_accent"
  | "theme_bg"
  | "theme_surface"
  | "theme_text"
  | "theme_heading"
  | "theme_coffee";

export const PRESET_COLOR_KEYS: ThemeColorKey[] = [
  "theme_accent",
  "theme_bg",
  "theme_surface",
  "theme_text",
  "theme_heading",
  "theme_coffee",
];
