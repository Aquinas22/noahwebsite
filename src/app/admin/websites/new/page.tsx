import PageTitle from "@/components/admin/PageTitle";
import WebsiteForm from "@/components/admin/WebsiteForm";

export default function NewWebsitePage() {
  return (
    <div>
      <PageTitle title="New website" back={{ href: "/admin/websites", label: "Back to websites" }} />
      <WebsiteForm />
    </div>
  );
}
