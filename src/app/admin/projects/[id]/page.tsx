import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/content";
import { deleteProject } from "../../actions";
import PageTitle from "@/components/admin/PageTitle";
import ProjectForm from "@/components/admin/ProjectForm";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = getProjectById(Number(id));
  if (!project) notFound();

  return (
    <div>
      <PageTitle title="Edit project" back={{ href: "/admin/projects", label: "Back to projects" }} />
      <ProjectForm project={project} />
      <div className="mt-4 max-w-2xl">
        <DeleteButton action={deleteProject} id={project.id} label="Delete this project" confirmText={`Delete "${project.title}"?`} />
      </div>
    </div>
  );
}
