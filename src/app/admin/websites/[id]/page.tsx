import { notFound } from "next/navigation";
import { getWebsiteById } from "@/lib/content";
import { deleteWebsite } from "../../actions";
import PageTitle from "@/components/admin/PageTitle";
import WebsiteForm from "@/components/admin/WebsiteForm";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function EditWebsitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const website = getWebsiteById(Number(id));
  if (!website) notFound();

  return (
    <div>
      <PageTitle title="Edit website" back={{ href: "/admin/websites", label: "Back to websites" }} />
      <WebsiteForm website={website} />
      <div className="mt-4 max-w-2xl">
        <DeleteButton action={deleteWebsite} id={website.id} label="Delete this website" confirmText={`Delete "${website.title}"?`} />
      </div>
    </div>
  );
}
