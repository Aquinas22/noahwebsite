import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { ALL_FONT_CLASSNAMES } from "@/lib/fonts";
import { themeCss } from "@/lib/theme";
import { siteDescription, ogImageUrl, siteJsonLd } from "@/lib/seo";
import "./globals.css";

export function generateMetadata(): Metadata {
  const s = getSettings();
  const titleDefault = `${s.site_title} — ${s.tagline}`;
  const description = siteDescription(s);
  const image = ogImageUrl(s, { title: s.site_title, subtitle: s.tagline });
  return {
    metadataBase: s.site_url ? new URL(s.site_url) : undefined,
    title: {
      default: titleDefault,
      template: `%s · ${s.site_title}`,
    },
    description,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: s.site_title,
      title: titleDefault,
      description,
      url: s.site_url || undefined,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: titleDefault,
      description,
      images: [image],
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const s = getSettings();
  return (
    <html lang="en" className={ALL_FONT_CLASSNAMES}>
      <head>
        <style
          id="theme-vars"
          dangerouslySetInnerHTML={{ __html: themeCss(s) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: siteJsonLd(s) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
