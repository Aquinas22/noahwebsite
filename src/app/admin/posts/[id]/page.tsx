import { notFound } from "next/navigation";
import { getPostById } from "@/lib/content";
import { deletePost } from "../../actions";
import PageTitle from "@/components/admin/PageTitle";
import PostForm from "@/components/admin/PostForm";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = getPostById(Number(id));
  if (!post) notFound();

  return (
    <div>
      <PageTitle title="Edit post" back={{ href: "/admin/posts", label: "Back to posts" }} />
      {/* Spread to a plain object — node:sqlite rows have a null prototype and
          can't be passed straight to a Client Component. */}
      <PostForm post={{ ...post }} />
      <div className="mt-4 max-w-3xl">
        <DeleteButton action={deletePost} id={post.id} label="Delete this post" confirmText={`Delete "${post.title}"?`} />
      </div>
    </div>
  );
}
