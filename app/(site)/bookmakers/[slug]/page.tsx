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
    <main>
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
      <section className="relative overflow-hidden border-b border-black/20 bg-[linear-gradient(145deg,var(--hero-from),var(--hero-via)_50%,var(--hero-to))] text-white">
        <div className="hero-grid absolute inset-0 opacity-50" />
        <div className="site-shell relative py-12 md:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
            <Link href="/bookmakers" className="hover:underline">
              Bookmakers
            </Link>{" "}
            / Review
          </p>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
            <div>
              <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
                {item.name} Review
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-white/75">{item.verdict}</p>
            </div>
            <div className="rounded-[1.25rem] border border-white/15 bg-white/10 p-5 backdrop-blur-md">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/60">Our score</p>
              <p className="mt-2 font-display text-5xl font-semibold">
                {item.rating.toFixed(1)}
                <span className="text-2xl text-white/50">/10</span>
              </p>
              <div className="mt-4">
                <CtaButton label={item.ctaLabel} url={item.ctaUrl} tracking={item.ctaTracking} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="site-shell py-12">
        <div className="grid gap-4 sm:grid-cols-3">
          <Info label="Sports" value={item.sportsCoverage} />
          <Info label="Live betting" value={item.liveBetting ? "Yes" : "No"} />
          <Info label="Apps" value={item.hasApps ? "Yes" : "No"} />
        </div>
        <div className="mt-10">
          <ProsCons pros={parseJsonArray(item.pros)} cons={parseJsonArray(item.cons)} />
        </div>
        <article className="prose-cms mt-12 max-w-3xl" dangerouslySetInnerHTML={{ __html: item.body }} />
        <RgBlock text={seo.settings.rgFooterText} />
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.1rem] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-lg font-semibold">{value || "—"}</p>
    </div>
  );
}
