import PageTitle from "@/components/admin/PageTitle";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-bark/10 pt-8">
      <h2 className="font-serif text-xl font-semibold text-ink">{title}</h2>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-bark/75">{children}</div>
    </section>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-moss-600 text-xs font-semibold text-cream">
        {n}
      </span>
      <p>{children}</p>
    </div>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-moss-200 bg-moss-50 px-4 py-3 text-moss-800">
      <span className="font-semibold">Tip: </span>{children}
    </div>
  );
}

function Key({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-bark/10 px-1.5 py-0.5 font-mono text-xs text-ink">{children}</code>
  );
}

export default function AdminHelpPage() {
  return (
    <div className="max-w-2xl">
      <PageTitle title="Help & Guide" />

      <p className="text-sm leading-relaxed text-bark/65">
        Everything you need to know to manage your site. Your changes save automatically — no
        deploy step required.
      </p>

      <div className="mt-8 space-y-10">

        {/* ---- Photos ---- */}
        <Section title="Photos">
          <p>
            Photos are the foundation of your gallery, home page, and the optional hero grid next
            to your intro. Upload as many as you like — they're shown newest-first unless you set a
            sort order.
          </p>
          <div className="space-y-2">
            <Step n={1}>Go to <strong>Photos</strong> in the left sidebar.</Step>
            <Step n={2}>Click <strong>Choose File</strong> and pick one or more images (JPG, PNG, WebP, etc.). You can select multiple at once.</Step>
            <Step n={3}>Add an optional caption, then hit <strong>Upload</strong>.</Step>
          </div>
          <Tip>
            To show photos right next to your intro text, go to <strong>Settings → Navigation &amp;
            sections</strong> and turn on <strong>"Show photos in hero (next to intro)"</strong>. The
            first 4 photos in your library will appear there.
          </Tip>
          <Tip>
            Photos are also clickable on the gallery page and home page — visitors can click any
            photo to see it full-size.
          </Tip>
        </Section>

        {/* ---- Projects ---- */}
        <Section title="Projects">
          <p>
            Projects showcase your work. They appear on the <strong>/projects</strong> page and up
            to 3 show on the home page.
          </p>
          <div className="space-y-2">
            <Step n={1}>Go to <strong>Projects → New project</strong>.</Step>
            <Step n={2}>Fill in the title, description, URL (optional), and tags (comma-separated).</Step>
            <Step n={3}>Upload a cover image — shown as a banner on the card.</Step>
            <Step n={4}>Check <strong>Featured</strong> to pin it to the home page. If none are featured, the 3 most recent show instead.</Step>
          </div>
          <p>
            <strong>Sort order</strong> — lower numbers appear first. Leave at 0 to sort by date.
          </p>
        </Section>

        {/* ---- Websites ---- */}
        <Section title="Websites">
          <p>
            Websites are a separate list for live sites you've built or launched. They appear on
            the <strong>/websites</strong> page and up to 3 show on the home page.
          </p>
          <div className="space-y-2">
            <Step n={1}>Go to <strong>Websites → Add website</strong>.</Step>
            <Step n={2}>Enter the title, full URL (starting with <Key>https://</Key>), and a short description.</Step>
            <Step n={3}>Upload a <strong>Screenshot / preview image</strong> — this shows as a banner on the card everywhere the website appears.</Step>
          </div>
          <Tip>
            Take a screenshot of the site at 1200×800px for the best-looking card image.
          </Tip>
        </Section>

        {/* ---- Posts ---- */}
        <Section title="Journal / Blog posts">
          <p>
            Posts are your blog. They live at <strong>/blog</strong> and up to 3 recent ones show
            on the home page.
          </p>
          <div className="space-y-2">
            <Step n={1}>Go to <strong>Posts → New post</strong>.</Step>
            <Step n={2}>Write your post in the body field — basic <strong>Markdown</strong> is supported (headings with <Key>#</Key>, bold with <Key>**text**</Key>, links, lists).</Step>
            <Step n={3}>Add an excerpt (shown in previews) and an optional cover image.</Step>
            <Step n={4}>Check <strong>Published</strong> when you're ready for it to go live. Unpublished posts are only visible in the admin.</Step>
          </div>
          <Tip>
            Your post is auto-saved as you type, so you won't lose work if you close the tab.
          </Tip>
        </Section>

        {/* ---- Résumé ---- */}
        <Section title="Résumé / CV">
          <p>
            Uploading a résumé adds a <strong>"Download résumé"</strong> button to your About page.
          </p>
          <div className="space-y-2">
            <Step n={1}>Go to <strong>Settings</strong> and scroll to the bottom.</Step>
            <Step n={2}>Under <strong>Résumé PDF</strong>, click Choose File and pick your PDF.</Step>
            <Step n={3}>Hit <strong>Upload résumé</strong>. The button will appear on your About page immediately.</Step>
          </div>
          <p>
            To remove it, go to <strong>Settings → About page</strong> and clear the{" "}
            <strong>Résumé / CV link</strong> field, then save.
          </p>
        </Section>

        {/* ---- Settings ---- */}
        <Section title="Settings overview">
          <p>
            Settings control your name, bio, page text, colors, fonts, and which sections show up.
            They save automatically as you type — no save button needed.
          </p>
          <div className="overflow-hidden rounded-xl border border-bark/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-bark/10 bg-bark/5 text-left">
                  <th className="px-4 py-2.5 font-medium text-ink">Section</th>
                  <th className="px-4 py-2.5 font-medium text-ink">What to change here</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bark/10">
                {[
                  ["Identity", "Your name, tagline, location, and bio"],
                  ["Appearance", "Colors and theme presets — live preview included"],
                  ["Typography & layout", "Heading font, body font, corner style, page width"],
                  ["Home page", "Hero heading, intro text, button labels, section headings"],
                  ["About page", "About body text (Markdown), the \"At a glance\" rows, skills list"],
                  ["Navigation & sections", "Show/hide each page and section; enable hero photos"],
                  ["Contact page", "Heading and intro text for the contact form"],
                  ["SEO & sharing", "Site URL, meta description, social share image"],
                  ["Buy me a coffee", "Your coffee link and button label"],
                  ["Contact & social", "Email, GitHub, LinkedIn, Twitter"],
                  ["Footer", "The note shown at the bottom of every page"],
                ].map(([group, desc]) => (
                  <tr key={group}>
                    <td className="px-4 py-2.5 font-medium text-ink">{group}</td>
                    <td className="px-4 py-2.5 text-bark/65">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* ---- Show/hide sections ---- */}
        <Section title="Showing and hiding sections">
          <p>
            Every section of the site has a toggle in <strong>Settings → Navigation &amp;
            sections</strong>. Turning a section off removes it from the nav and hides the page —
            nothing is deleted.
          </p>
          <div className="overflow-hidden rounded-xl border border-bark/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-bark/10 bg-bark/5 text-left">
                  <th className="px-4 py-2.5 font-medium text-ink">Toggle</th>
                  <th className="px-4 py-2.5 font-medium text-ink">What it controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bark/10">
                {[
                  ["Show About", "The /about page and nav link"],
                  ["Show Projects", "The /projects page, nav link, and home page section"],
                  ["Show Websites", "The /websites page, nav link, and home page section"],
                  ["Show Journal", "The /blog page, nav link, and home page section"],
                  ["Show Photos", "The /gallery page and nav link"],
                  ["Show photos on home page", "The photo grid at the bottom of the home page"],
                  ["Show photos in hero", "The 2×2 photo grid next to your intro text"],
                  ["Show Contact", "The /contact page and nav link"],
                ].map(([toggle, desc]) => (
                  <tr key={toggle}>
                    <td className="px-4 py-2.5 font-medium text-ink">{toggle}</td>
                    <td className="px-4 py-2.5 text-bark/65">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* ---- Appearance ---- */}
        <Section title="Appearance & themes">
          <p>
            Go to <strong>Settings → Appearance</strong> to change colors. Click any of the{" "}
            <strong>theme presets</strong> (Earthy, Slate, Rose, Ocean, Midnight) for a one-click
            color swap, or dial in exact hex values yourself. Changes preview live in the panel.
          </p>
          <p>
            <strong>Font</strong> and <strong>corner style</strong> are under{" "}
            <strong>Typography &amp; layout</strong>.
          </p>
        </Section>

        {/* ---- Contact messages ---- */}
        <Section title="Contact messages">
          <p>
            When someone submits the contact form, their message lands in{" "}
            <strong>Messages</strong> in the left sidebar. Unread messages show a badge count.
            Open a message to mark it read or delete it.
          </p>
          <Tip>
            Set your email under <strong>Settings → Contact &amp; social</strong> so your email
            address appears on the About page too.
          </Tip>
        </Section>

        {/* ---- Backups ---- */}
        <Section title="Backups">
          <p>
            The site automatically saves a backup before most changes. You can see the backup count
            and download a settings snapshot from the <strong>Settings</strong> page (scroll to the
            bottom of the form). Use the snapshot to restore your settings if something goes wrong.
          </p>
        </Section>

      </div>
    </div>
  );
}
