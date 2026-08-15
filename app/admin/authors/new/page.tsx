import { createAuthor } from "@/app/admin/actions/content";
import { Field, MediaSelect } from "@/components/admin/ContentFields";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export default async function NewAuthorPage() {
  await requireAdmin();
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">New author</h1>
      <form action={createAuthor} className="max-w-xl space-y-4 rounded-xl border border-zinc-200 bg-white p-4">
        <Field label="Name" name="name" required />
        <Field label="Slug" name="slug" />
        <Field label="Bio" name="bio" textarea />
        <MediaSelect media={media} name="avatarId" label="Avatar" />
        <button type="submit" className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white">
          Create author
        </button>
      </form>
    </div>
  );
}
