import { deletePage, updatePage } from "@/app/admin/actions/content";
import {
  AuthorSelect,
  Field,
  SeoFields,
  StatusSelect,
} from "@/components/admin/ContentFields";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site";
import { notFound } from "next/navigation";

export default async function EditPagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) notFound();

  const [authors, settings] = await Promise.all([
    prisma.author.findMany({ orderBy: { name: "asc" } }),
    getSiteSettings(),
  ]);

  const save = updatePage.bind(null, id);
  const remove = deletePage.bind(null, id);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Edit page</h1>
        <a href={`/pages/${page.slug}`} target="_blank" className="text-sm text-zinc-500 hover:underline">
          Preview ↗
        </a>
      </div>
      <form action={save} className="space-y-4">
        <div className="grid gap-4 rounded-xl border border-zinc-200 bg-white p-4 sm:grid-cols-2">
          <Field label="Title" name="title" required defaultValue={page.title} />
          <Field label="Slug" name="slug" defaultValue={page.slug} />
          <StatusSelect defaultValue={page.status} />
          <AuthorSelect authors={authors} defaultValue={page.authorId} />
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <Field label="Body (HTML)" name="body" textarea rows={12} defaultValue={page.body} />
        </div>
        <SeoFields
          siteName={settings.siteName}
          defaults={{
            seoTitle: page.seoTitle,
            seoDescription: page.seoDescription,
            canonicalUrl: page.canonicalUrl,
            robots: page.robots,
            ogTitle: page.ogTitle,
            ogDescription: page.ogDescription,
          }}
        />
        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
          >
            Save
          </button>
        </div>
      </form>
      <form action={remove} className="mt-6">
        <button type="submit" className="text-sm text-red-600 hover:underline">
          Delete page
        </button>
      </form>
    </div>
  );
}
