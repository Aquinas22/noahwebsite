import type { Project } from "@/lib/content";

export default function ProjectCard({ p }: { p: Project }) {
  const tags = p.tags.split(",").map((t) => t.trim()).filter(Boolean);
  const inner = (
    <>
      {p.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.image} alt={p.title} className="h-44 w-full object-cover" />
      ) : (
        <div className="flex h-44 w-full items-center justify-center border-b border-bark/10 bg-sand">
          <span className="font-serif text-3xl font-semibold text-bark/30">
            {p.title.slice(0, 2)}
          </span>
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <p className="font-serif text-lg font-semibold text-ink group-hover:text-moss-700">
          {p.title}
        </p>
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-bark/65">
          {p.description}
        </p>
        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-moss-50 px-2.5 py-0.5 text-xs font-medium text-moss-700"
              >
                {t}
              </span>
            ))}
          </div>
        )}
        {p.url && (
          <span className="mt-4 text-sm font-medium text-moss-600">
            View project ↗
          </span>
        )}
      </div>
    </>
  );

  return p.url ? (
    <a
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card group flex flex-col overflow-hidden hover:-translate-y-0.5 hover:shadow-lg"
    >
      {inner}
    </a>
  ) : (
    <div className="card group flex flex-col overflow-hidden">{inner}</div>
  );
}
