import { CtaButton, JsonLd, ProsCons, RgBlock } from "@/themes/default/ui";
import { prisma } from "@/lib/prisma";
import { publishedWhere } from "@/lib/publish";
import { resolveSeo } from "@/lib/site";
import { parseJsonArray } from "@/lib/utils";
import type { Metadata } from "next";
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
    alternates: seo.canonical ? { canonical: seo.canonical } : undefined,
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
    <main className="mx-auto max-w-6xl px-4 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Review",
          itemReviewed: { "@type": "Organization", name: item.name },
          reviewRating: { "@type": "Rating", ratingValue: item.rating, bestRating: 10 },
          author: item.author
            ? { "@type": "Person", name: item.author.name }
            : { "@type": "Organization", name: seo.siteName },
        }}
      />
      <div className="flex flex-col gap-6 md:flex-row md:justify-between">
        <div>
          <p className="text-sm text-[var(--muted)]">Bookmaker review</p>
          <h1 className="mt-1 font-[family-name:var(--font-display)] text-4xl font-semibold">
            {item.name}
          </h1>
          <p className="mt-3 text-lg text-[var(--muted)]">{item.verdict}</p>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 text-center">
          <p className="text-4xl font-semibold text-[var(--brand)]">{item.rating.toFixed(1)}</p>
          <div className="mt-3">
            <CtaButton label={item.ctaLabel} url={item.ctaUrl} tracking={item.ctaTracking} />
          </div>
        </div>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Info label="Sports" value={item.sportsCoverage} />
        <Info label="Live betting" value={item.liveBetting ? "Yes" : "No"} />
        <Info label="Apps" value={item.hasApps ? "Yes" : "No"} />
      </div>
      <div className="mt-8">
        <ProsCons pros={parseJsonArray(item.pros)} cons={parseJsonArray(item.cons)} />
      </div>
      <article className="prose-cms mt-8 max-w-3xl" dangerouslySetInnerHTML={{ __html: item.body }} />
      <RgBlock text={seo.settings.rgFooterText} />
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
      <p className="text-xs uppercase tracking-wide text-[var(--muted)]">{label}</p>
      <p className="mt-1 font-medium">{value || "—"}</p>
    </div>
  );
}
