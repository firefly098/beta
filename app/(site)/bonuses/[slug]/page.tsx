import { CtaButton, JsonLd, RgBlock } from "@/themes/default/ui";
import { prisma } from "@/lib/prisma";
import { publishedWhere } from "@/lib/publish";
import { resolveSeo } from "@/lib/site";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await prisma.bonusReview.findFirst({
    where: { slug, ...publishedWhere },
    include: { ogImage: true },
  });
  if (!item) return {};
  const seo = await resolveSeo("bonus", { ...item, name: item.title, title: item.title });
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

export default async function BonusReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await prisma.bonusReview.findFirst({
    where: { slug, ...publishedWhere },
    include: { casino: true, bookmaker: true, author: true },
  });
  if (!item) notFound();
  const seo = await resolveSeo("bonus", { ...item, name: item.title, title: item.title });

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Review",
          name: item.title,
          author: item.author
            ? { "@type": "Person", name: item.author.name }
            : { "@type": "Organization", name: seo.siteName },
        }}
      />
      <p className="text-sm text-[var(--muted)]">Bonus review · {item.bonusType}</p>
      <h1 className="mt-1 font-[family-name:var(--font-display)] text-4xl font-semibold">
        {item.title}
      </h1>
      <p className="mt-3 text-xl font-medium text-[var(--brand)]">{item.amount}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <CtaButton label={item.ctaLabel} url={item.ctaUrl} tracking={item.ctaTracking} />
        {item.casino ? (
          <Link href={`/casinos/${item.casino.slug}`} className="text-sm underline">
            {item.casino.name} review
          </Link>
        ) : null}
        {item.bookmaker ? (
          <Link href={`/bookmakers/${item.bookmaker.slug}`} className="text-sm underline">
            {item.bookmaker.name} review
          </Link>
        ) : null}
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Info label="Wagering" value={item.wagering} />
        <Info label="T&Cs summary" value={item.termsSummary} />
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
