import { getPhotos } from "@/lib/content";
import { addPhotos, updatePhotoCaption, deletePhoto } from "../actions";
import PageTitle from "@/components/admin/PageTitle";
import DeleteButton from "@/components/admin/DeleteButton";

export default function AdminPhotosPage() {
  const photos = getPhotos();
  return (
    <div>
      <PageTitle title="Photos" />

      <form action={addPhotos} className="card mb-8 max-w-2xl space-y-4 p-6">
        <div>
          <label className="label" htmlFor="photos">Upload photos</label>
          <input id="photos" name="photos" type="file" accept="image/*" multiple required className="field" />
          <p className="mt-1 text-xs text-bark/45">You can select multiple images at once.</p>
        </div>
        <div>
          <label className="label" htmlFor="caption">Caption (applied to this batch)</label>
          <input id="caption" name="caption" className="field" placeholder="Optional caption" />
        </div>
        <button type="submit" className="btn-primary">Upload</button>
      </form>

      {photos.length === 0 ? (
        <div className="card p-10 text-center text-sm text-bark/60">No photos yet.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((ph) => (
            <div key={ph.id} className="card overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ph.src} alt={ph.caption} className="h-44 w-full object-cover" />
              <div className="space-y-3 p-4">
                <form action={updatePhotoCaption} className="flex gap-2">
                  <input type="hidden" name="id" value={ph.id} />
                  <input name="caption" defaultValue={ph.caption} className="field py-1.5 text-sm" placeholder="Caption" />
                  <button className="btn-ghost px-3 py-1.5 text-xs">Save</button>
                </form>
                <DeleteButton action={deletePhoto} id={ph.id} label="Delete photo" confirmText="Delete this photo?" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
