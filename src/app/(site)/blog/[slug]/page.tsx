import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import type { Metadata } from "next";
import { getPostBySlug } from "@/lib/content";
import { getSettings } from "@/lib/settings";
import { ogImageUrl } from "@/lib/seo";

function fmtDate(s: string) {
  return new Date(s.replace(" ", "T") + "Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not found" };
  const s = getSettings();
  const description = post.excerpt || undefined;
  const image = post.cover || ogImageUrl(s, { title: post.title, subtitle: s.tagline, eyebrow: "Journal" });
  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url: `/blog/${post.slug}`,
      images: [image],
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
    },
    twitter: { card: "summary_large_image", title: post.title, description, images: [image] },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post || !post.published) notFound();

  const html = marked.parse(post.body, { async: false }) as string;
  const s = getSettings();
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || undefined,
    datePublished: post.created_at,
    dateModified: post.updated_at,
    image: post.cover || undefined,
    author: { "@type": "Person", name: s.site_title },
    ...(s.site_url ? { url: `${s.site_url.replace(/\/$/, "")}/blog/${post.slug}` } : {}),
  });

  return (
    <article className="container-page max-w-3xl py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <Link href="/blog" className="text-sm font-medium text-moss-600 hover:text-moss-700">
        ← Back to journal
      </Link>
      <p className="mt-8 text-sm text-bark/50">{fmtDate(post.created_at)}</p>
      <h1 className="mt-2 font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl">
        {post.title}
      </h1>
      {post.excerpt && (
        <p className="mt-4 text-lg leading-relaxed text-bark/70">{post.excerpt}</p>
      )}
      {post.cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.cover} alt={post.title} className="mt-8 w-full rounded-2xl object-cover" />
      )}
      <div
        className="prose mt-10"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
