import { ComparisonTable } from "@/themes/default/ComparisonTable";
import { ReviewCard } from "@/themes/default/ReviewCard";
import { Disclosure, JsonLd, SectionHeading } from "@/themes/default/ui";
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
          include: { logo: true },
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
            <section key="hero" className="relative overflow-hidden border-b border-[var(--line)]">
              <div className="absolute inset-0 bg-[var(--ink)]" />
              <div className="absolute inset-y-0 right-0 w-[42%] bg-[radial-gradient(circle_at_30%_40%,rgba(184,240,0,0.22),transparent_60%)]" />
              <div className="site-shell relative py-16 md:py-24">
                <p className="animate-fade text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                  {settings.siteName}
                </p>
                <h1 className="animate-reveal mt-5 max-w-[14ch] font-display text-[clamp(2.6rem,8vw,4.6rem)] font-semibold leading-[0.95] tracking-tight text-white">
                  {config.heroTitle}
                </h1>
                <div className="accent-line mt-6 h-px w-24 bg-[var(--accent)]" />
                <p className="animate-reveal-2 mt-6 max-w-md text-[15px] leading-relaxed text-white/65">
                  {config.heroSubtitle}
                </p>
                <div className="animate-reveal-3 mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    href={config.heroCtaUrl || "/casinos"}
                    className="inline-flex rounded-md bg-[var(--accent)] px-4 py-2.5 text-[13px] font-semibold text-[var(--accent-ink)] transition hover:brightness-95"
                  >
                    {config.heroCtaLabel || "Browse casinos"}
                  </Link>
                  <Link
                    href="/bookmakers"
                    className="text-[13px] font-medium text-white/70 transition hover:text-white"
                  >
                    Bookmakers
                  </Link>
                </div>
                <div className="mt-8 max-w-md text-white/40">
                  <Disclosure text={settings.affiliateDisclosure} />
                </div>
              </div>
            </section>
          );
        }

        if (section === "featuredCasinos") {
          return (
            <section key="featuredCasinos" className="site-shell py-14 md:py-16">
              <SectionHeading
                eyebrow="Casinos"
                title="Featured reviews"
                subtitle="Licensing, payments, and bonuses without the fluff."
              />
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {casinos.map((c) => (
                  <ReviewCard
                    key={c.id}
                    meta="Casino"
                    title={c.name}
                    href={`/casinos/${c.slug}`}
                    rating={c.rating}
                    summary={c.verdict || c.bonusHighlight}
                    logoUrl={c.logo?.url}
                    logoBackground={c.logoBackground}
                  />
                ))}
              </div>
            </section>
          );
        }

        if (section === "featuredBookmakers" || section === "featuredBonuses") {
          const isBonus = section === "featuredBonuses";
          return (
            <section key={section} className="site-shell py-14 md:py-16">
              <SectionHeading
                eyebrow={isBonus ? "Bonuses" : "Bookmakers"}
                title={isBonus ? "Featured bonuses" : "Featured bookmakers"}
                subtitle={
                  isBonus
                    ? "Amounts, wagering, and terms explained clearly."
                    : "Odds, markets, apps, and payout reliability."
                }
              />
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {isBonus
                  ? bonuses.map((c) => (
                      <ReviewCard
                        key={c.id}
                        meta="Bonus"
                        title={c.title}
                        href={`/bonuses/${c.slug}`}
                        summary={c.amount}
                      />
                    ))
                  : bookmakers.map((c) => (
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
            </section>
          );
        }

        if (section === "comparison") {
          return (
            <section key="comparison" className="border-y border-[var(--line)] bg-[var(--surface)] py-14 md:py-16">
              <div className="site-shell">
                <SectionHeading
                  eyebrow="Compare"
                  title="Side by side"
                  subtitle="Ratings, bonuses, and payout speed."
                />
                <div className="mt-8">
                  <ComparisonTable rows={comparisonRows} columns={columns} />
                </div>
              </div>
            </section>
          );
        }

        if (section === "faq") {
          return (
            <section key="faq" className="site-shell py-14 md:py-16">
              <SectionHeading eyebrow="FAQ" title="Questions" />
              <div className="mt-8 space-y-2">
                {faq.map((f) => (
                  <details key={f.question} className="surface group px-4 py-3.5 open:bg-[var(--wash)]/40">
                    <summary className="cursor-pointer list-none text-[15px] font-semibold text-[var(--ink)] marker:content-none">
                      <span className="flex items-center justify-between gap-4">
                        {f.question}
                        <span className="text-[var(--muted)] transition group-open:rotate-45">+</span>
                      </span>
                    </summary>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{f.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          );
        }

        if (section === "trust") {
          return (
            <section key="trust" className="border-t border-[var(--line)] bg-[var(--ink)] py-14 text-white">
              <div className="site-shell">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                  Trust
                </p>
                <h2 className="mt-3 max-w-lg font-display text-[clamp(1.8rem,4vw,2.5rem)] font-semibold tracking-tight">
                  Play responsibly
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/60">{settings.rgFooterText}</p>
                <p className="mt-5 text-[11px] font-semibold tracking-[0.14em]">{settings.ageNotice} ONLY</p>
              </div>
            </section>
          );
        }

        return null;
      })}
    </main>
  );
}
