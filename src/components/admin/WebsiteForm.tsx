import { saveWebsite } from "@/app/admin/actions";
import type { Website } from "@/lib/content";

export default function WebsiteForm({ website }: { website?: Website }) {
  return (
    <form action={saveWebsite} className="card max-w-2xl space-y-5 p-6">
      {website && <input type="hidden" name="id" value={website.id} />}
      <input type="hidden" name="existing_image" value={website?.image ?? ""} />

      <div>
        <label className="label" htmlFor="title">Title</label>
        <input id="title" name="title" required defaultValue={website?.title} className="field" placeholder="Site name" />
      </div>

      <div>
        <label className="label" htmlFor="url">URL</label>
        <input id="url" name="url" type="url" required defaultValue={website?.url} className="field" placeholder="https://example.com" />
      </div>

      <div>
        <label className="label" htmlFor="description">Description</label>
        <textarea id="description" name="description" rows={3} defaultValue={website?.description} className="field" placeholder="What is this site about?" />
      </div>

      <div>
        <label className="label" htmlFor="image">Screenshot / preview image</label>
        {website?.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={website.image} alt="" className="mb-2 h-32 rounded-lg object-cover" />
        )}
        <input id="image" name="image" type="file" accept="image/*" className="field" />
      </div>

      <div>
        <label className="label" htmlFor="sort">Sort order</label>
        <input id="sort" name="sort" type="number" defaultValue={website?.sort ?? 0} className="field w-32" />
      </div>

      <button type="submit" className="btn-primary">{website ? "Save changes" : "Add website"}</button>
    </form>
  );
}
