import Link from "next/link";
import { getWebsites } from "@/lib/content";
import { deleteWebsite } from "../actions";
import PageTitle from "@/components/admin/PageTitle";
import DeleteButton from "@/components/admin/DeleteButton";

export default function AdminWebsitesPage() {
  const websites = getWebsites();
  return (
    <div>
      <PageTitle title="Websites" action={{ href: "/admin/websites/new", label: "+ New website" }} />
      {websites.length === 0 ? (
        <div className="card p-10 text-center text-sm text-bark/60">No websites yet.</div>
      ) : (
        <div className="card divide-y divide-bark/10">
          {websites.map((w) => (
            <div key={w.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <Link href={`/admin/websites/${w.id}`} className="truncate font-medium text-ink hover:text-moss-600">{w.title}</Link>
                <p className="mt-0.5 truncate text-xs text-bark/45">{w.url}</p>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <Link href={`/admin/websites/${w.id}`} className="text-sm font-medium text-moss-600 hover:text-moss-700">Edit</Link>
                <DeleteButton action={deleteWebsite} id={w.id} confirmText={`Delete "${w.title}"?`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
