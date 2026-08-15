import { ReviewCard } from "@/themes/default/ReviewCard";
import { SectionHeading } from "@/themes/default/ui";
import { prisma } from "@/lib/prisma";
import { publishedWhere } from "@/lib/publish";
import { resolveSeo } from "@/lib/site";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await resolveSeo("archive", { title: "Bookmaker reviews" });
  return { title: seo.title, description: seo.description };
}

export default async function BookmakersArchivePage() {
  const items = await prisma.bookmakerReview.findMany({
    where: publishedWhere,
    orderBy: { rating: "desc" },
  });

  return (
    <main className="site-shell py-14">
      <SectionHeading
        eyebrow="Directory"
        title="Bookmaker reviews"
        subtitle="Odds quality, live markets, apps, and payout reliability."
      />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => (
          <ReviewCard
            key={c.id}
            meta="Bookmaker"
            title={c.name}
            href={`/bookmakers/${c.slug}`}
            rating={c.rating}
            summary={c.verdict || c.bonusHighlight}
          />
        ))}
      </div>
    </main>
  );
}
