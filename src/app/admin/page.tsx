import Link from "next/link";
import { getPosts, getProjects, getWebsites, getPhotos } from "@/lib/content";

export default function AdminDashboard() {
  const posts = getPosts();
  const projects = getProjects();
  const websites = getWebsites();
  const photos = getPhotos();
  const published = posts.filter((p) => p.published).length;

  const stats = [
    { label: "Posts", value: posts.length, sub: `${published} published`, href: "/admin/posts" },
    { label: "Projects", value: projects.length, sub: `${projects.filter((p) => p.featured).length} featured`, href: "/admin/projects" },
    { label: "Websites", value: websites.length, sub: "linked", href: "/admin/websites" },
    { label: "Photos", value: photos.length, sub: "in gallery", href: "/admin/photos" },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold text-ink">Welcome back, Noah 👋</h1>
      <p className="mt-1 text-bark/60">Manage everything that appears on your site from here.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card p-5 hover:-translate-y-0.5 hover:shadow-lg">
            <p className="text-sm text-bark/55">{s.label}</p>
            <p className="mt-2 font-serif text-4xl font-semibold text-ink">{s.value}</p>
            <p className="mt-1 text-xs text-bark/45">{s.sub}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="eyebrow">Quick actions</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link href="/admin/posts/new" className="btn-primary">+ New post</Link>
          <Link href="/admin/projects/new" className="btn-ghost">+ New project</Link>
          <Link href="/admin/websites/new" className="btn-ghost">+ New website</Link>
          <Link href="/admin/photos" className="btn-ghost">+ Upload photos</Link>
        </div>
      </div>
    </div>
  );
}
