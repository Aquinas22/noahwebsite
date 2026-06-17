import { getProjects } from "@/lib/content";
import PageHeader from "@/components/PageHeader";
import ProjectCard from "@/components/ProjectCard";

export const metadata = { title: "Projects" };

export default function ProjectsPage() {
  const projects = getProjects();
  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="Projects"
        intro="Things I've designed, built, and tinkered with — from engineering work to web experiments and everything in between."
      />
      <div className="container-page pb-10">
        {projects.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function EmptyState() {
  return (
    <div className="card flex flex-col items-center gap-2 px-6 py-16 text-center">
      <p className="font-serif text-xl font-semibold text-ink">No projects yet</p>
      <p className="text-sm text-bark/60">
        Add your first project from the admin dashboard.
      </p>
    </div>
  );
}
