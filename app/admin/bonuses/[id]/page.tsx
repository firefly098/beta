import { deleteBonus, updateBonus } from "@/app/admin/actions/content";
import {
  AuthorSelect,
  CtaFields,
  Field,
  SeoFields,
  StatusSelect,
} from "@/components/admin/ContentFields";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site";
import { notFound } from "next/navigation";

export default async function EditBonusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const item = await prisma.bonusReview.findUnique({ where: { id } });
  if (!item) notFound();

  const [authors, casinos, bookmakers, settings] = await Promise.all([
    prisma.author.findMany({ orderBy: { name: "asc" } }),
    prisma.casinoReview.findMany({ orderBy: { name: "asc" } }),
    prisma.bookmakerReview.findMany({ orderBy: { name: "asc" } }),
    getSiteSettings(),
  ]);

  const save = updateBonus.bind(null, id);
  const remove = deleteBonus.bind(null, id);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Edit bonus</h1>
        <a href={`/bonuses/${item.slug}`} target="_blank" className="text-sm text-zinc-500 hover:underline">
          Preview ↗
        </a>
      </div>
      <form action={save} className="space-y-4">
        <div className="grid gap-4 rounded-xl border border-zinc-200 bg-white p-4 sm:grid-cols-2">
          <Field label="Title" name="title" required defaultValue={item.title} />
          <Field label="Slug" name="slug" defaultValue={item.slug} />
          <label className="block text-sm font-medium">
            Bonus type
            <select
              name="bonusType"
              defaultValue={item.bonusType}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            >
              {["WELCOME", "FREE_SPINS", "CASHBACK", "DEPOSIT", "NO_DEPOSIT", "OTHER"].map(
                (t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ),
              )}
            </select>
          </label>
          <StatusSelect defaultValue={item.status} />
          <Field label="Amount" name="amount" defaultValue={item.amount} />
          <Field label="Wagering" name="wagering" defaultValue={item.wagering} />
          <label className="block text-sm font-medium">
            Linked casino
            <select
              name="casinoId"
              defaultValue={item.casinoId || ""}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            >
              <option value="">None</option>
              {casinos.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium">
            Linked bookmaker
            <select
              name="bookmakerId"
              defaultValue={item.bookmakerId || ""}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            >
              <option value="">None</option>
              {bookmakers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <AuthorSelect authors={authors} defaultValue={item.authorId} />
          <Field label="T&Cs summary" name="termsSummary" textarea defaultValue={item.termsSummary} />
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <Field label="Body (HTML)" name="body" textarea rows={10} defaultValue={item.body} />
        </div>
        <CtaFields defaults={item} />
        <SeoFields
          siteName={settings.siteName}
          defaults={{
            seoTitle: item.seoTitle,
            seoDescription: item.seoDescription,
            canonicalUrl: item.canonicalUrl,
            robots: item.robots,
            ogTitle: item.ogTitle,
            ogDescription: item.ogDescription,
          }}
        />
        <button type="submit" className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white">
          Save
        </button>
      </form>
      <form action={remove} className="mt-6">
        <button type="submit" className="text-sm text-red-600 hover:underline">
          Delete bonus
        </button>
      </form>
    </div>
  );
}
