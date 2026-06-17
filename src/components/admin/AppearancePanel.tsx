"use client";

import { useState } from "react";
import {
  THEME_PRESETS,
  PRESET_COLOR_KEYS,
  type ThemePreset,
  type ThemeColorKey,
} from "@/lib/settings-schema";

type Colors = Record<ThemeColorKey, string>;

const COLOR_FIELDS: { key: keyof Colors; label: string; help?: string }[] = [
  { key: "theme_accent", label: "Accent", help: "Buttons, links & highlights — a full shade scale is generated from this." },
  { key: "theme_bg", label: "Background" },
  { key: "theme_surface", label: "Surface / cards" },
  { key: "theme_text", label: "Body text" },
  { key: "theme_heading", label: "Headings" },
  { key: "theme_coffee", label: "Coffee button" },
];

export default function AppearancePanel({
  initial,
}: {
  initial: Colors & {
    font_heading: string;
    font_body: string;
    theme_radius: string;
    container_width: string;
  };
}) {
  const [colors, setColors] = useState<Colors>({
    theme_accent: initial.theme_accent,
    theme_bg: initial.theme_bg,
    theme_surface: initial.theme_surface,
    theme_text: initial.theme_text,
    theme_heading: initial.theme_heading,
    theme_coffee: initial.theme_coffee,
  });

  function applyPreset(p: ThemePreset) {
    setColors({
      theme_accent: p.theme_accent,
      theme_bg: p.theme_bg,
      theme_surface: p.theme_surface,
      theme_text: p.theme_text,
      theme_heading: p.theme_heading,
      theme_coffee: p.theme_coffee,
    });
  }

  function setColor(key: keyof Colors, value: string) {
    setColors((c) => ({ ...c, [key]: value }));
  }

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div>
        <p className="label">Presets</p>
        <div className="flex flex-wrap gap-2">
          {THEME_PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => applyPreset(p)}
              className="flex items-center gap-2 rounded-full border border-bark/15 bg-white px-3 py-1.5 text-sm text-bark transition hover:border-moss-400 hover:bg-moss-50"
            >
              <span className="flex">
                {PRESET_COLOR_KEYS.slice(0, 4).map((k) => (
                  <span
                    key={k}
                    className="h-4 w-4 rounded-full border border-black/5 -ml-1 first:ml-0"
                    style={{ background: p[k] as string }}
                  />
                ))}
              </span>
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="grid gap-4 sm:grid-cols-2">
        {COLOR_FIELDS.map((f) => (
          <div key={f.key}>
            <label className="label" htmlFor={f.key}>{f.label}</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                aria-label={`${f.label} color`}
                value={colors[f.key]}
                onChange={(e) => setColor(f.key, e.target.value)}
                className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-bark/15 bg-white p-1"
              />
              <input
                id={f.key}
                name={f.key}
                value={colors[f.key]}
                onChange={(e) => setColor(f.key, e.target.value)}
                className="field font-mono"
              />
            </div>
            {f.help && <p className="mt-1 text-xs text-bark/55">{f.help}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
