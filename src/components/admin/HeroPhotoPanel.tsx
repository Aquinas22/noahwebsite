import { uploadHeroPhoto } from "@/app/admin/actions";

export default function HeroPhotoPanel({ currentUrl }: { currentUrl: string }) {
  return (
    <section className="card max-w-2xl space-y-4 p-6">
      <h2 className="eyebrow">Hero photo</h2>
      <p className="text-sm text-bark/65">
        A single photo shown in the hero section of your home page, right next to your intro text.
      </p>
      {currentUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={currentUrl} alt="Current hero photo" className="h-48 w-full rounded-xl object-cover" />
      )}
      <form action={uploadHeroPhoto} className="space-y-3">
        <div>
          <label className="label" htmlFor="hero_photo_file">Upload a new photo</label>
          <input id="hero_photo_file" name="hero_photo_file" type="file" accept="image/*" required className="field" />
        </div>
        <button type="submit" className="btn-primary">Save hero photo</button>
      </form>
      {currentUrl && (
        <form action={uploadHeroPhoto}>
          <input type="hidden" name="clear" value="1" />
          <button type="submit" className="text-sm text-clay-600 hover:underline">Remove photo</button>
        </form>
      )}
    </section>
  );
}
