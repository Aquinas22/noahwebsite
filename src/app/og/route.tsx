import { ImageResponse } from "next/og";
import { getSettings } from "@/lib/settings";
import { SETTING_DEFAULTS } from "@/lib/settings-schema";

// Auto-generated, theme-branded social preview card (1200×630).
// Referenced from metadata as /og?title=…&subtitle=… and can be overridden
// per-site with the `og_image` setting.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const s = getSettings();

  const get = (k: string) => s[k] || SETTING_DEFAULTS[k] || "";
  const bg = get("theme_bg");
  const surface = get("theme_surface");
  const accent = get("theme_accent");
  const heading = get("theme_heading");
  const text = get("theme_text");

  const siteTitle = get("site_title");
  const title = searchParams.get("title") || siteTitle;
  const subtitle = searchParams.get("subtitle") || get("tagline");
  const eyebrow = searchParams.get("eyebrow") || siteTitle;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: bg,
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 28, height: 28, borderRadius: 9999, background: accent }} />
          <div style={{ fontSize: 30, fontWeight: 600, color: text, letterSpacing: 1 }}>
            {eyebrow}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 700, color: heading, lineHeight: 1.05 }}>
            {title}
          </div>
          {subtitle && (
            <div style={{ marginTop: 24, fontSize: 36, color: text, opacity: 0.8 }}>
              {subtitle}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 26,
            color: text,
            opacity: 0.6,
          }}
        >
          <div style={{ width: 60, height: 6, borderRadius: 9999, background: accent }} />
          {(get("site_url") || "").replace(/^https?:\/\//, "") || siteTitle}
        </div>

        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 360,
            height: 360,
            background: surface,
            opacity: 0.6,
            borderRadius: 9999,
            transform: "translate(140px, -140px)",
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
