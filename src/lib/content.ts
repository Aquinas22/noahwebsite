import { getDb } from "./db";

export type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  cover: string;
  published: number;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: number;
  title: string;
  description: string;
  url: string;
  image: string;
  tags: string;
  featured: number;
  sort: number;
  created_at: string;
};

export type Website = {
  id: number;
  title: string;
  url: string;
  description: string;
  image: string;
  sort: number;
  created_at: string;
};

export type Photo = {
  id: number;
  src: string;
  caption: string;
  sort: number;
  created_at: string;
};

export type Message = {
  id: number;
  name: string;
  email: string;
  subject: string;
  body: string;
  read: number;
  created_at: string;
};

// ---- Posts ----
export function getPosts(opts: { publishedOnly?: boolean } = {}): Post[] {
  const where = opts.publishedOnly ? "WHERE published = 1" : "";
  return getDb()
    .prepare(`SELECT * FROM posts ${where} ORDER BY created_at DESC`)
    .all() as Post[];
}

export function getPostBySlug(slug: string): Post | undefined {
  return getDb()
    .prepare("SELECT * FROM posts WHERE slug = ?")
    .get(slug) as Post | undefined;
}

export function getPostById(id: number): Post | undefined {
  return getDb()
    .prepare("SELECT * FROM posts WHERE id = ?")
    .get(id) as Post | undefined;
}

// ---- Projects ----
export function getProjects(): Project[] {
  return getDb()
    .prepare("SELECT * FROM projects ORDER BY sort ASC, created_at DESC")
    .all() as Project[];
}

export function getProjectById(id: number): Project | undefined {
  return getDb()
    .prepare("SELECT * FROM projects WHERE id = ?")
    .get(id) as Project | undefined;
}

// ---- Websites ----
export function getWebsites(): Website[] {
  return getDb()
    .prepare("SELECT * FROM websites ORDER BY sort ASC, created_at DESC")
    .all() as Website[];
}

export function getWebsiteById(id: number): Website | undefined {
  return getDb()
    .prepare("SELECT * FROM websites WHERE id = ?")
    .get(id) as Website | undefined;
}

// ---- Photos ----
export function getPhotos(): Photo[] {
  return getDb()
    .prepare("SELECT * FROM photos ORDER BY sort ASC, created_at DESC")
    .all() as Photo[];
}

export function getPhotoById(id: number): Photo | undefined {
  return getDb()
    .prepare("SELECT * FROM photos WHERE id = ?")
    .get(id) as Photo | undefined;
}

// ---- Messages ----
export function getMessages(): Message[] {
  return getDb()
    .prepare("SELECT * FROM messages ORDER BY created_at DESC")
    .all() as Message[];
}

export function getUnreadMessageCount(): number {
  const row = getDb()
    .prepare("SELECT COUNT(*) AS n FROM messages WHERE read = 0")
    .get() as { n: number };
  return row.n;
}

/** Turns "Hello World" into "hello-world"; ensures uniqueness against posts. */
export function makeSlug(title: string, excludeId?: number): string {
  const base =
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "post";
  let slug = base;
  let n = 1;
  const db = getDb();
  while (true) {
    const row = db
      .prepare("SELECT id FROM posts WHERE slug = ?")
      .get(slug) as { id: number } | undefined;
    if (!row || row.id === excludeId) return slug;
    slug = `${base}-${++n}`;
  }
}
