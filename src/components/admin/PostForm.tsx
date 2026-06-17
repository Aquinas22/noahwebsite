"use client";

import { useEffect, useRef, useState } from "react";
import { marked } from "marked";
import { autosavePost, savePost } from "@/app/admin/actions";
import type { Post } from "@/lib/content";
import SaveStatus, { type SaveState } from "./SaveStatus";

export default function PostForm({ post }: { post?: Post }) {
  const [id, setId] = useState(post?.id ?? 0);
  const [title, setTitle] = useState(post?.title ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [body, setBody] = useState(post?.body ?? "");
  const [published, setPublished] = useState(post ? !!post.published : true);
  const [status, setStatus] = useState<SaveState>("idle");
  const cover = post?.cover ?? "";

  const idRef = useRef(id);
  idRef.current = id;
  // Snapshot of the initial values so we never autosave an untouched post
  // (also avoids a spurious create on mount under React StrictMode).
  const initial = useRef({
    title: post?.title ?? "",
    excerpt: post?.excerpt ?? "",
    body: post?.body ?? "",
    published: post ? !!post.published : true,
  });

  // Debounced autosave whenever an editable field changes.
  useEffect(() => {
    const unchanged =
      title === initial.current.title &&
      excerpt === initial.current.excerpt &&
      body === initial.current.body &&
      published === initial.current.published;
    if (unchanged) return;

    setStatus("saving");
    const t = setTimeout(async () => {
      const fd = new FormData();
      fd.set("id", String(idRef.current));
      fd.set("title", title);
      fd.set("excerpt", excerpt);
      fd.set("body", body);
      if (published) fd.set("published", "on");
      fd.set("existing_cover", cover);
      const res = await autosavePost({ ok: false, id: idRef.current, at: 0 }, fd);
      if (res.id && res.id !== idRef.current) setId(res.id);
      setStatus("saved");
    }, 800);
    return () => clearTimeout(t);
  }, [title, excerpt, body, published, cover]);

  const previewHtml = marked.parse(body || "_Nothing to preview yet._") as string;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Editor — manual submit (action={savePost}) handles cover upload + finishing */}
      <form action={savePost} className="card space-y-5 p-6">
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="existing_cover" value={cover} />

        <div className="flex items-center justify-between">
          <h2 className="eyebrow">Editor</h2>
          <SaveStatus state={status} />
        </div>

        <div>
          <label className="label" htmlFor="title">Title</label>
          <input id="title" name="title" required value={title} onChange={(e) => setTitle(e.target.value)} className="field" placeholder="My new post" />
        </div>

        <div>
          <label className="label" htmlFor="excerpt">Excerpt</label>
          <textarea id="excerpt" name="excerpt" rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="field" placeholder="A short summary shown in listings." />
        </div>

        <div>
          <label className="label" htmlFor="body">Body (Markdown)</label>
          <textarea id="body" name="body" rows={16} value={body} onChange={(e) => setBody(e.target.value)} className="field font-mono text-sm" placeholder={"Write your post here.\n\n## A heading\n\nSupports **bold**, _italics_, [links](https://example.com), lists, and images."} />
          <p className="mt-1 text-xs text-bark/45">Markdown is supported — headings, bold, links, lists, quotes, and code.</p>
        </div>

        <div>
          <label className="label" htmlFor="cover">Cover image</label>
          {cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt="" className="mb-2 h-32 rounded-lg object-cover" />
          )}
          <input id="cover" name="cover" type="file" accept="image/*" className="field" />
          <p className="mt-1 text-xs text-bark/45">{cover ? "Upload to replace the current image." : "Optional — uploaded when you hit Save & finish."}</p>
        </div>

        <label className="flex items-center gap-2 text-sm text-bark/80">
          <input type="checkbox" name="published" checked={published} onChange={(e) => setPublished(e.target.checked)} className="h-4 w-4 rounded border-bark/30 text-moss-600" />
          Published (visible on the site)
        </label>

        <div className="flex items-center gap-3 border-t border-bark/10 pt-4">
          <button type="submit" className="btn-primary">Save &amp; finish</button>
          <span className="text-xs text-bark/45">Your work autosaves as you type.</span>
        </div>
      </form>

      {/* Live preview */}
      <div className="hidden lg:block">
        <div className="sticky top-6">
          <p className="eyebrow mb-2">Live preview</p>
          <article className="card max-h-[80vh] overflow-y-auto p-7">
            <h1 className="font-serif text-3xl font-semibold text-ink">{title || "Untitled"}</h1>
            {excerpt && <p className="mt-2 text-bark/60">{excerpt}</p>}
            <div className="prose mt-6" dangerouslySetInnerHTML={{ __html: previewHtml }} />
          </article>
        </div>
      </div>
    </div>
  );
}
