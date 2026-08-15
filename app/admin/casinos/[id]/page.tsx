import { deleteCasino, updateCasino } from "@/app/admin/actions/content";
import {
  AuthorSelect,
  CtaFields,
  Field,
  LinesField,
  MediaSelect,
  SeoFields,
  StatusSelect,
} from "@/components/admin/ContentFields";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site";
import { notFound } from "next/navigation";

export default async function EditCasinoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const item = await prisma.casinoReview.findUnique({ where: { id } });
  if (!item) notFound();

  const [authors, media, settings] = await Promise.all([
    prisma.author.findMany({ orderBy: { name: "asc" } }),
    prisma.media.findMany({ orderBy: { createdAt: "desc" } }),
    getSiteSettings(),
  ]);

  const save = updateCasino.bind(null, id);
  const remove = deleteCasino.bind(null, id);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Edit casino</h1>
        <a href={`/casinos/${item.slug}`} target="_blank" className="text-sm text-zinc-500 hover:underline">
          Preview ↗
        </a>
      </div>
      <form action={save} className="space-y-4">
        <div className="grid gap-4 rounded-xl border border-zinc-200 bg-white p-4 sm:grid-cols-2">
          <Field label="Name" name="name" required defaultValue={item.name} />
          <Field label="Slug" name="slug" defaultValue={item.slug} />
          <Field label="Rating" name="rating" type="number" step="0.1" min={0} max={10} defaultValue={item.rating} />
          <StatusSelect defaultValue={item.status} />
          <AuthorSelect authors={authors} defaultValue={item.authorId} />
          <MediaSelect media={media} name="logoId" label="Logo" defaultValue={item.logoId} />
          <Field label="Logo background (hex)" name="logoBackground" defaultValue={item.logoBackground} />
          <Field label="Min deposit" name="minDeposit" defaultValue={item.minDeposit} />
          <Field label="Payout speed" name="payoutSpeed" defaultValue={item.payoutSpeed} />
          <Field label="Bonus highlight" name="bonusHighlight" defaultValue={item.bonusHighlight} />
        </div>
        <div className="grid gap-4 rounded-xl border border-zinc-200 bg-white p-4 sm:grid-cols-2">
          <LinesField label="Pros" name="pros" jsonValue={item.pros} />
          <LinesField label="Cons" name="cons" jsonValue={item.cons} />
          <LinesField label="Licenses" name="licenses" jsonValue={item.licenses} />
          <LinesField label="Payments" name="payments" jsonValue={item.payments} />
          <LinesField label="Providers" name="providers" jsonValue={item.providers} />
          <Field label="Verdict" name="verdict" textarea defaultValue={item.verdict} />
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
          Delete casino
        </button>
      </form>
    </div>
  );
}
