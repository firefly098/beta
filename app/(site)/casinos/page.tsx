import { ReviewCard } from "@/themes/default/ReviewCard";
import { prisma } from "@/lib/prisma";
import { publishedWhere } from "@/lib/publish";
import { resolveSeo } from "@/lib/site";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await resolveSeo("archive", { title: "Casino reviews" });
  return { title: seo.title, description: seo.description };
}

export default async function CasinosArchivePage() {
  const items = await prisma.casinoReview.findMany({
    where: publishedWhere,
    orderBy: { rating: "desc" },
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold">
        Casino reviews
      </h1>
      <p className="mt-2 text-[var(--muted)]">Independent ratings, bonuses, and payout details.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => (
          <ReviewCard
            key={c.id}
            title={c.name}
            href={`/casinos/${c.slug}`}
            rating={c.rating}
            summary={c.verdict || c.bonusHighlight}
          />
        ))}
      </div>
    </main>
  );
}
