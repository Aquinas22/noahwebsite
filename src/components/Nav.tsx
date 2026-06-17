"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { NavLink } from "@/lib/settings-schema";

export default function Nav({
  siteTitle,
  coffeeUrl,
  coffeeLabel,
  links,
}: {
  siteTitle: string;
  coffeeUrl: string;
  coffeeLabel: string;
  links: NavLink[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const LINKS = links;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-bark/10 bg-cream/85 backdrop-blur">
      <nav className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="font-serif text-xl font-semibold text-ink">
          {siteTitle}
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm transition hover:text-moss-600 ${
                isActive(l.href)
                  ? "font-semibold text-moss-700"
                  : "text-bark/70"
              }`}
            >
              {l.label}
            </Link>
          ))}
          {coffeeUrl && (
            <a
              href={coffeeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-coffee"
            >
              ☕ {coffeeLabel || "Buy me a coffee"}
            </a>
          )}
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
          className="rounded-lg p-2 text-bark md:hidden"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-bark/10 bg-cream md:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm ${
                  isActive(l.href)
                    ? "bg-moss-50 font-semibold text-moss-700"
                    : "text-bark/80"
                }`}
              >
                {l.label}
              </Link>
            ))}
            {coffeeUrl && (
              <a
                href={coffeeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-coffee mt-2 w-full"
              >
                ☕ {coffeeLabel || "Buy me a coffee"}
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
