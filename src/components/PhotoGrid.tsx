"use client";

import { useState } from "react";
import type { Photo } from "@/lib/content";

type Layout = "masonry" | "grid" | "hero";

export default function PhotoGrid({
  photos,
  layout = "grid",
}: {
  photos: Photo[];
  layout?: Layout;
}) {
  const [open, setOpen] = useState<Photo | null>(null);

  return (
    <>
      {layout === "masonry" ? (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {photos.map((ph) => (
            <figure
              key={ph.id}
              className="break-inside-avoid cursor-zoom-in overflow-hidden rounded-2xl border border-bark/10 bg-white shadow-soft"
              onClick={() => setOpen(ph)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ph.src} alt={ph.caption || "Photo"} className="w-full" />
              {ph.caption && (
                <figcaption className="px-4 py-3 text-sm text-bark/65">
                  {ph.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      ) : layout === "hero" ? (
        <div className="grid grid-cols-2 gap-2">
          {photos.slice(0, 4).map((ph) => (
            <button
              key={ph.id}
              onClick={() => setOpen(ph)}
              className="block overflow-hidden rounded-xl"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ph.src}
                alt={ph.caption || "Photo"}
                className="h-28 w-full cursor-zoom-in object-cover transition hover:opacity-90"
              />
            </button>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((ph) => (
            <button
              key={ph.id}
              onClick={() => setOpen(ph)}
              className="block overflow-hidden rounded-2xl"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ph.src}
                alt={ph.caption || "Photo"}
                className="h-48 w-full cursor-zoom-in object-cover shadow-soft transition hover:opacity-90"
              />
            </button>
          ))}
        </div>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpen(null)}
        >
          <button
            className="absolute right-4 top-4 text-3xl leading-none text-white hover:text-white/70"
            aria-label="Close"
            onClick={() => setOpen(null)}
          >
            ×
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={open.src}
            alt={open.caption || "Photo"}
            className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          {open.caption && (
            <p className="absolute bottom-6 left-0 right-0 text-center text-sm text-white/80">
              {open.caption}
            </p>
          )}
        </div>
      )}
    </>
  );
}
