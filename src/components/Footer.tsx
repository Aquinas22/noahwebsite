import Link from "next/link";
import type { Settings } from "@/lib/settings";
import { navLinks } from "@/lib/settings-schema";

function Social({ href, label }: { href: string; label: string }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-bark/60 transition hover:text-moss-600"
    >
      {label}
    </a>
  );
}

export default function Footer({ settings: s }: { settings: Settings }) {
  return (
    <footer className="mt-24 border-t border-bark/10 bg-sand/60">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-2">
          <p className="font-serif text-2xl font-semibold text-ink">
            {s.site_title}
          </p>
          <p className="mt-3 max-w-md text-sm text-bark/70">{s.tagline}</p>
          {s.location && (
            <p className="mt-2 text-sm text-bark/60">📍 {s.location}</p>
          )}
        </div>

        <div>
          <p className="eyebrow mb-3">Explore</p>
          <ul className="space-y-2 text-sm text-bark/70">
            {navLinks(s)
              .filter((l) => l.href !== "/")
              .map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-moss-600">{l.label}</Link>
                </li>
              ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-3">Connect</p>
          <ul className="space-y-2 text-sm">
            {s.email && (
              <li>
                <a href={`mailto:${s.email}`} className="text-bark/70 hover:text-moss-600">
                  {s.email}
                </a>
              </li>
            )}
            <li><Social href={s.github} label="GitHub" /></li>
            <li><Social href={s.linkedin} label="LinkedIn" /></li>
            <li><Social href={s.twitter} label="X / Twitter" /></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-bark/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-bark/50 sm:flex-row">
          <p>© {new Date().getFullYear()} {s.site_title}. {s.footer_note}</p>
          <Link href="/admin" className="hover:text-moss-600">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
