import { createCasino } from "@/app/admin/actions/content";
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

export default async function NewCasinoPage() {
  await requireAdmin();
  const [authors, media, settings] = await Promise.all([
    prisma.author.findMany({ orderBy: { name: "asc" } }),
    prisma.media.findMany({ orderBy: { createdAt: "desc" } }),
    getSiteSettings(),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">New casino review</h1>
      <form action={createCasino} className="space-y-4">
        <div className="grid gap-4 rounded-xl border border-zinc-200 bg-white p-4 sm:grid-cols-2">
          <Field label="Name" name="name" required />
          <Field label="Slug" name="slug" />
          <Field label="Rating" name="rating" type="number" step="0.1" min={0} max={10} defaultValue={0} />
          <StatusSelect />
          <AuthorSelect authors={authors} />
          <MediaSelect media={media} name="logoId" label="Logo" />
          <Field label="Logo background (hex)" name="logoBackground" defaultValue="#195684" />
          <Field label="Min deposit" name="minDeposit" />
          <Field label="Payout speed" name="payoutSpeed" />
          <Field label="Bonus highlight" name="bonusHighlight" />
        </div>
        <div className="grid gap-4 rounded-xl border border-zinc-200 bg-white p-4 sm:grid-cols-2">
          <LinesField label="Pros" name="pros" />
          <LinesField label="Cons" name="cons" />
          <LinesField label="Licenses" name="licenses" />
          <LinesField label="Payments" name="payments" />
          <LinesField label="Providers" name="providers" />
          <Field label="Verdict" name="verdict" textarea />
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <Field label="Body (HTML)" name="body" textarea rows={10} />
        </div>
        <CtaFields defaults={{ ctaLabel: "Visit Casino" }} />
        <SeoFields siteName={settings.siteName} />
        <button type="submit" className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white">
          Create casino
        </button>
      </form>
    </div>
  );
}
