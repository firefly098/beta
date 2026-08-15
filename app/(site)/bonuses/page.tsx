import { ReviewCard } from "@/themes/default/ReviewCard";
import { SectionHeading } from "@/themes/default/ui";
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
    <main className="site-shell py-14">
      <SectionHeading
        eyebrow="Directory"
        title="Bonus reviews"
        subtitle="Welcome offers, free spins, and wagering broken down."
      />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => (
          <ReviewCard
            key={c.id}
            meta="Bonus"
            title={c.title}
            href={`/bonuses/${c.slug}`}
            summary={`${c.amount}${c.casino ? ` · ${c.casino.name}` : c.bookmaker ? ` · ${c.bookmaker.name}` : ""}`}
          />
        ))}
      </div>
    </main>
  );
}
