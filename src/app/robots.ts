import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  const s = getSettings();
  const base = (s.site_url || "http://localhost:3000").replace(/\/$/, "");
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/login"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
