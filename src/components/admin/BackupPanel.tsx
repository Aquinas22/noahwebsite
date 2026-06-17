"use client";

import { useRef, useState } from "react";
import { exportSettings, importSettings } from "@/app/admin/actions";

type Props = {
  backupCount: number;
  latestBackup: string | null;
};

export default function BackupPanel({ backupCount, latestBackup }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<"export" | "import" | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function onExport() {
    setBusy("export");
    setMsg(null);
    try {
      const json = await exportSettings();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const date = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `noahsite-settings-${date}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setMsg({ ok: true, text: "Settings downloaded." });
    } catch {
      setMsg({ ok: false, text: "Couldn't export settings." });
    } finally {
      setBusy(null);
    }
  }

  async function onImportFile(file: File) {
    setBusy("import");
    setMsg(null);
    try {
      const text = await file.text();
      const res = await importSettings(text);
      if (res.ok) {
        setMsg({ ok: true, text: `Restored ${res.applied} settings. Reloading…` });
        setTimeout(() => window.location.reload(), 800);
      } else {
        setMsg({ ok: false, text: res.error ?? "Import failed." });
      }
    } catch {
      setMsg({ ok: false, text: "Couldn't read that file." });
    } finally {
      setBusy(null);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <section className="card space-y-4 p-6">
      <div>
        <h2 className="eyebrow">Backup &amp; restore</h2>
        <p className="mt-1 text-sm text-bark/60">
          Your site automatically saves a full snapshot of its database when you
          make changes, so nothing is ever lost for good. You can also keep your
          own copy of your settings here.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onExport}
          disabled={busy !== null}
          className="btn-ghost"
        >
          {busy === "export" ? "Preparing…" : "Download settings"}
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy !== null}
          className="btn-ghost"
        >
          {busy === "import" ? "Restoring…" : "Restore from file"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onImportFile(f);
          }}
        />
      </div>

      {msg && (
        <p
          className={`text-sm ${
            msg.ok ? "text-moss-700" : "text-clay-600"
          }`}
        >
          {msg.text}
        </p>
      )}

      <p className="text-xs text-bark/45">
        {backupCount > 0
          ? `${backupCount} automatic snapshot${backupCount === 1 ? "" : "s"} kept` +
            (latestBackup
              ? ` · latest ${new Date(latestBackup).toLocaleString()}`
              : "") +
            " (in data/backups)."
          : "Automatic snapshots will appear here once you make changes."}
      </p>
    </section>
  );
}
