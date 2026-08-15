import { ReviewCard } from "@/themes/default/ReviewCard";
import { prisma } from "@/lib/prisma";
import { publishedWhere } from "@/lib/publish";
import { resolveSeo } from "@/lib/site";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await resolveSeo("archive", { title: "Bonus reviews" });
  return { title: seo.title, description: seo.description };
}

export default async function BonusesArchivePage() {
  const items = await prisma.bonusReview.findMany({
    where: publishedWhere,
    orderBy: { updatedAt: "desc" },
    include: { casino: true, bookmaker: true },
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold">
        Bonus reviews
      </h1>
      <p className="mt-2 text-[var(--muted)]">Welcome offers, free spins, and wagering breakdowns.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => (
          <ReviewCard
            key={c.id}
            title={c.title}
            href={`/bonuses/${c.slug}`}
            summary={`${c.amount}${c.casino ? ` · ${c.casino.name}` : c.bookmaker ? ` · ${c.bookmaker.name}` : ""}`}
          />
        ))}
      </div>
    </main>
  );
}
