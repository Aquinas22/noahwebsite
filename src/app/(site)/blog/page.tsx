import Link from "next/link";
import { getPosts } from "@/lib/content";
import PageHeader from "@/components/PageHeader";

export const metadata = { title: "Journal" };

function fmtDate(s: string) {
  return new Date(s.replace(" ", "T") + "Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPage() {
  const posts = getPosts({ publishedOnly: true });
  return (
    <>
      <PageHeader
        eyebrow="Journal"
        title="Writing & notes"
        intro="Thoughts on engineering, building things, and the road toward our hobby farm."
      />
      <div className="container-page pb-10">
        {posts.length === 0 ? (
          <div className="card flex flex-col items-center gap-2 px-6 py-16 text-center">
            <p className="font-serif text-xl font-semibold text-ink">No posts yet</p>
            <p className="text-sm text-bark/60">Write your first post from the admin dashboard.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <Link
                key={p.id}
                href={`/blog/${p.slug}`}
                className="card group flex flex-col overflow-hidden hover:-translate-y-0.5 hover:shadow-lg"
              >
                {p.cover && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.cover} alt={p.title} className="h-48 w-full object-cover" />
                )}
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs text-bark/50">{fmtDate(p.created_at)}</p>
                  <h2 className="mt-2 font-serif text-xl font-semibold text-ink group-hover:text-moss-700">
                    {p.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm text-bark/65">{p.excerpt}</p>
                  <span className="mt-4 text-sm font-medium text-moss-600">Read more →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
