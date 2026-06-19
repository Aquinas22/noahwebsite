"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { requireAuth, destroySession } from "@/lib/auth";
import { saveImage, deleteImage } from "@/lib/upload";
import { setSetting } from "@/lib/settings";
import { snapshotDb, exportSettingsJson, importSettingsJson, type ImportResult } from "@/lib/backup";
import { SETTING_KEYS, TOGGLE_KEYS } from "@/lib/settings-schema";

const TOGGLE_SET = new Set(TOGGLE_KEYS);

/** Persists every known setting from the form. Toggles save "1"/"" by
 * presence; other fields only overwrite when present (so a partial form
 * never wipes untouched values). */
function persistSettings(formData: FormData) {
  for (const key of SETTING_KEYS) {
    if (TOGGLE_SET.has(key)) {
      setSetting(key, formData.get(key) ? "1" : "");
    } else if (formData.has(key)) {
      setSetting(key, str(formData, key));
    }
  }
}
import { makeSlug, getPostById, getProjectById, getWebsiteById, getPhotoById } from "@/lib/content";

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}

function revalidateAll() {
  revalidatePath("/", "layout");
}

// ---------------- Auth ----------------
export async function logout() {
  await destroySession();
  redirect("/login");
}

// ---------------- Posts ----------------
export async function savePost(formData: FormData) {
  await requireAuth();
  snapshotDb("content");
  const id = Number(formData.get("id")) || 0;
  const title = str(formData, "title") || "Untitled";
  const excerpt = str(formData, "excerpt");
  const body = str(formData, "body");
  const published = formData.get("published") ? 1 : 0;
  const existingCover = str(formData, "existing_cover");
  const uploaded = await saveImage(formData.get("cover") as File | null);
  const cover = uploaded || existingCover;

  const db = getDb();
  if (id) {
    const slug = makeSlug(title, id);
    db.prepare(
      `UPDATE posts SET title=?, slug=?, excerpt=?, body=?, cover=?, published=?, updated_at=datetime('now') WHERE id=?`
    ).run(title, slug, excerpt, body, cover, published, id);
  } else {
    const slug = makeSlug(title);
    db.prepare(
      `INSERT INTO posts (title, slug, excerpt, body, cover, published) VALUES (?,?,?,?,?,?)`
    ).run(title, slug, excerpt, body, cover, published);
  }
  revalidateAll();
  redirect("/admin/posts");
}

export async function deletePost(formData: FormData) {
  await requireAuth();
  snapshotDb("pre-delete", true);
  const id = Number(formData.get("id"));
  const post = getPostById(id);
  if (post?.cover) await deleteImage(post.cover);
  getDb().prepare("DELETE FROM posts WHERE id=?").run(id);
  revalidateAll();
  redirect("/admin/posts");
}

// ---------------- Projects ----------------
export async function saveProject(formData: FormData) {
  await requireAuth();
  snapshotDb("content");
  const id = Number(formData.get("id")) || 0;
  const title = str(formData, "title") || "Untitled";
  const description = str(formData, "description");
  const url = str(formData, "url");
  const tags = str(formData, "tags");
  const featured = formData.get("featured") ? 1 : 0;
  const sort = Number(formData.get("sort")) || 0;
  const existingImage = str(formData, "existing_image");
  const uploaded = await saveImage(formData.get("image") as File | null);
  const image = uploaded || existingImage;

  const db = getDb();
  if (id) {
    db.prepare(
      `UPDATE projects SET title=?, description=?, url=?, image=?, tags=?, featured=?, sort=? WHERE id=?`
    ).run(title, description, url, image, tags, featured, sort, id);
  } else {
    db.prepare(
      `INSERT INTO projects (title, description, url, image, tags, featured, sort) VALUES (?,?,?,?,?,?,?)`
    ).run(title, description, url, image, tags, featured, sort);
  }
  revalidateAll();
  redirect("/admin/projects");
}

