import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { isOn } from "@/lib/settings-schema";
import { getProjects, getPosts, getWebsites, getPhotos } from "@/lib/content";
import ProjectCard from "@/components/ProjectCard";
import PhotoGrid from "@/components/PhotoGrid";

function Cta({ href, label, className }: { href: string; label: string; className: string }) {
  if (!label) return null;
  return href.startsWith("/") ? (
    <Link href={href} className={className}>{label}</Link>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{label}</a>
  );
}

function fmtDate(s: string) {
  return new Date(s.replace(" ", "T") + "Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Home() {
  const s = getSettings();
  const projects = getProjects();
  const featured = (projects.filter((p) => p.featured).length
    ? projects.filter((p) => p.featured)
    : projects
  ).slice(0, 3);
  const posts = getPosts({ publishedOnly: true }).slice(0, 3);
  const websites = getWebsites().slice(0, 3);
  const photos = getPhotos();
  const heroPhotos = photos.slice(0, 4);
  const homePhotos = photos.slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-bark/10">
        <div className="container-page grid gap-12 py-20 sm:py-28 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <p className="eyebrow">{s.tagline}{s.location ? ` · ${s.location}` : ""}</p>
            <h1 className="mt-5 font-serif text-5xl font-semibold leading-[1.04] tracking-tight text-ink sm:text-6xl">
              {s.hero_heading}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-bark/75">
              {s.hero_intro}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Cta href={s.hero_cta1_url} label={s.hero_cta1_label} className="btn-primary" />
              <Cta href={s.hero_cta2_url} label={s.hero_cta2_label} className="btn-ghost" />
            </div>
          </div>
          <div className="flex flex-col gap-4 lg:col-span-5">
            {isOn(s, "show_hero_photos") && heroPhotos.length > 0 && (
              <PhotoGrid photos={heroPhotos} layout="hero" />
            )}
            <div
              className="bg-ink p-8 text-cream shadow-soft"
              style={{ borderRadius: "var(--radius-card)" }}
            >
              <p className="font-serif text-2xl font-semibold">{s.hero_card_title}</p>
              <p className="mt-1 font-serif text-2xl font-semibold text-cream/75">{s.hero_card_subtitle}</p>
              <p className="mt-5 text-sm leading-relaxed text-cream/70">
                {s.hero_card_text}
              </p>
              <dl className="mt-7 grid grid-cols-3 gap-4 border-t border-cream/15 pt-6">
                {[
                  { n: projects.length, l: "Projects" },
                  { n: websites.length, l: "Websites" },
                  { n: posts.length, l: "Posts" },
                ].map((stat) => (
                  <div key={stat.l}>
                    <dt className="font-serif text-3xl font-semibold leading-none">{stat.n}</dt>
                    <dd className="mt-1.5 text-xs uppercase tracking-wider text-cream/50">{stat.l}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Featured projects */}
      {isOn(s, "show_projects") && featured.length > 0 && (
        <section className="container-page py-16 sm:py-20">
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">Selected work</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">
                {s.home_projects_title}
              </h2>
            </div>
            <Link href="/projects" className="hidden text-sm font-medium text-moss-600 hover:text-moss-700 sm:block">
              View all →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProjectCard key={p.id} p={p} />
            ))}
          </div>
        </section>
      )}

      {/* Websites */}
      {isOn(s, "show_websites") && websites.length > 0 && (
        <section className="container-page py-16 sm:py-20">
          <p className="eyebrow">Live on the web</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">
            {s.home_websites_title}
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {websites.map((w) => (
              <a
                key={w.id}
                href={w.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="card group flex flex-col overflow-hidden hover:-translate-y-0.5 hover:shadow-lg"
              >
                {w.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={w.image} alt={w.title} className="h-40 w-full object-cover" />
                )}
                <div className="flex flex-col p-5">
                  <p className="font-serif text-lg font-semibold text-ink group-hover:text-moss-700">
                    {w.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-bark/65">{w.description}</p>
                  <span className="mt-4 text-sm font-medium text-moss-600">Visit ↗</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Latest journal */}
      {isOn(s, "show_blog") && posts.length > 0 && (
        <section className="container-page py-16 sm:py-20">
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">From the journal</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">
                {s.home_posts_title}
              </h2>
            </div>
            <Link href="/blog" className="hidden text-sm font-medium text-moss-600 hover:text-moss-700 sm:block">
              All posts →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {posts.map((p) => (
              <Link key={p.id} href={`/blog/${p.slug}`} className="card group flex flex-col overflow-hidden hover:-translate-y-0.5 hover:shadow-lg">
                {p.cover && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.cover} alt={p.title} className="h-40 w-full object-cover" />
                )}
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs text-bark/50">{fmtDate(p.created_at)}</p>
                  <p className="mt-2 font-serif text-lg font-semibold text-ink group-hover:text-moss-700">
                    {p.title}
                  </p>
                  <p className="mt-2 line-clamp-3 text-sm text-bark/65">{p.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Photos */}
      {isOn(s, "show_home_photos") && homePhotos.length > 0 && (
        <section className="container-page py-16 sm:py-20">
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">Captured moments</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">
                {s.home_photos_title}
              </h2>
            </div>
            <Link href="/gallery" className="hidden text-sm font-medium text-moss-600 hover:text-moss-700 sm:block">
              See all →
            </Link>
          </div>
          <div className="mt-8">
            <PhotoGrid photos={homePhotos} layout="grid" />
          </div>
        </section>
      )}

    </>
  );
}
