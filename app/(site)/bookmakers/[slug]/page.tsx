import { CtaButton, JsonLd, ProsCons, RgBlock } from "@/themes/default/ui";
import { prisma } from "@/lib/prisma";
import { publishedWhere } from "@/lib/publish";
import { resolveSeo } from "@/lib/site";
import { parseJsonArray } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await prisma.bookmakerReview.findFirst({
    where: { slug, ...publishedWhere },
    include: { ogImage: true },
  });
  if (!item) return {};
  const seo = await resolveSeo("bookmaker", { ...item, name: item.name });
  return {
    title: seo.title,
    description: seo.description,
    robots: seo.robots,
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: seo.ogImage ? [seo.ogImage] : undefined,
    },
  };
}

export default async function BookmakerReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await prisma.bookmakerReview.findFirst({
    where: { slug, ...publishedWhere },
    include: { author: true },
  });
  if (!item) notFound();
  const seo = await resolveSeo("bookmaker", { ...item, name: item.name });

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Review",
          itemReviewed: { "@type": "Organization", name: item.name },
          reviewRating: { "@type": "Rating", ratingValue: item.rating, bestRating: 10 },
        }}
      />
      <section className="border-b border-[var(--line)] bg-[var(--surface)]">
        <div className="site-shell py-10 md:py-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
            <Link href="/bookmakers" className="hover:text-[var(--ink)]">
              Bookmakers
            </Link>
            <span className="mx-2 opacity-40">/</span>
            Review
          </p>
          <div className="mt-6 flex flex-col gap-8 md:flex-row md:justify-between">
            <div>
              <h1 className="font-display text-[clamp(2rem,5vw,3.2rem)] font-semibold tracking-tight">
                {item.name}
              </h1>
              <p className="mt-4 max-w-xl text-[15px] text-[var(--muted)]">{item.verdict}</p>
            </div>
            <div className="surface w-full p-5 md:w-56">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Score
              </p>
              <p className="mt-2 font-display text-5xl font-semibold">{item.rating.toFixed(1)}</p>
              <div className="mt-4">
                <CtaButton label={item.ctaLabel} url={item.ctaUrl} tracking={item.ctaTracking} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="site-shell py-10">
        <div className="grid gap-3 sm:grid-cols-3">
          <Info label="Sports" value={item.sportsCoverage} />
          <Info label="Live betting" value={item.liveBetting ? "Yes" : "No"} />
          <Info label="Apps" value={item.hasApps ? "Yes" : "No"} />
        </div>
        <div className="mt-8">
          <ProsCons pros={parseJsonArray(item.pros)} cons={parseJsonArray(item.cons)} />
        </div>
        <article className="prose-cms mt-12 max-w-2xl" dangerouslySetInnerHTML={{ __html: item.body }} />
        <RgBlock text={seo.settings.rgFooterText} />
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-sm font-semibold">{value || "—"}</p>
    </div>
  );
}
