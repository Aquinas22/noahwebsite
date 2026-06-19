# Noah's Personal Site

A self-contained Next.js personal site with a built-in CMS. No external database, no third-party CMS. Everything runs from a single SQLite file at `data/app.db`.

## Stack

- **Next.js 16** with App Router and React Server Components
- **SQLite** via Node's built-in `node:sqlite` (no better-sqlite3 needed)
- **Tailwind CSS 3** for styling
- **Server Actions** for all mutations (no API routes except `/uploads/[...file]` and `/og`)
- **marked** for Markdown → HTML on the About page

## Running locally

```bash
./run.sh          # or: npm run dev
```

The site is also exposed via a Cloudflare tunnel. Allowed origins are set in `next.config.ts`.

## Project structure

```
src/
  app/
    (site)/           # Public-facing pages (home, about, blog, gallery, etc.)
    admin/            # CMS admin pages (auth-gated)
      actions.ts      # ALL server actions — mutations live here
      settings/       # Settings page with autosave
      posts/          # Blog post CRUD
      projects/       # Project CRUD
      websites/       # Website CRUD
      photos/         # Photo upload/manage
    login/            # Login page
    uploads/[...file] # Static file server for data/uploads/
    og/               # Open Graph image generation
  components/
    admin/            # Admin-only UI components
    PhotoGrid.tsx     # Client component: photo grid + lightbox (3 layouts)
    ProjectCard.tsx   # Project card used on home and /projects
    Nav.tsx / Footer.tsx / PageHeader.tsx / ContactForm.tsx
  lib/
    db.ts             # SQLite init, schema creation, seed data
    content.ts        # All read queries (getPosts, getProjects, etc.)
    settings.ts       # getSettings() / setSetting()
    settings-schema.ts # THE source of truth for all editable settings
    upload.ts         # saveImage() — saves files to data/uploads/
    auth.ts           # Session-based auth (iron-session or similar)
    backup.ts         # DB snapshot helpers
    theme.ts          # CSS variable generation from theme settings
    seo.ts            # generateMetadata helpers
    fonts.ts          # Google Fonts loading

data/
  app.db              # SQLite database (gitignored)
  uploads/            # User-uploaded files served at /uploads/...
  backups/            # Auto-snapshots before mutations
```

## Settings system

`src/lib/settings-schema.ts` is the single source of truth. Adding a new setting = one line in `SETTINGS_SCHEMA`. The schema drives:
- The admin settings form (auto-rendered)
- Which keys `persistSettings()` will save
- Default values seeded into the DB on first run

Settings are flat key/value strings in the `settings` table. Toggles are `"1"` (on) or `""` (off). `isOn(s, key)` handles the check.

## Content types

All defined in `src/lib/content.ts`:

| Type | Table | Notable fields |
|------|-------|---------------|
| Post | `posts` | slug, body (Markdown), cover (image path), published |
| Project | `projects` | image, tags (comma-sep), featured (bool), sort |
| Website | `websites` | url, image (screenshot), sort |
| Photo | `photos` | src (image path), caption, sort |
| Message | `messages` | contact form submissions, read flag |

## File uploads

`saveImage(file)` in `src/lib/upload.ts`:
- Saves to `data/uploads/` with a timestamped random name
- Returns the public path `/uploads/<filename>` 
- Accepted types: jpg, jpeg, png, gif, webp, avif, **pdf** (PDFs for résumé)
- Max size: 20 MB

Files are served by `src/app/uploads/[...file]/route.ts`.

## Resume PDF

- Upload via **Admin → Settings → Résumé PDF** section (calls `uploadResume` action)
- Saves the PDF to `data/uploads/` and updates the `resume_url` setting
- About page shows a "Download résumé" button when `resume_url` is set
- The `resume_url` setting can also be set manually to any URL

## Photo lightbox

`src/components/PhotoGrid.tsx` is a client component used anywhere photos appear:
- `layout="masonry"` — gallery page (masonry columns, full-height images)
- `layout="grid"` — home page photos section (2–3 col grid, h-48)
- `layout="hero"` — hero section right column (2×2 grid, h-28, up to 4 photos)

Clicking any photo opens a full-screen overlay. Click outside or × to close.

## Home page sections

Controlled by toggles in the `nav` group of `SETTINGS_SCHEMA`:

| Toggle | What it shows |
|--------|--------------|
| `show_projects` | Featured projects section |
| `show_websites` | Websites section (with screenshot images) |
| `show_blog` | Latest journal posts |
| `show_home_photos` | Photo grid at the bottom |
| `show_hero_photos` | Photo grid in the hero's right column (next to the intro) |

Hero photos use the first 4 photos from the photos collection. Enable via Admin → Settings → Navigation & sections.

## Website cards

The `websites` table has an `image` field (screenshot/preview). When set, it shows as a `h-40` image at the top of the card on the home page and websites page. Set via **Admin → Websites → edit → Screenshot / preview image**.

## Auth

Session-based. Login at `/login`. `requireAuth()` in `src/lib/auth.ts` redirects to login if not authenticated. All admin server actions call `requireAuth()` first.

## Backups

`snapshotDb(tag)` in `src/lib/backup.ts` creates timestamped copies in `data/backups/`. Called before most mutations. The admin settings page shows backup count and lets you download/restore.

## Theme

All theme values (colors, fonts, radius, container width) are settings. `src/lib/theme.ts` generates CSS custom properties injected in `src/app/layout.tsx`. Change via Admin → Settings → Appearance.

## Deployment

Runs as a Node.js process (not `next export`). The `autorun.sh` script starts it. `data/` directory must be writable. Cloudflare tunnel exposes it publicly.
