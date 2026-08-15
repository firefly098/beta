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
  const item = await prisma.casinoReview.findFirst({
    where: { slug, ...publishedWhere },
    include: { ogImage: true },
  });
  if (!item) return {};
  const seo = await resolveSeo("casino", { ...item, name: item.name });
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

export default async function CasinoReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await prisma.casinoReview.findFirst({
    where: { slug, ...publishedWhere },
    include: { author: true, logo: true },
  });
  if (!item) notFound();

  const seo = await resolveSeo("casino", { ...item, name: item.name });
  const reviewLd = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: { "@type": "Organization", name: item.name },
    reviewRating: {
      "@type": "Rating",
      ratingValue: item.rating,
      bestRating: 10,
    },
    author: item.author
      ? { "@type": "Person", name: item.author.name }
      : { "@type": "Organization", name: seo.siteName },
    reviewBody: item.verdict || item.body.replace(/<[^>]+>/g, "").slice(0, 300),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Casinos", item: "/casinos" },
      { "@type": "ListItem", position: 3, name: item.name },
    ],
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <JsonLd data={reviewLd} />
      <JsonLd data={breadcrumbLd} />
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm text-[var(--muted)]">Casino review</p>
          <h1 className="mt-1 font-[family-name:var(--font-display)] text-4xl font-semibold">
            {item.name}
          </h1>
          <p className="mt-3 text-lg text-[var(--muted)]">{item.verdict}</p>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 text-center">
          <p className="text-xs uppercase tracking-wide text-[var(--muted)]">Rating</p>
          <p className="text-4xl font-semibold text-[var(--brand)]">{item.rating.toFixed(1)}</p>
          <div className="mt-3">
            <CtaButton label={item.ctaLabel} url={item.ctaUrl} tracking={item.ctaTracking} />
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Info label="Min deposit" value={item.minDeposit} />
        <Info label="Payout speed" value={item.payoutSpeed} />
        <Info label="Bonus" value={item.bonusHighlight} />
      </div>

      <div className="mt-8">
        <ProsCons pros={parseJsonArray(item.pros)} cons={parseJsonArray(item.cons)} />
      </div>

      <article
        className="prose-cms mt-8 max-w-3xl"
        dangerouslySetInnerHTML={{ __html: item.body }}
      />

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
