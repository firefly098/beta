import { CtaButton, JsonLd, ProsCons, RgBlock } from "@/themes/default/ui";
import { OperatorLogo } from "@/themes/default/OperatorLogo";
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
  const licenses = parseJsonArray(item.licenses);
  const payments = parseJsonArray(item.payments);
  const providers = parseJsonArray(item.providers);

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
          reviewBody: item.verdict || item.body.replace(/<[^>]+>/g, "").slice(0, 300),
        }}
      />

      <section className="border-b border-[var(--line)] bg-[var(--surface)]">
        <div className="site-shell py-10 md:py-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
            <Link href="/casinos" className="hover:text-[var(--ink)]">
              Casinos
            </Link>
            <span className="mx-2 opacity-40">/</span>
            Review
          </p>

          <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0 flex-1">
              <OperatorLogo
                name={item.name}
                src={item.logo?.url}
                background={item.logoBackground}
                size="lg"
              />
              <h1 className="mt-5 font-display text-[clamp(2rem,5vw,3.2rem)] font-semibold leading-[1.02] tracking-tight">
                {item.name}
              </h1>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--muted)]">
                {item.verdict}
              </p>
              {item.author ? (
                <p className="mt-4 text-xs text-[var(--muted)]">By {item.author.name}</p>
              ) : null}
            </div>

            <div className="surface w-full shrink-0 p-5 md:w-56">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Score
              </p>
              <p className="mt-2 font-display text-5xl font-semibold tracking-tight">
                {item.rating.toFixed(1)}
              </p>
              <div className="mt-4">
                <CtaButton label={item.ctaLabel} url={item.ctaUrl} tracking={item.ctaTracking} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="site-shell py-10">
        <div className="grid gap-3 sm:grid-cols-3">
          <Info label="Min deposit" value={item.minDeposit} />
          <Info label="Payout speed" value={item.payoutSpeed} />
          <Info label="Welcome bonus" value={item.bonusHighlight} />
        </div>

        <div className="mt-8">
          <ProsCons pros={parseJsonArray(item.pros)} cons={parseJsonArray(item.cons)} />
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-3">
          <ChipList title="Licenses" items={licenses} />
          <ChipList title="Payments" items={payments} />
          <ChipList title="Providers" items={providers} />
        </div>

        <article className="prose-cms mt-12 max-w-2xl" dangerouslySetInnerHTML={{ __html: item.body }} />

        <div className="surface mt-10 flex flex-wrap items-center gap-4 p-4">
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg font-semibold tracking-tight">{item.name}</p>
            <p className="mt-1 truncate text-sm text-[var(--muted)]">{item.bonusHighlight}</p>
          </div>
          <CtaButton label={item.ctaLabel} url={item.ctaUrl} tracking={item.ctaTracking} />
        </div>

        <RgBlock text={seo.settings.rgFooterText} />
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-sm font-semibold leading-snug text-[var(--ink)]">{value || "—"}</p>
    </div>
  );
}

function ChipList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="surface p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">{title}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {items.length === 0 ? <span className="text-sm text-[var(--muted)]">—</span> : null}
        {items.map((item) => (
          <span
            key={item}
            className="rounded-md bg-[var(--wash)] px-2 py-1 text-[11px] font-medium text-[var(--ink)]"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
