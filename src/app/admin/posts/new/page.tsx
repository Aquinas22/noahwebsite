import PageTitle from "@/components/admin/PageTitle";
import PostForm from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <div>
      <PageTitle title="New post" back={{ href: "/admin/posts", label: "Back to posts" }} />
      <PostForm />
    </div>
  );
}
