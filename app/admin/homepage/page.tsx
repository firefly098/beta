import { saveHomepage } from "@/app/admin/actions/site";
import { Field } from "@/components/admin/FormFields";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { getHomepageConfig } from "@/lib/site";
import { parseJsonArray, parseJsonObjectArray } from "@/lib/utils";

export default async function HomepageAdminPage() {
  await requireAdmin();
  const [config, casinos, bookmakers, bonuses] = await Promise.all([
    getHomepageConfig(),
    prisma.casinoReview.findMany({ orderBy: { name: "asc" } }),
    prisma.bookmakerReview.findMany({ orderBy: { name: "asc" } }),
    prisma.bonusReview.findMany({ orderBy: { title: "asc" } }),
  ]);

  const featuredCasinos = new Set(parseJsonArray(config.featuredCasinoIds));
  const featuredBookmakers = new Set(parseJsonArray(config.featuredBookmakerIds));
  const featuredBonuses = new Set(parseJsonArray(config.featuredBonusIds));
  const faq = parseJsonObjectArray<{ question: string; answer: string }>(config.faqItems);
  const faqText = faq.map((f) => `${f.question}\n${f.answer}`).join("\n\n");
  const comparisonText = config.rows
    .map((r) => `${r.entityType} | ${r.entityId}`)
    .join("\n");

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold tracking-tight">Homepage</h1>
      <p className="mb-6 text-sm text-zinc-500">
        Configure hero, section order, featured content, and comparison table.
      </p>
      <form action={saveHomepage} className="space-y-4">
        <div className="grid gap-4 rounded-xl border border-zinc-200 bg-white p-4 sm:grid-cols-2">
          <Field label="Hero title" name="heroTitle" defaultValue={config.heroTitle} />
          <Field label="Hero CTA label" name="heroCtaLabel" defaultValue={config.heroCtaLabel} />
          <Field label="Hero subtitle" name="heroSubtitle" defaultValue={config.heroSubtitle} />
          <Field label="Hero CTA URL" name="heroCtaUrl" defaultValue={config.heroCtaUrl} />
          <Field
            label="Section order (comma-separated)"
            name="sections"
            defaultValue={parseJsonArray(config.sections).join(",")}
          />
          <Field
            label="Comparison columns (comma-separated)"
            name="comparisonColumns"
            defaultValue={parseJsonArray(config.comparisonColumns).join(",")}
          />
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <h2 className="font-medium">Featured casinos</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {casinos.map((c) => (
              <label key={c.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="featuredCasinoIds"
                  value={c.id}
                  defaultChecked={featuredCasinos.has(c.id)}
                />
                {c.name}
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <h2 className="font-medium">Featured bookmakers</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {bookmakers.map((c) => (
              <label key={c.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="featuredBookmakerIds"
                  value={c.id}
                  defaultChecked={featuredBookmakers.has(c.id)}
                />
                {c.name}
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <h2 className="font-medium">Featured bonuses</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {bonuses.map((c) => (
              <label key={c.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="featuredBonusIds"
                  value={c.id}
                  defaultChecked={featuredBonuses.has(c.id)}
                />
                {c.title}
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <h2 className="font-medium">Comparison table rows</h2>
          <p className="mt-1 text-xs text-zinc-500">
            One per line: <code>CASINO | id</code> or <code>BOOKMAKER | id</code>
          </p>
          <div className="mt-2 grid gap-4 lg:grid-cols-2">
            <textarea
              name="comparisonRows"
              rows={8}
              defaultValue={comparisonText}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 font-mono text-sm"
            />
            <div className="max-h-64 overflow-auto rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs">
              <p className="font-medium">IDs</p>
              <ul className="mt-2 space-y-1">
                {casinos.map((c) => (
                  <li key={c.id}>
                    CASINO | {c.id} — {c.name}
                  </li>
                ))}
                {bookmakers.map((c) => (
                  <li key={c.id}>
                    BOOKMAKER | {c.id} — {c.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <h2 className="font-medium">FAQ</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Blocks separated by blank lines: first line question, following lines answer. Or paste JSON.
          </p>
          <textarea
            name="faqItems"
            rows={8}
            defaultValue={faqText}
            className="mt-2 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>

        <button type="submit" className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white">
          Save homepage
        </button>
      </form>
    </div>
  );
}
