import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";

const UPLOAD_DIR = path.join(process.cwd(), "data", "uploads");
const ALLOWED = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif"]);

/**
 * Persists an uploaded image file to data/uploads and returns its public path
 * (served by the /uploads/[...file] route). Returns "" when no file given.
 */
export async function saveImage(file: File | null): Promise<string> {
  if (!file || file.size === 0) return "";

  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED.has(ext)) {
    throw new Error(`Unsupported file type: ${ext || "unknown"}`);
  }
  if (file.size > 12 * 1024 * 1024) {
    throw new Error("Image too large (max 12 MB).");
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const name = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(UPLOAD_DIR, name), bytes);
  return `/uploads/${name}`;
}

/** Removes a previously uploaded file given its public /uploads/... path. */
export async function deleteImage(publicPath: string): Promise<void> {
  if (!publicPath || !publicPath.startsWith("/uploads/")) return;
  const name = path.basename(publicPath);
  try {
    await fs.unlink(path.join(UPLOAD_DIR, name));
  } catch {
    // already gone — fine.
  }
}
