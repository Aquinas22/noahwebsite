import { uploadResume } from "@/app/admin/actions";

export default function ResumeUploadPanel({ currentUrl }: { currentUrl: string }) {
  return (
    <section className="card max-w-2xl space-y-4 p-6">
      <h2 className="eyebrow">Résumé PDF</h2>
      {currentUrl && (
        <p className="text-sm text-bark/65">
          Current:{" "}
          <a href={currentUrl} target="_blank" rel="noopener noreferrer" className="text-moss-600 underline">
            {currentUrl}
          </a>
        </p>
      )}
      <form action={uploadResume} className="space-y-3">
        <div>
          <label className="label" htmlFor="resume">Upload a new PDF</label>
          <input id="resume" name="resume" type="file" accept=".pdf" required className="field" />
        </div>
        <button type="submit" className="btn-primary">Upload résumé</button>
      </form>
    </section>
  );
}
