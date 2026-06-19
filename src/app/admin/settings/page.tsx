import { getSettings } from "@/lib/settings";
import { listBackups } from "@/lib/backup";
import PageTitle from "@/components/admin/PageTitle";
import AppearancePanel from "@/components/admin/AppearancePanel";
import SettingsAutosave from "@/components/admin/SettingsAutosave";
import BackupPanel from "@/components/admin/BackupPanel";
import ResumeUploadPanel from "@/components/admin/ResumeUploadPanel";
import HeroPhotoPanel from "@/components/admin/HeroPhotoPanel";
import {
  SETTINGS_SCHEMA,
  SETTING_DEFAULTS,
  GROUPS,
  type SettingField,
} from "@/lib/settings-schema";

const GROUP_ORDER = Object.keys(GROUPS) as (keyof typeof GROUPS)[];

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const s = getSettings();
  const { saved } = await searchParams;
  const val = (key: string) => s[key] ?? SETTING_DEFAULTS[key] ?? "";
  const backups = listBackups();

  const sections = GROUP_ORDER.map((group, i) => {
    const fields = SETTINGS_SCHEMA.filter((f) => f.group === group);
    if (fields.length === 0) return null;
    return (
      <section
        key={group}
        className={`space-y-4 ${i > 0 ? "border-t border-bark/10 pt-6" : ""}`}
      >
        <h2 className="eyebrow">{GROUPS[group]}</h2>
        {group === "appearance" ? (
          <AppearancePanel
            initial={{
              theme_accent: val("theme_accent"),
              theme_bg: val("theme_bg"),
              theme_surface: val("theme_surface"),
              theme_text: val("theme_text"),
              theme_heading: val("theme_heading"),
              theme_coffee: val("theme_coffee"),
              font_heading: val("font_heading"),
              font_body: val("font_body"),
              theme_radius: val("theme_radius"),
              container_width: val("container_width"),
            }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            {fields.map((f) => (
              <Field key={f.key} field={f} value={val(f.key)} />
            ))}
          </div>
        )}
      </section>
    );
  });

  return (
    <div>
      <PageTitle title="Settings" />
      {saved && (
        <p className="mb-5 rounded-lg bg-moss-50 px-4 py-2.5 text-sm text-moss-700">
          Settings saved.
        </p>
      )}

      <SettingsAutosave
        backupPanel={
          <BackupPanel
            backupCount={backups.length}
            latestBackup={backups[0]?.createdAt ?? null}
          />
        }
      >
        {sections}
      </SettingsAutosave>

      <div className="mt-8 space-y-6">
        <HeroPhotoPanel currentUrl={val("hero_photo")} />
        <ResumeUploadPanel currentUrl={val("resume_url")} />
      </div>
    </div>
  );
}

/** Long-form fields get the full width of the two-column grid. */
function isWide(f: SettingField) {
  return f.type === "textarea";
}

function Field({ field: f, value }: { field: SettingField; value: string }) {
  const span = isWide(f) ? "md:col-span-2" : "";

  if (f.type === "toggle") {
    return (
      <label className={`flex items-center gap-2.5 rounded-field border border-bark/10 bg-white/60 px-3.5 py-2.5 text-sm text-bark/80 ${span}`}>
        <input
          type="checkbox"
          name={f.key}
          defaultChecked={value !== "" && value !== "0"}
          className="h-4 w-4 rounded border-bark/30 text-moss-600"
        />
        {f.label}
      </label>
    );
  }
  if (f.type === "textarea") {
    return (
      <div className={span}>
        <label className="label" htmlFor={f.key}>{f.label}</label>
        <textarea id={f.key} name={f.key} rows={f.rows ?? 4} defaultValue={value} className="field" />
        {f.help && <p className="mt-1 text-xs text-bark/55">{f.help}</p>}
      </div>
    );
  }
  if (f.type === "select") {
    return (
      <div className={span}>
        <label className="label" htmlFor={f.key}>{f.label}</label>
        <select id={f.key} name={f.key} defaultValue={value} className="field">
          {f.options?.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {f.help && <p className="mt-1 text-xs text-bark/55">{f.help}</p>}
      </div>
    );
  }
  const inputType = f.type === "email" ? "email" : f.type === "url" ? "url" : "text";
  return (
    <div className={span}>
      <label className="label" htmlFor={f.key}>{f.label}</label>
      <input id={f.key} name={f.key} type={inputType} defaultValue={value} placeholder={f.placeholder} className="field" />
      {f.help && <p className="mt-1 text-xs text-bark/55">{f.help}</p>}
    </div>
  );
}
