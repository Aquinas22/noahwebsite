import Link from "next/link";
import { getProjects } from "@/lib/content";
import { deleteProject } from "../actions";
import PageTitle from "@/components/admin/PageTitle";
import DeleteButton from "@/components/admin/DeleteButton";

export default function AdminProjectsPage() {
  const projects = getProjects();
  return (
    <div>
      <PageTitle title="Projects" action={{ href: "/admin/projects/new", label: "+ New project" }} />
      {projects.length === 0 ? (
        <div className="card p-10 text-center text-sm text-bark/60">No projects yet.</div>
      ) : (
        <div className="card divide-y divide-bark/10">
          {projects.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-4 p-4">
              <div className="flex min-w-0 items-center gap-3">
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                ) : (
                  <div className="h-12 w-12 shrink-0 rounded-lg bg-gradient-to-br from-moss-200 to-moss-400" />
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/projects/${p.id}`} className="truncate font-medium text-ink hover:text-moss-600">{p.title}</Link>
                    {!!p.featured && <span className="rounded-full bg-clay-500/15 px-2 py-0.5 text-xs font-medium text-clay-600">Featured</span>}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-bark/45">{p.tags || "—"}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <Link href={`/admin/projects/${p.id}`} className="text-sm font-medium text-moss-600 hover:text-moss-700">Edit</Link>
                <DeleteButton action={deleteProject} id={p.id} confirmText={`Delete "${p.title}"?`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
