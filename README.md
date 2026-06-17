# Noah Roe — Personal Site & CMS

A warm, modern personal website with a built-in content management system.
Show off your **projects**, the **websites** you've built, write **journal posts**,
share a **photo gallery**, and link to **Buy Me a Coffee** — all editable from a
password-protected admin panel, no code required.

Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and the
built-in **`node:sqlite`** database (no native build step).

---

## Getting started

```bash
npm install
npm run dev
```

Then open:

- **Site:** http://localhost:3000
- **Admin / CMS:** http://localhost:3000/admin

### First login

The dev password is `changeme` (set in `.env.local`). **Change it before deploying.**

```bash
# .env.local
ADMIN_PASSWORD=your-strong-password
SESSION_SECRET=<a long random string>
```

Generate a session secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Using the CMS

Sign in at `/admin`, then:

- **Posts** — write journal entries in Markdown, add a cover image, publish/unpublish.
- **Projects** — title, description, link, image, tags; mark favorites as *Featured* (shown on the home page).
- **Websites** — link out to live sites you've built, with an optional preview image.
- **Photos** — upload one or many images at once, add captions.
- **Settings** — edit your name, tagline, bio, location, **coffee link**, email, and social links.

All content and uploaded images live in the `data/` folder
(`data/app.db` and `data/uploads/`). Back this folder up to keep your content.

---

## Deploying

This app needs a server with **persistent disk** (for the SQLite DB and uploads),
so use a host like **Railway**, **Render**, **Fly.io**, or your own VPS rather than
a purely serverless platform.

```bash
npm run build
npm run start   # serves on PORT (default 3000)
```

Set these environment variables on your host:

| Variable         | Purpose                          |
| ---------------- | -------------------------------- |
| `ADMIN_PASSWORD` | Your admin login password        |
| `SESSION_SECRET` | Long random string for sessions  |

Mount a persistent volume at `data/` so your posts, settings, and images survive
restarts and deploys.

---

## Project structure

```
src/
  app/
    (site)/        Public pages: home, about, projects, websites, blog, gallery
    admin/         CMS dashboard + server actions (auth-protected)
    login/         Admin sign-in
    uploads/       Serves uploaded images from data/uploads
  components/      Nav, Footer, cards, admin forms
  lib/             db, auth, settings, content queries, uploads
data/              SQLite database + uploaded images (gitignored)
```

Made with care. ☕
