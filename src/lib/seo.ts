import type { Settings } from "./settings";
import { SETTING_DEFAULTS } from "./settings-schema";

function val(s: Settings, key: string): string {
  return s[key] || SETTING_DEFAULTS[key] || "";
}

/** The description used for search results and link previews. */
export function siteDescription(s: Settings): string {
  return val(s, "seo_description") || val(s, "bio");
}

/** Social-card image URL: the custom override, or our auto-generated card. */
export function ogImageUrl(
  s: Settings,
  parts?: { title?: string; subtitle?: string; eyebrow?: string }
): string {
  const custom = val(s, "og_image");
  if (custom) return custom;
  const q = new URLSearchParams();
  if (parts?.title) q.set("title", parts.title);
  if (parts?.subtitle) q.set("subtitle", parts.subtitle);
  if (parts?.eyebrow) q.set("eyebrow", parts.eyebrow);
  const qs = q.toString();
  return `/og${qs ? `?${qs}` : ""}`;
}

/** schema.org Person + WebSite structured data for the site root. */
export function siteJsonLd(s: Settings): string {
  const url = val(s, "site_url");
  const sameAs = [val(s, "github"), val(s, "linkedin"), val(s, "twitter")].filter(Boolean);
  const person: Record<string, unknown> = {
    "@type": "Person",
    name: val(s, "site_title"),
    jobTitle: val(s, "tagline"),
  };
  if (url) person.url = url;
  if (val(s, "email")) person.email = val(s, "email");
  if (val(s, "location")) person.address = val(s, "location");
  if (sameAs.length) person.sameAs = sameAs;

  const website: Record<string, unknown> = {
    "@type": "WebSite",
    name: val(s, "site_title"),
    description: siteDescription(s),
  };
  if (url) website.url = url;

  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [person, website],
  });
}
