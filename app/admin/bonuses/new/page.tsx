import { createBonus } from "@/app/admin/actions/content";
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

export default async function NewBonusPage() {
  await requireAdmin();
  const [authors, casinos, bookmakers, settings] = await Promise.all([
    prisma.author.findMany({ orderBy: { name: "asc" } }),
    prisma.casinoReview.findMany({ orderBy: { name: "asc" } }),
    prisma.bookmakerReview.findMany({ orderBy: { name: "asc" } }),
    getSiteSettings(),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">New bonus review</h1>
      <form action={createBonus} className="space-y-4">
        <div className="grid gap-4 rounded-xl border border-zinc-200 bg-white p-4 sm:grid-cols-2">
          <Field label="Title" name="title" required />
          <Field label="Slug" name="slug" />
          <label className="block text-sm font-medium">
            Bonus type
            <select
              name="bonusType"
              defaultValue="WELCOME"
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
          <StatusSelect />
          <Field label="Amount" name="amount" />
          <Field label="Wagering" name="wagering" />
          <label className="block text-sm font-medium">
            Linked casino
            <select
              name="casinoId"
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
          <AuthorSelect authors={authors} />
          <Field label="T&Cs summary" name="termsSummary" textarea />
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <Field label="Body (HTML)" name="body" textarea rows={10} />
        </div>
        <CtaFields defaults={{ ctaLabel: "Claim Bonus" }} />
        <SeoFields siteName={settings.siteName} />
        <button type="submit" className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white">
          Create bonus
        </button>
      </form>
    </div>
  );
}
