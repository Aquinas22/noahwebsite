import { saveProject } from "@/app/admin/actions";
import type { Project } from "@/lib/content";

export default function ProjectForm({ project }: { project?: Project }) {
  return (
    <form action={saveProject} className="card max-w-2xl space-y-5 p-6">
      {project && <input type="hidden" name="id" value={project.id} />}
      <input type="hidden" name="existing_image" value={project?.image ?? ""} />

      <div>
        <label className="label" htmlFor="title">Title</label>
        <input id="title" name="title" required defaultValue={project?.title} className="field" placeholder="Project name" />
      </div>

      <div>
        <label className="label" htmlFor="description">Description</label>
        <textarea id="description" name="description" rows={4} defaultValue={project?.description} className="field" placeholder="What is it? What did you build?" />
      </div>

      <div>
        <label className="label" htmlFor="url">Link (optional)</label>
        <input id="url" name="url" type="url" defaultValue={project?.url} className="field" placeholder="https://github.com/you/project" />
      </div>

      <div>
        <label className="label" htmlFor="tags">Tags</label>
        <input id="tags" name="tags" defaultValue={project?.tags} className="field" placeholder="Python, Power Systems, React" />
        <p className="mt-1 text-xs text-bark/45">Comma-separated.</p>
      </div>

      <div>
        <label className="label" htmlFor="image">Image</label>
        {project?.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.image} alt="" className="mb-2 h-32 rounded-lg object-cover" />
        )}
        <input id="image" name="image" type="file" accept="image/*" className="field" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="sort">Sort order</label>
          <input id="sort" name="sort" type="number" defaultValue={project?.sort ?? 0} className="field" />
          <p className="mt-1 text-xs text-bark/45">Lower shows first.</p>
        </div>
        <label className="flex items-end gap-2 pb-3 text-sm text-bark/80">
          <input type="checkbox" name="featured" defaultChecked={!!project?.featured} className="h-4 w-4 rounded border-bark/30 text-moss-600" />
          Feature on homepage
        </label>
      </div>

      <button type="submit" className="btn-primary">{project ? "Save changes" : "Create project"}</button>
    </form>
  );
}