export async function deleteProject(formData: FormData) {
  await requireAuth();
  snapshotDb("pre-delete", true);
  const id = Number(formData.get("id"));
  const p = getProjectById(id);
  if (p?.image) await deleteImage(p.image);
  getDb().prepare("DELETE FROM projects WHERE id=?").run(id);
  revalidateAll();
  redirect("/admin/projects");
}

// ---------------- Websites ----------------
export async function saveWebsite(formData: FormData) {
  await requireAuth();
  snapshotDb("content");
  const id = Number(formData.get("id")) || 0;
  const title = str(formData, "title") || "Untitled";
  const url = str(formData, "url");
  const description = str(formData, "description");
  const sort = Number(formData.get("sort")) || 0;
  const existingImage = str(formData, "existing_image");
  const uploaded = await saveImage(formData.get("image") as File | null);
  const image = uploaded || existingImage;

  const db = getDb();
  if (id) {
    db.prepare(
      `UPDATE websites SET title=?, url=?, description=?, image=?, sort=? WHERE id=?`
    ).run(title, url, description, image, sort, id);
  } else {
    db.prepare(
      `INSERT INTO websites (title, url, description, image, sort) VALUES (?,?,?,?,?)`
    ).run(title, url, description, image, sort);
  }
  revalidateAll();
  redirect("/admin/websites");
}

export async function deleteWebsite(formData: FormData) {
  await requireAuth();
  snapshotDb("pre-delete", true);
  const id = Number(formData.get("id"));
  const w = getWebsiteById(id);
  if (w?.image) await deleteImage(w.image);
  getDb().prepare("DELETE FROM websites WHERE id=?").run(id);
  revalidateAll();
  redirect("/admin/websites");
}

// ---------------- Photos ----------------
export async function addPhotos(formData: FormData) {
  await requireAuth();
  const caption = str(formData, "caption");
  const files = formData.getAll("photos") as File[];
  const db = getDb();
  const stmt = db.prepare("INSERT INTO photos (src, caption) VALUES (?, ?)");
  for (const file of files) {
    const src = await saveImage(file);
    if (src) stmt.run(src, caption);
  }
  revalidateAll();
  redirect("/admin/photos");
}

export async function updatePhotoCaption(formData: FormData) {
  await requireAuth();
  const id = Number(formData.get("id"));
  const caption = str(formData, "caption");
  getDb().prepare("UPDATE photos SET caption=? WHERE id=?").run(caption, id);
  revalidateAll();
  redirect("/admin/photos");
}

export async function deletePhoto(formData: FormData) {
  await requireAuth();
  snapshotDb("pre-delete", true);
  const id = Number(formData.get("id"));
  const ph = getPhotoById(id);
  if (ph?.src) await deleteImage(ph.src);
  getDb().prepare("DELETE FROM photos WHERE id=?").run(id);
  revalidateAll();
  redirect("/admin/photos");
}

// ---------------- Contact messages ----------------
export type ContactState = { ok: boolean; error?: string };

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Public contact form submission. No auth; validated + honeypot-protected. */
export async function submitMessage(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  // Honeypot: real users leave this hidden field empty. Pretend success.
  if (str(formData, "company")) return { ok: true };

  const name = str(formData, "name");
  const email = str(formData, "email");
  const subject = str(formData, "subject");
  const body = str(formData, "message");

  if (!name || !email || !body) {
    return { ok: false, error: "Please add your name, email, and a message." };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "That email address doesn't look right." };
  }
  if (body.length > 5000) {
    return { ok: false, error: "That message is a bit long — please trim it." };
  }

  getDb()
    .prepare("INSERT INTO messages (name, email, subject, body) VALUES (?,?,?,?)")
    .run(name, email, subject, body);
  return { ok: true };
}

