"use client";

import { useRef, useState } from "react";
import { autosaveSettings, saveSettings } from "@/app/admin/actions";
import SaveStatus, { type SaveState } from "./SaveStatus";

const PREVIEW_PAGES = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/projects", label: "Projects" },
  { path: "/blog", label: "Journal" },
  { path: "/gallery", label: "Photos" },
];

export default function SettingsAutosave({
  children,
  backupPanel,
}: {
  children: React.ReactNode;
  backupPanel?: React.ReactNode;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [status, setStatus] = useState<SaveState>("idle");
  const [preview, setPreview] = useState("/");
  const [showPreview, setShowPreview] = useState(true);

  function refreshPreview() {
    const f = iframeRef.current;
    if (!f) return;
    try {
      f.contentWindow?.location.reload();
    } catch {
      f.src = preview; // cross-doc fallback
    }
  }

  function onChange() {
    setStatus("saving");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      if (!formRef.current) return;
      await autosaveSettings(new FormData(formRef.current));
      setStatus("saved");
      refreshPreview();
    }, 600);
  }

  return (
    <div
      className={
        showPreview
          ? "grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]"
          : "mx-auto max-w-4xl"
      }
    >
      <div className="space-y-6">
        <form
          ref={formRef}
          action={saveSettings}
          onChange={onChange}
          className="card space-y-8 p-7 sm:p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-bark/10 pb-5">
            <div className="flex items-center gap-3">
              <button type="submit" className="btn-primary">Save now</button>
              <SaveStatus state={status} />
              <span className="text-xs text-bark/45">Changes save automatically.</span>
            </div>
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              className="btn-ghost hidden text-xs xl:inline-flex"
            >
              {showPreview ? "Hide preview" : "Show preview"}
            </button>
          </div>

          {children}

          <div className="flex items-center gap-3 border-t border-bark/10 pt-5">
            <button type="submit" className="btn-primary">Save now</button>
            <SaveStatus state={status} />
          </div>
        </form>

        {backupPanel}
      </div>

      {showPreview && (
        <div className="hidden xl:block">
          <div className="sticky top-6">
            <div className="mb-2 flex items-center justify-between">
              <p className="eyebrow">Live preview</p>
              <select
                value={preview}
                onChange={(e) => setPreview(e.target.value)}
                className="rounded-lg border border-bark/15 bg-white px-2 py-1 text-xs text-bark"
              >
                {PREVIEW_PAGES.map((p) => (
                  <option key={p.path} value={p.path}>{p.label}</option>
                ))}
              </select>
            </div>
            <iframe
              ref={iframeRef}
              src={preview}
              title="Live preview"
              className="h-[80vh] w-full rounded-xl border border-bark/10 bg-white shadow-soft"
            />
          </div>
        </div>
      )}
    </div>
  );
}
