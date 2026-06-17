import { marked } from "marked";
import { getSettings } from "@/lib/settings";
import { SETTING_DEFAULTS } from "@/lib/settings-schema";
import PageHeader from "@/components/PageHeader";

export const metadata = { title: "About" };

/** Parse the "At a glance" textarea — one "Label: Value" per line. */
function parseGlance(raw: string): { label: string; value: string }[] {
  return raw
    .split("\n")
    .map((line) => {
      const i = line.indexOf(":");
      if (i === -1) return null;
      const label = line.slice(0, i).trim();
      const value = line.slice(i + 1).trim();
      return label && value ? { label, value } : null;
    })
    .filter((r): r is { label: string; value: string } => r !== null);
}

export default function AboutPage() {
  const s = getSettings();
  const heading = s.about_heading || SETTING_DEFAULTS.about_heading;
  const body = marked.parse(s.about_body || SETTING_DEFAULTS.about_body) as string;
  const glance = parseGlance(s.about_glance ?? SETTING_DEFAULTS.about_glance);
  const skills = (s.skills ?? SETTING_DEFAULTS.skills)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <>
      <PageHeader eyebrow="About" title={heading} />
      <div className="container-page grid gap-12 pb-10 lg:grid-cols-12">
        <div
          className="prose space-y-5 text-lg leading-relaxed text-bark/80 lg:col-span-7"
          dangerouslySetInnerHTML={{ __html: body }}
        />

        <aside className="lg:col-span-5">
          <div className="card p-6">
            <p className="eyebrow">At a glance</p>
            <dl className="mt-4 space-y-4 text-sm">
              {glance.map((row) => (
                <div key={row.label}>
                  <dt className="text-bark/50">{row.label}</dt>
                  <dd className="font-medium text-ink">{row.value}</dd>
                </div>
              ))}
              {s.email && (
                <div>
                  <dt className="text-bark/50">Email</dt>
                  <dd>
                    <a href={`mailto:${s.email}`} className="font-medium text-moss-600 hover:text-moss-700">
                      {s.email}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
            {s.resume_url && (
              <a href={s.resume_url} target="_blank" rel="noopener noreferrer" className="btn-ghost mt-6 w-full">
                ↓ Download résumé
              </a>
            )}
          </div>

          {skills.length > 0 && (
            <div className="card mt-6 p-6">
              <p className="eyebrow">Skills &amp; tools</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-bark/10 bg-moss-50 px-3 py-1 text-sm text-moss-700"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