export async function markMessageRead(formData: FormData) {
  await requireAuth();
  const id = Number(formData.get("id"));
  const read = formData.get("read") ? 1 : 0;
  getDb().prepare("UPDATE messages SET read=? WHERE id=?").run(read, id);
  revalidatePath("/admin/messages");
  redirect("/admin/messages");
}

export async function deleteMessage(formData: FormData) {
  await requireAuth();
  const id = Number(formData.get("id"));
  getDb().prepare("DELETE FROM messages WHERE id=?").run(id);
  revalidatePath("/admin/messages");
  redirect("/admin/messages");
}

// ---------------- Hero photo ----------------
export async function uploadHeroPhoto(formData: FormData) {
  await requireAuth();
  if (formData.get("clear")) {
    setSetting("hero_photo", "");
    revalidateAll();
    redirect("/admin/settings?saved=1");
  }
  const file = formData.get("hero_photo_file") as File | null;
  if (!file || file.size === 0) redirect("/admin/settings");
  const url = await saveImage(file);
  setSetting("hero_photo", url);
  revalidateAll();
  redirect("/admin/settings?saved=1");
}

// ---------------- Resume ----------------
export async function uploadResume(formData: FormData) {
  await requireAuth();
  const file = formData.get("resume") as File | null;
  if (!file || file.size === 0) redirect("/admin/settings");
  const url = await saveImage(file);
  setSetting("resume_url", url);
  revalidateAll();
  redirect("/admin/settings?saved=1");
}

// ---------------- Settings ----------------
export async function saveSettings(formData: FormData) {
  await requireAuth();
  snapshotDb("settings", true);
  persistSettings(formData);
  revalidateAll();
  redirect("/admin/settings?saved=1");
}

/** Autosave variant: persists without redirecting, returns a timestamp. */
export async function autosaveSettings(formData: FormData): Promise<{ ok: boolean; at: number }> {
  await requireAuth();
  snapshotDb("autosave"); // throttled — keeps periodic restore points
  persistSettings(formData);
  revalidateAll();
  return { ok: true, at: Date.now() };
}

/** Returns a JSON snapshot of all settings for the admin to download. */
export async function exportSettings(): Promise<string> {
  await requireAuth();
  return exportSettingsJson();
}

/** Restores settings from a previously exported JSON string. */
export async function importSettings(raw: string): Promise<ImportResult> {
  await requireAuth();
  const result = importSettingsJson(raw);
  if (result.ok) revalidateAll();
  return result;
}

// ---------------- Autosave: posts ----------------
export type PostAutosaveState = { ok: boolean; id: number; at: number };

/**
 * Saves a post without redirecting, so the editor can persist in the
 * background as you type. Creates the row on first save (when id is 0) and
 * returns the new id so subsequent saves update in place. Cover images are
 * left untouched here — they're uploaded via the explicit Save button.
 */
export async function autosavePost(
  _prev: PostAutosaveState,
  formData: FormData
): Promise<PostAutosaveState> {
  await requireAuth();
  let id = Number(formData.get("id")) || 0;
  const title = str(formData, "title") || "Untitled";
  const excerpt = str(formData, "excerpt");
  const body = str(formData, "body");
  const published = formData.get("published") ? 1 : 0;
  const cover = str(formData, "existing_cover");

  const db = getDb();
  if (id) {
    const slug = makeSlug(title, id);
    db.prepare(
      `UPDATE posts SET title=?, slug=?, excerpt=?, body=?, published=?, updated_at=datetime('now') WHERE id=?`
    ).run(title, slug, excerpt, body, published, id);
  } else {
    const slug = makeSlug(title);
    const info = db
      .prepare(
        `INSERT INTO posts (title, slug, excerpt, body, cover, published) VALUES (?,?,?,?,?,?)`
      )
      .run(title, slug, excerpt, body, cover, published);
    id = Number(info.lastInsertRowid);
  }
  revalidateAll();
  return { ok: true, id, at: Date.now() };
}
