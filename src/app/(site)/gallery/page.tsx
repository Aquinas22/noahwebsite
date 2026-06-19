import { getPhotos } from "@/lib/content";
import PageHeader from "@/components/PageHeader";
import PhotoGrid from "@/components/PhotoGrid";

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
          <PhotoGrid photos={photos} layout="masonry" />
        )}
      </div>
    </>
  );
}
