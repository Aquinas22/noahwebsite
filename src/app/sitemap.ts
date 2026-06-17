import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/settings";
import { navLinks } from "@/lib/settings-schema";
import { getPosts } from "@/lib/content";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const s = getSettings();
  const base = (s.site_url || "http://localhost:3000").replace(/\/$/, "");

  // Visible top-level pages (honors per-section show/hide toggles).
  const pages = navLinks(s).map((l) => ({
    url: `${base}${l.href === "/" ? "" : l.href}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: l.href === "/" ? 1 : 0.7,
  }));

  const posts = getPosts({ publishedOnly: true }).map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.updated_at.replace(" ", "T") + "Z"),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...pages, ...posts];
}
