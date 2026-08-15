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
            <section
              key="hero"
              className="relative overflow-hidden border-b border-black/20 bg-[linear-gradient(145deg,var(--hero-from),var(--hero-via)_45%,var(--hero-to))] text-white"
            >
              <div className="hero-grid absolute inset-0 opacity-60" />
              <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-[var(--brand)]/30 blur-3xl" />
              <div className="absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-[var(--accent)]/20 blur-3xl" />
              <div className="site-shell relative py-20 md:py-28">
                <p className="animate-fade text-xs font-bold uppercase tracking-[0.22em] text-[var(--accent)]">
                  {settings.siteName}
                </p>
                <h1 className="animate-rise mt-5 max-w-3xl font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
                  {config.heroTitle}
                </h1>
                <p className="animate-rise-delay mt-5 max-w-xl text-lg text-white/75">
                  {config.heroSubtitle}
                </p>
                <div className="animate-rise-delay mt-9 flex flex-wrap items-center gap-4">
                  <Link
                    href={config.heroCtaUrl || "/casinos"}
                    className="cta-pulse inline-flex rounded-full bg-white px-6 py-3 text-sm font-bold text-[var(--ink)] shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5"
                  >
                    {config.heroCtaLabel || "Browse casinos"}
                  </Link>
                  <Link
                    href="/bookmakers"
                    className="text-sm font-semibold text-white/80 hover:text-white"
                  >
                    Compare bookmakers →
                  </Link>
                </div>
                <div className="mt-8 max-w-xl text-white/55">
                  <Disclosure text={settings.affiliateDisclosure} />
                </div>
              </div>
            </section>
          );
        }

        if (section === "featuredCasinos") {
          return (
            <section key="featuredCasinos" className="site-shell py-16 md:py-20">
              <SectionHeading
                eyebrow="Casinos"
                title="Featured casino reviews"
                subtitle="Licensing, payments, and bonuses broken down without the fluff."
              />
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
            <section key={section} className="site-shell py-16 md:py-20">
              <SectionHeading
                eyebrow={isBonus ? "Bonuses" : "Bookmakers"}
                title={isBonus ? "Featured bonus reviews" : "Featured bookmaker reviews"}
                subtitle={
                  isBonus
                    ? "Wagering, amounts, and terms explained clearly."
                    : "Odds, markets, apps, and payout reliability."
                }
              />
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
            <section key="comparison" className="border-y border-[var(--line)] bg-[var(--surface)]/70 py-16 md:py-20">
              <div className="site-shell">
                <SectionHeading
                  eyebrow="Compare"
                  title="Top operators side by side"
                  subtitle="Ratings, bonuses, and payout speed in one table."
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
            <section key="faq" className="site-shell py-16 md:py-20">
              <SectionHeading eyebrow="FAQ" title="Common questions" />
              <div className="mt-8 space-y-3">
                {faq.map((f) => (
                  <details
                    key={f.question}
                    className="group rounded-[1.1rem] border border-[var(--line)] bg-[var(--surface)] px-5 py-4 shadow-[var(--shadow)] open:border-[var(--brand)]/30"
                  >
                    <summary className="cursor-pointer list-none font-semibold text-[var(--ink)] marker:content-none">
                      <span className="flex items-center justify-between gap-4">
                        {f.question}
                        <span className="text-[var(--muted)] transition group-open:rotate-45">+</span>
                      </span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{f.answer}</p>
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
              className="border-t border-[var(--line)] bg-[linear-gradient(180deg,#0e1525_0%,#163053_100%)] py-16 text-white"
            >
              <div className="site-shell">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
                  Trust
                </p>
                <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight md:text-4xl">
                  Play responsibly
                </h2>
                <p className="mt-4 max-w-2xl text-white/70">{settings.rgFooterText}</p>
                <p className="mt-5 text-sm font-bold tracking-wide">{settings.ageNotice} only</p>
              </div>
            </section>
          );
        }

        return null;
      })}
    </main>
  );
}
