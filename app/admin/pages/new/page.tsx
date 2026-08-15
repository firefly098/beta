import { createPage } from "@/app/admin/actions/content";
import {
  AuthorSelect,
  Field,
  SeoFields,
  StatusSelect,
} from "@/components/admin/ContentFields";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site";

export default async function NewPagePage() {
  await requireAdmin();
  const [authors, settings] = await Promise.all([
    prisma.author.findMany({ orderBy: { name: "asc" } }),
    getSiteSettings(),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">New page</h1>
      <form action={createPage} className="space-y-4">
        <div className="grid gap-4 rounded-xl border border-zinc-200 bg-white p-4 sm:grid-cols-2">
          <Field label="Title" name="title" required />
          <Field label="Slug" name="slug" />
          <StatusSelect />
          <AuthorSelect authors={authors} />
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <Field label="Body (HTML)" name="body" textarea rows={12} />
        </div>
        <SeoFields siteName={settings.siteName} />
        <button
          type="submit"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
        >
          Create page
        </button>
      </form>
    </div>
  );
}
