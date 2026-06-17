import Link from "next/link";
import { getPosts } from "@/lib/content";
import { deletePost } from "../actions";
import PageTitle from "@/components/admin/PageTitle";
import DeleteButton from "@/components/admin/DeleteButton";

export default function AdminPostsPage() {
  const posts = getPosts();
  return (
    <div>
      <PageTitle title="Posts" action={{ href: "/admin/posts/new", label: "+ New post" }} />
      {posts.length === 0 ? (
        <div className="card p-10 text-center text-sm text-bark/60">
          No posts yet. Write your first one.
        </div>
      ) : (
        <div className="card divide-y divide-bark/10">
          {posts.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Link href={`/admin/posts/${p.id}`} className="truncate font-medium text-ink hover:text-moss-600">
                    {p.title}
                  </Link>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.published ? "bg-moss-50 text-moss-700" : "bg-bark/10 text-bark/55"}`}>
                    {p.published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-bark/45">/blog/{p.slug}</p>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <Link href={`/admin/posts/${p.id}`} className="text-sm font-medium text-moss-600 hover:text-moss-700">Edit</Link>
                <DeleteButton action={deletePost} id={p.id} confirmText={`Delete "${p.title}"?`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
