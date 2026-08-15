import { deleteAuthor, updateAuthor } from "@/app/admin/actions/content";
import { Field, MediaSelect } from "@/components/admin/ContentFields";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditAuthorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const author = await prisma.author.findUnique({ where: { id } });
  if (!author) notFound();
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });

  const save = updateAuthor.bind(null, id);
  const remove = deleteAuthor.bind(null, id);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Edit author</h1>
      <form action={save} className="max-w-xl space-y-4 rounded-xl border border-zinc-200 bg-white p-4">
        <Field label="Name" name="name" required defaultValue={author.name} />
        <Field label="Slug" name="slug" defaultValue={author.slug} />
        <Field label="Bio" name="bio" textarea defaultValue={author.bio} />
        <MediaSelect media={media} name="avatarId" label="Avatar" defaultValue={author.avatarId} />
        <button type="submit" className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white">
          Save
        </button>
      </form>
      <form action={remove} className="mt-6">
        <button type="submit" className="text-sm text-red-600 hover:underline">
          Delete author
        </button>
      </form>
    </div>
  );
}
