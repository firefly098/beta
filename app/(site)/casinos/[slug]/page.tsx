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
    <main>
      <JsonLd data={reviewLd} />
      <JsonLd data={breadcrumbLd} />

      <section className="relative overflow-hidden border-b border-black/20 bg-[linear-gradient(145deg,var(--hero-from),var(--hero-via)_50%,var(--hero-to))] text-white">
        <div className="hero-grid absolute inset-0 opacity-50" />
        <div className="site-shell relative py-12 md:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
            <Link href="/casinos" className="hover:underline">
              Casinos
            </Link>{" "}
            / Review
          </p>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
            <div>
              <div className="mb-5">
                <OperatorLogo
                  name={item.name}
                  src={item.logo?.url}
                  background={item.logoBackground}
                  size="lg"
                />
              </div>
              <h1 className="animate-rise font-display text-4xl font-semibold tracking-tight md:text-5xl">
                {item.name} Review
              </h1>
              <p className="animate-rise-delay mt-4 max-w-2xl text-lg text-white/75">{item.verdict}</p>
              {item.author ? (
                <p className="mt-4 text-sm text-white/55">By {item.author.name}</p>
              ) : null}
            </div>
            <div className="animate-rise rounded-[1.25rem] border border-white/15 bg-white/10 p-5 backdrop-blur-md">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/60">Our score</p>
              <p className="mt-2 font-display text-5xl font-semibold text-white">
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
          <Info label="Min deposit" value={item.minDeposit} />
          <Info label="Payout speed" value={item.payoutSpeed} />
          <Info label="Welcome bonus" value={item.bonusHighlight} />
        </div>

        <div className="mt-10">
          <ProsCons pros={parseJsonArray(item.pros)} cons={parseJsonArray(item.cons)} />
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <ChipList title="Licenses" items={licenses} />
          <ChipList title="Payments" items={payments} />
          <ChipList title="Providers" items={providers} />
        </div>

        <article
          className="prose-cms mt-12 max-w-3xl"
          dangerouslySetInnerHTML={{ __html: item.body }}
        />

        <div className="mt-10 flex flex-wrap items-center gap-4 rounded-[1.25rem] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]">
          <div className="flex-1">
            <p className="font-display text-xl font-semibold">{item.name}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{item.bonusHighlight}</p>
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
    <div className="rounded-[1.1rem] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-lg font-semibold text-[var(--ink)]">{value || "—"}</p>
    </div>
  );
}

function ChipList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-[1.1rem] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.length === 0 ? <span className="text-sm text-[var(--muted)]">—</span> : null}
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full bg-[var(--wash)] px-3 py-1 text-xs font-semibold text-[var(--ink)]"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
