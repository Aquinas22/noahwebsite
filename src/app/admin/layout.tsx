import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import AdminNav from "@/components/AdminNav";
import { logout } from "./actions";
import { getUnreadMessageCount } from "@/lib/content";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();
  const unread = getUnreadMessageCount();
  return (
    <div className="min-h-screen bg-sand/40">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-8 lg:flex-row lg:px-8">
        <aside className="lg:w-60 lg:shrink-0">
          <Link href="/admin" className="font-serif text-xl font-semibold text-ink">
            Noah Roe <span className="text-bark/40">CMS</span>
          </Link>
          <div className="mt-6">
            <AdminNav logout={logout} unread={unread} />
          </div>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
