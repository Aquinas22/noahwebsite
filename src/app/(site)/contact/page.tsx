import { getSettings } from "@/lib/settings";
import { SETTING_DEFAULTS } from "@/lib/settings-schema";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";

export const metadata = { title: "Contact" };

function Social({ href, label }: { href: string; label: string }) {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-moss-600 hover:text-moss-700">
      {label}
    </a>
  );
}

export default function ContactPage() {
  const s = getSettings();
  const heading = s.contact_heading || SETTING_DEFAULTS.contact_heading;
  const intro = s.contact_intro || SETTING_DEFAULTS.contact_intro;

  return (
    <>
      <PageHeader eyebrow="Contact" title={heading} intro={intro} />
      <div className="container-page grid gap-10 pb-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ContactForm />
        </div>

        <aside className="lg:col-span-5">
          <div className="card p-6">
            <p className="eyebrow">Other ways to reach me</p>
            <ul className="mt-4 space-y-3 text-sm">
              {s.email && (
                <li>
                  <span className="text-bark/50">Email</span>
                  <br />
                  <a href={`mailto:${s.email}`} className="font-medium text-moss-600 hover:text-moss-700">
                    {s.email}
                  </a>
                </li>
              )}
              {(s.github || s.linkedin || s.twitter) && (
                <li className="flex flex-wrap gap-4 pt-1">
                  <Social href={s.github} label="GitHub" />
                  <Social href={s.linkedin} label="LinkedIn" />
                  <Social href={s.twitter} label="X / Twitter" />
                </li>
              )}
              {s.location && (
                <li className="pt-1 text-bark/60">📍 {s.location}</li>
              )}
            </ul>
            {s.resume_url && (
              <a href={s.resume_url} target="_blank" rel="noopener noreferrer" className="btn-ghost mt-6 w-full">
                ↓ Download résumé
              </a>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
