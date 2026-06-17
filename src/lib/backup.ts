import path from "node:path";
import fs from "node:fs";
import { getDb } from "./db";
import { getSettings, setSetting } from "./settings";
import { SETTING_KEYS } from "./settings-schema";

// Safety net against losing CMS data. Two layers:
//   1. Timestamped, consistent snapshots of the whole SQLite database in
//      data/backups/ (survives accidental edits/deletes — restore by hand).
//   2. Settings export/import as JSON, so the bits you hand-tune are easy to
//      download, keep off-machine, and paste back in.
// Both are best-effort: a failure here must never block a save.

const DATA_DIR = path.join(process.cwd(), "data");
const BACKUP_DIR = path.join(DATA_DIR, "backups");
const KEEP = 30;
const MIN_INTERVAL_MS = 5 * 60 * 1000; // throttle automatic snapshots

export type BackupInfo = { name: string; size: number; createdAt: string };

/**
 * Write a consistent snapshot of the database to data/backups/. Uses SQLite's
 * `VACUUM INTO`, which produces a clean copy even with WAL writes in flight.
 * Throttled to one snapshot per MIN_INTERVAL_MS unless `force` is set, and
 * old snapshots beyond KEEP are pruned. Returns the file path, or null on skip.
 */
export function snapshotDb(reason = "auto", force = false): string | null {
  try {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });

    if (!force) {
      const newest = latestBackupTime();
      if (newest && Date.now() - newest < MIN_INTERVAL_MS) return null;
    }

    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const safeReason = reason.replace(/[^a-z0-9-]/gi, "");
    const file = path.join(BACKUP_DIR, `app-${stamp}-${safeReason}.db`);
    getDb().exec(`VACUUM INTO '${file.replace(/'/g, "''")}'`);
    prune();
    return file;
  } catch (err) {
    console.error("snapshotDb failed:", err);
    return null;
  }
}

function latestBackupTime(): number | null {
  const files = readBackupFiles();
  return files.length ? files[0].t : null;
}

function readBackupFiles(): { name: string; t: number; size: number }[] {
  if (!fs.existsSync(BACKUP_DIR)) return [];
  return fs
    .readdirSync(BACKUP_DIR)
    .filter((f) => f.endsWith(".db"))
    .map((name) => {
      const st = fs.statSync(path.join(BACKUP_DIR, name));
      return { name, t: st.mtimeMs, size: st.size };
    })
    .sort((a, b) => b.t - a.t);
}

function prune() {
  const files = readBackupFiles();
  for (const { name } of files.slice(KEEP)) {
    fs.rmSync(path.join(BACKUP_DIR, name), { force: true });
  }
}

export function listBackups(): BackupInfo[] {
  return readBackupFiles().map((f) => ({
    name: f.name,
    size: f.size,
    createdAt: new Date(f.t).toISOString(),
  }));
}

// ---- Settings export / import (JSON) ----

const EXPORT_VERSION = 1;
const KNOWN_KEYS = new Set(SETTING_KEYS);

/** Serialize every stored setting to a JSON string for download. */
export function exportSettingsJson(): string {
  return JSON.stringify(
    {
      type: "noahwebsite-settings",
      version: EXPORT_VERSION,
      exportedAt: new Date().toISOString(),
      settings: getSettings(),
    },
    null,
    2
  );
}

export type ImportResult = { ok: boolean; applied: number; error?: string };

/**
 * Restore settings from an exported JSON string. Only keys known to the
 * current schema are applied, so an old or hand-edited file can't inject
 * junk. Snapshots the DB first so the pre-import state is recoverable.
 */
export function importSettingsJson(raw: string): ImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, applied: 0, error: "That file isn't valid JSON." };
  }

  const settings = extractSettings(parsed);
  if (!settings) {
    return { ok: false, applied: 0, error: "No settings found in that file." };
  }

  snapshotDb("pre-import", true);

  let applied = 0;
  for (const [key, value] of Object.entries(settings)) {
    if (KNOWN_KEYS.has(key) && typeof value === "string") {
      setSetting(key, value);
      applied++;
    }
  }
  return { ok: true, applied };
}

function extractSettings(parsed: unknown): Record<string, unknown> | null {
  if (!parsed || typeof parsed !== "object") return null;
  const obj = parsed as Record<string, unknown>;
  // Accept either { settings: {...} } (our export) or a bare { key: value } map.
  if (obj.settings && typeof obj.settings === "object") {
    return obj.settings as Record<string, unknown>;
  }
  return obj;
}
