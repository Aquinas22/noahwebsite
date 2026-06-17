import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";
import { SETTING_DEFAULTS } from "./settings-schema";

// Single shared connection. Stored on globalThis so Next's dev hot-reload
// doesn't open a new handle on every change.
const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "app.db");

declare global {
  // eslint-disable-next-line no-var
  var __db: DatabaseSync | undefined;
}

function init(): DatabaseSync {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(path.join(DATA_DIR, "uploads"), { recursive: true });

  const db = new DatabaseSync(DB_PATH);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");

  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS posts (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      title      TEXT NOT NULL,
      slug       TEXT NOT NULL UNIQUE,
      excerpt    TEXT NOT NULL DEFAULT '',
      body       TEXT NOT NULL DEFAULT '',
      cover      TEXT NOT NULL DEFAULT '',
      published  INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS projects (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      url         TEXT NOT NULL DEFAULT '',
      image       TEXT NOT NULL DEFAULT '',
      tags        TEXT NOT NULL DEFAULT '',
      featured    INTEGER NOT NULL DEFAULT 0,
      sort        INTEGER NOT NULL DEFAULT 0,
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS websites (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT NOT NULL,
      url         TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      image       TEXT NOT NULL DEFAULT '',
      sort        INTEGER NOT NULL DEFAULT 0,
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS photos (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      src        TEXT NOT NULL,
      caption    TEXT NOT NULL DEFAULT '',
      sort       INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS messages (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL DEFAULT '',
      email      TEXT NOT NULL DEFAULT '',
      subject    TEXT NOT NULL DEFAULT '',
      body       TEXT NOT NULL DEFAULT '',
      read       INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  seedDefaults(db);
  seedStarterContent(db);
  return db;
}

function seedDefaults(db: DatabaseSync) {
  const insert = db.prepare(
    "INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)"
  );
  for (const [key, value] of Object.entries(SETTING_DEFAULTS)) {
    insert.run(key, value);
  }
}

/**
 * On a brand-new database, drop in one example of each content type so the
 * site looks alive on first run. Noah can edit or delete these from the admin.
 */
function seedStarterContent(db: DatabaseSync) {
  const counts = db
    .prepare(
      "SELECT (SELECT COUNT(*) FROM posts) AS p, (SELECT COUNT(*) FROM projects) AS pr, (SELECT COUNT(*) FROM websites) AS w"
    )
    .get() as { p: number; pr: number; w: number };
  if (counts.p || counts.pr || counts.w) return;

  db.prepare(
    `INSERT INTO posts (title, slug, excerpt, body, published) VALUES (?,?,?,?,1)`
  ).run(
    "Welcome to my site",
    "welcome-to-my-site",
    "A quick hello, and what you'll find here.",
    `Hi, I'm Noah — thanks for stopping by.\n\nThis is the start of my little corner of the internet. I'll use this journal to share notes on **power systems engineering**, the side projects and websites I build, and our slow march toward a hobby farm.\n\n## What's here\n\n- **Projects** — things I've designed and built\n- **Websites** — live sites I've shipped\n- **Photos** — moments along the way\n\nMore soon. ☕`
  );

  db.prepare(
    `INSERT INTO projects (title, description, tags, featured, sort) VALUES (?,?,?,1,0)`
  ).run(
    "Example project",
    "This is a sample project so you can see how things look. Edit or delete it from the admin dashboard, then add your own.",
    "Power Systems, Sample"
  );

  db.prepare(
    `INSERT INTO websites (title, url, description, sort) VALUES (?,?,?,0)`
  ).run(
    "Example website",
    "https://example.com",
    "A placeholder website entry. Swap this out for a real site you've built."
  );
}

export function getDb(): DatabaseSync {
  if (!global.__db) {
    global.__db = init();
  }
  return global.__db;
}
