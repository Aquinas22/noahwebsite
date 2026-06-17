import { getWebsites } from "@/lib/content";
import PageHeader from "@/components/PageHeader";

export const metadata = { title: "Websites" };

export default function WebsitesPage() {
  const websites = getWebsites();
  return (
    <>
      <PageHeader
        eyebrow="On the web"
        title="Websites"
        intro="Live sites I've built and helped bring to life. Click through to take a look."
      />
      <div className="container-page pb-10">
        {websites.length === 0 ? (
          <div className="card flex flex-col items-center gap-2 px-6 py-16 text-center">
            <p className="font-serif text-xl font-semibold text-ink">No websites yet</p>
            <p className="text-sm text-bark/60">Add your first one from the admin dashboard.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {websites.map((w) => (
              <a
                key={w.id}
                href={w.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="card group flex overflow-hidden hover:-translate-y-0.5 hover:shadow-lg"
              >
                {w.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={w.image} alt={w.title} className="hidden h-auto w-40 shrink-0 object-cover sm:block" />
                ) : (
                  <div className="hidden w-40 shrink-0 bg-gradient-to-br from-moss-300 to-moss-500 sm:block" />
                )}
                <div className="flex flex-1 flex-col p-6">
                  <p className="font-serif text-xl font-semibold text-ink group-hover:text-moss-700">
                    {w.title}
                  </p>
                  {w.url && (
                    <p className="mt-1 break-all text-xs text-bark/45">
                      {w.url.replace(/^https?:\/\//, "")}
                    </p>
                  )}
                  <p className="mt-3 flex-1 text-sm text-bark/65">{w.description}</p>
                  <span className="mt-4 text-sm font-medium text-moss-600">Visit site ↗</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
