import PageTitle from "@/components/admin/PageTitle";
import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div>
      <PageTitle title="New project" back={{ href: "/admin/projects", label: "Back to projects" }} />
      <ProjectForm />
    </div>
  );
}
