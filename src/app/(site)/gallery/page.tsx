import { getPhotos } from "@/lib/content";
import PageHeader from "@/components/PageHeader";

export const metadata = { title: "Photos" };

export default function GalleryPage() {
  const photos = getPhotos();
  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="Photos"
        intro="Moments from life, work, and the journey toward our someday hobby farm."
      />
      <div className="container-page pb-10">
        {photos.length === 0 ? (
          <div className="card flex flex-col items-center gap-2 px-6 py-16 text-center">
            <p className="font-serif text-xl font-semibold text-ink">No photos yet</p>
            <p className="text-sm text-bark/60">Upload your first photos from the admin dashboard.</p>
          </div>
        ) : (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
            {photos.map((ph) => (
              <figure key={ph.id} className="break-inside-avoid overflow-hidden rounded-2xl border border-bark/10 bg-white shadow-soft">
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
        )}
      </div>
    </>
  );
}
