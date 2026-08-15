import { ComparisonTable } from "@/themes/default/ComparisonTable";
import { ReviewCard } from "@/themes/default/ReviewCard";
import { Disclosure, JsonLd } from "@/themes/default/ui";
import { prisma } from "@/lib/prisma";
import { publishedWhere } from "@/lib/publish";
import { getHomepageConfig, getSiteSettings, resolveSeo } from "@/lib/site";
import { parseJsonArray, parseJsonObjectArray } from "@/lib/utils";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await resolveSeo("home");
  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: seo.ogImage ? [seo.ogImage] : undefined,
    },
  };
}

export default async function HomePage() {
  const [config, settings] = await Promise.all([getHomepageConfig(), getSiteSettings()]);
  const sections = parseJsonArray(config.sections);
  const columns = parseJsonArray(config.comparisonColumns);
  const faq = parseJsonObjectArray<{ question: string; answer: string }>(config.faqItems);

  const featuredCasinoIds = parseJsonArray(config.featuredCasinoIds);
  const featuredBookmakerIds = parseJsonArray(config.featuredBookmakerIds);
  const featuredBonusIds = parseJsonArray(config.featuredBonusIds);

  const [casinos, bookmakers, bonuses] = await Promise.all([
    featuredCasinoIds.length
      ? prisma.casinoReview.findMany({
          where: { id: { in: featuredCasinoIds }, ...publishedWhere },
        })
      : Promise.resolve([]),
    featuredBookmakerIds.length
      ? prisma.bookmakerReview.findMany({
          where: { id: { in: featuredBookmakerIds }, ...publishedWhere },
        })
      : Promise.resolve([]),
    featuredBonusIds.length
      ? prisma.bonusReview.findMany({
          where: { id: { in: featuredBonusIds }, ...publishedWhere },
        })
      : Promise.resolve([]),
  ]);

  const comparisonRows: {
    id: string;
    name: string;
    href: string;
    rating: number;
    bonusHighlight: string;
    payoutSpeed: string;
    licenses: string;
    ctaLabel: string;
    ctaUrl: string;
    ctaTracking: string;
  }[] = [];
  for (const row of config.rows) {
    if (row.entityType === "CASINO") {
      const c = await prisma.casinoReview.findFirst({
        where: { id: row.entityId, ...publishedWhere },
      });
      if (c) {
        comparisonRows.push({
          id: c.id,
          name: c.name,
          href: `/casinos/${c.slug}`,
          rating: c.rating,
          bonusHighlight: c.bonusHighlight,
          payoutSpeed: c.payoutSpeed,
          licenses: c.licenses,
          ctaLabel: c.ctaLabel,
          ctaUrl: c.ctaUrl,
          ctaTracking: c.ctaTracking,
        });
      }
    } else {
      const b = await prisma.bookmakerReview.findFirst({
        where: { id: row.entityId, ...publishedWhere },
      });
      if (b) {
        comparisonRows.push({
          id: b.id,
          name: b.name,
          href: `/bookmakers/${b.slug}`,
          rating: b.rating,
          bonusHighlight: b.bonusHighlight,
          payoutSpeed: b.payoutSpeed,
          licenses: b.licenses,
          ctaLabel: b.ctaLabel,
          ctaUrl: b.ctaUrl,
          ctaTracking: b.ctaTracking,
        });
      }
    }
  }

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.siteName,
    description: settings.tagline || settings.affiliateDisclosure,
  };

  const faqLd =
    faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  return (
    <main>
      <JsonLd data={orgLd} />
      {faqLd ? <JsonLd data={faqLd} /> : null}

      {sections.map((section) => {
        if (section === "hero") {
          return (
            <section
              key="hero"
              className="border-b border-[var(--line)] bg-[linear-gradient(160deg,#0f7a4c_0%,#134e36_55%,#0b2e20_100%)] text-white"
            >
              <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100">
                  {settings.siteName}
                </p>
                <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl leading-tight md:text-5xl">
                  {config.heroTitle}
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-emerald-50">{config.heroSubtitle}</p>
                <Link
                  href={config.heroCtaUrl || "/casinos"}
                  className="mt-8 inline-flex rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-[var(--brand)]"
                >
                  {config.heroCtaLabel || "Browse casinos"}
                </Link>
                <div className="mt-6">
                  <Disclosure text={settings.affiliateDisclosure} />
                </div>
              </div>
            </section>
          );
        }

        if (section === "featuredCasinos") {
          return (
            <section key="featuredCasinos" className="mx-auto max-w-6xl px-4 py-12">
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
                Featured casinos
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {casinos.map((c) => (
                  <ReviewCard
                    key={c.id}
                    title={c.name}
                    href={`/casinos/${c.slug}`}
                    rating={c.rating}
                    summary={c.verdict || c.bonusHighlight}
                  />
                ))}
              </div>
            </section>
          );
        }

        if (section === "featuredBookmakers" || section === "featuredBonuses") {
          const isBonus = section === "featuredBonuses";
          return (
            <section key={section} className="mx-auto max-w-6xl px-4 py-12">
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
                {isBonus ? "Featured bonuses" : "Featured bookmakers"}
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {isBonus
                  ? bonuses.map((c) => (
                      <ReviewCard
                        key={c.id}
                        title={c.title}
                        href={`/bonuses/${c.slug}`}
                        summary={c.amount}
                      />
                    ))
                  : bookmakers.map((c) => (
                      <ReviewCard
                        key={c.id}
                        title={c.name}
                        href={`/bookmakers/${c.slug}`}
                        rating={c.rating}
                        summary={c.verdict || c.bonusHighlight}
                      />
                    ))}
              </div>
            </section>
          );
        }

        if (section === "comparison") {
          return (
            <section key="comparison" className="mx-auto max-w-6xl px-4 py-12">
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
                Compare top operators
              </h2>
              <p className="mt-2 text-[var(--muted)]">Ratings, bonuses, and payout speed side by side.</p>
              <div className="mt-6">
                <ComparisonTable rows={comparisonRows} columns={columns} />
              </div>
            </section>
          );
        }

        if (section === "faq") {
          return (
            <section key="faq" className="mx-auto max-w-6xl px-4 py-12">
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold">FAQ</h2>
              <div className="mt-6 space-y-4">
                {faq.map((f) => (
                  <details
                    key={f.question}
                    className="rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3"
                  >
                    <summary className="cursor-pointer font-medium">{f.question}</summary>
                    <p className="mt-2 text-sm text-[var(--muted)]">{f.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          );
        }

        if (section === "trust") {
          return (
            <section
              key="trust"
              className="border-y border-[var(--line)] bg-[var(--surface)] py-12"
            >
              <div className="mx-auto max-w-6xl px-4">
                <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
                  Play responsibly
                </h2>
                <p className="mt-3 max-w-3xl text-[var(--muted)]">{settings.rgFooterText}</p>
                <p className="mt-2 text-sm font-semibold">{settings.ageNotice} only</p>
              </div>
            </section>
          );
        }

        return null;
      })}
    </main>
  );
}
