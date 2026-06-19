"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/websites", label: "Websites" },
  { href: "/admin/photos", label: "Photos" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/help", label: "Help" },
];

export default function AdminNav({ logout, unread = 0 }: { logout: () => void; unread?: number }) {
  const pathname = usePathname();
  const active = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <nav className="flex flex-col gap-1">
      {ITEMS.map((it) => (
        <Link
          key={it.href}
          href={it.href}
          className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
            active(it.href, it.exact)
              ? "bg-moss-600 font-medium text-cream"
              : "text-bark/70 hover:bg-bark/5"
          }`}
        >
          {it.label}
          {it.href === "/admin/messages" && unread > 0 && (
            <span
              className={`ml-2 inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                active(it.href) ? "bg-cream text-moss-700" : "bg-moss-600 text-cream"
              }`}
            >
              {unread}
            </span>
          )}
        </Link>
      ))}
      <form action={logout} className="mt-4 border-t border-bark/10 pt-4">
        <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-clay-600 hover:bg-clay-500/10">
          Sign out
        </button>
      </form>
      <Link
        href="/"
        className="mt-1 rounded-lg px-3 py-2 text-sm text-bark/50 hover:bg-bark/5"
      >
        ← View site
      </Link>
    </nav>
  );
}
