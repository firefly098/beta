import { RankedCasinosTable } from "@/themes/default/ComparisonTable";
import { HeroVisual } from "@/themes/default/HeroVisual";
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

const categories = [
  { label: "Top Casinos", sub: "Best overall", href: "/casinos", icon: "🏆" },
  { label: "New Casinos", sub: "Fresh brands", href: "/casinos", icon: "✨" },
  { label: "No Deposit", sub: "Free offers", href: "/bonuses", icon: "🎁" },
  { label: "High Rollers", sub: "VIP play", href: "/casinos", icon: "💎" },
  { label: "Live Casino", sub: "Real dealers", href: "/casinos", icon: "🎥" },
  { label: "Slots", sub: "Top titles", href: "/casinos", icon: "🎰" },
  { label: "Bookmakers", sub: "Sports odds", href: "/bookmakers", icon: "⚽" },
  { label: "All Casinos", sub: "Full list", href: "/casinos", icon: "📋" },
];

export default async function HomePage() {
  const [config, settings] = await Promise.all([getHomepageConfig(), getSiteSettings()]);
  const faq = parseJsonObjectArray<{ question: string; answer: string }>(config.faqItems);
  const featuredCasinoIds = parseJsonArray(config.featuredCasinoIds);
  const featuredBonusIds = parseJsonArray(config.featuredBonusIds);

  const rankedFromRows = [];
  for (const row of config.rows) {
    if (row.entityType !== "CASINO") continue;
    const c = await prisma.casinoReview.findFirst({
      where: { id: row.entityId, ...publishedWhere },
      include: { logo: true },
    });
    if (c) {
      rankedFromRows.push({
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
        logoUrl: c.logo?.url,
        logoBackground: c.logoBackground,
      });
    }
  }

  let ranked = rankedFromRows;
  if (ranked.length === 0) {
    const fallback = await prisma.casinoReview.findMany({
      where: publishedWhere,
      orderBy: { rating: "desc" },
      take: 5,
      include: { logo: true },
    });
    ranked = fallback.map((c) => ({
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
      logoUrl: c.logo?.url,
      logoBackground: c.logoBackground,
    }));
  }

  const latest = await prisma.casinoReview.findMany({
    where: publishedWhere,
    orderBy: { updatedAt: "desc" },
    take: 3,
    include: { logo: true },
  });

  const deal =
    featuredBonusIds.length > 0
      ? await prisma.bonusReview.findFirst({
          where: { id: { in: featuredBonusIds }, ...publishedWhere },
          include: { casino: true },
        })
      : await prisma.bonusReview.findFirst({
          where: publishedWhere,
          orderBy: { updatedAt: "desc" },
          include: { casino: true },
        });

  const featuredCasinos =
    featuredCasinoIds.length > 0
      ? await prisma.casinoReview.findMany({
          where: { id: { in: featuredCasinoIds }, ...publishedWhere },
          include: { logo: true },
        })
      : [];

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: settings.siteName,
          description: settings.tagline || settings.affiliateDisclosure,
        }}
      />
      {faq.length > 0 ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          }}
        />
      ) : null}

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="site-shell grid items-center gap-10 py-12 md:grid-cols-2 md:py-16">
          <div>
            <span className="animate-rise inline-flex rounded-full bg-[var(--brand-soft)] px-3 py-1 text-xs font-bold text-[var(--brand)]">
              Independent Reviews, Real Experiences, Trusted Rankings
            </span>
            <h1 className="animate-rise mt-5 font-display text-[clamp(2.4rem,5vw,3.6rem)] font-extrabold leading-[1.05] tracking-tight text-[var(--ink)]">
              Find the Best Casinos.{" "}
              <span className="text-[var(--brand)]">Play with Confidence.</span>
            </h1>
            <p className="animate-rise-2 mt-4 max-w-md text-[15px] leading-relaxed text-[var(--muted)]">
              {config.heroSubtitle ||
                "Compare licensed operators, welcome bonuses, and payout speed before you play."}
            </p>
            <div className="animate-rise-2 mt-7 flex flex-wrap gap-3">
              <Link href="/casinos" className="btn-primary">
                Browse Top Casinos
              </Link>
              <Link href="/bonuses" className="btn-secondary">
                View Best Bonuses
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["Expert Reviews", "Editorial scores"],
                ["Verified & Safe", "License checks"],
                ["Best Bonuses", "Clear terms"],
                ["Fresh Updates", "Always current"],
              ].map(([title, sub]) => (
                <div key={title} className="rounded-2xl border border-[var(--line)] bg-white/80 p-3">
                  <p className="text-xs font-bold text-[var(--ink)]">{title}</p>
                  <p className="mt-0.5 text-[11px] text-[var(--muted)]">{sub}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 text-[var(--muted)]">
              <Disclosure text={settings.affiliateDisclosure} />
            </div>
          </div>
          <HeroVisual />
        </div>
      </section>

      {/* Categories */}
      <section className="border-y border-[var(--line)] bg-white/70 py-8">
        <div className="site-shell grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="group rounded-2xl border border-[var(--line)] bg-white p-3 text-center shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-[var(--brand)]/30"
            >
              <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-[var(--brand-soft)] text-lg">
                {cat.icon}
              </span>
              <p className="mt-2 text-xs font-bold text-[var(--ink)]">{cat.label}</p>
              <p className="text-[10px] text-[var(--muted)]">{cat.sub}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Ranked table */}
      <section className="site-shell py-12 md:py-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-[var(--ink)] md:text-3xl">
              Top Rated Casinos
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">Ranked by our editorial score</p>
          </div>
          <Link href="/casinos" className="text-sm font-bold text-[var(--brand)] hover:underline">
            View all casinos
          </Link>
        </div>
        <RankedCasinosTable rows={ranked} />
      </section>

      {/* Trust trio */}
      <section className="site-shell grid gap-4 pb-14 md:grid-cols-3">
        <div className="rounded-[1.4rem] bg-gradient-to-br from-[var(--brand)] to-[#4c1d95] p-6 text-white shadow-[var(--shadow)]">
          <h3 className="font-display text-xl font-bold">Why Trust Us</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/85">
            <li>Independent & unbiased reviews</li>
            <li>Hands-on bonus testing</li>
            <li>License and payout checks</li>
            <li>Updated rankings regularly</li>
          </ul>
          <Link
            href="/pages/about"
            className="mt-6 inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold text-[var(--brand)]"
          >
            Learn More About Us
          </Link>
        </div>

        <div className="rounded-[1.4rem] border border-[var(--line)] bg-[var(--brand-soft)] p-6 shadow-[var(--shadow-soft)]">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand)]">
            Exclusive Deal
          </p>
          <h3 className="mt-2 font-display text-xl font-bold text-[var(--ink)]">
            {deal?.title || "Featured welcome bonus"}
          </h3>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {deal?.amount || "Check the latest offers from top-rated casinos."}
          </p>
          {deal?.casino ? (
            <p className="mt-2 text-xs font-semibold text-[var(--ink)]">{deal.casino.name}</p>
          ) : null}
          <div className="mt-5 flex gap-2 text-center text-xs font-bold text-[var(--brand)]">
            {["24", "12", "45"].map((n, i) => (
              <div key={i} className="min-w-14 rounded-xl bg-white px-2 py-2 shadow-sm">
                <div className="text-lg">{n}</div>
                <div className="text-[10px] text-[var(--muted)]">{["HRS", "MIN", "SEC"][i]}</div>
              </div>
            ))}
          </div>
          <Link
            href={deal ? `/bonuses/${deal.slug}` : "/bonuses"}
            className="btn-primary mt-6 w-full"
          >
            Claim This Deal
          </Link>
        </div>

        <div className="surface p-6">
          <h3 className="font-display text-xl font-bold text-[var(--ink)]">Latest Reviews</h3>
          <div className="mt-4 space-y-4">
            {latest.map((item) => (
              <Link key={item.id} href={`/casinos/${item.slug}`} className="flex gap-3 group">
                <div className="shrink-0">
                  {item.logo ? (
                    <OperatorLogoMini
                      src={item.logo.url}
                      background={item.logoBackground}
                      name={item.name}
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-xl bg-[var(--wash)]" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--brand)]">
                    Casino Reviews
                  </p>
                  <p className="truncate font-bold text-[var(--ink)] group-hover:text-[var(--brand)]">
                    {item.name} Review
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    {item.updatedAt.toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {featuredCasinos.length > 0 ? (
        <section className="border-t border-[var(--line)] bg-white/60 py-12">
          <div className="site-shell">
            <h2 className="font-display text-2xl font-bold tracking-tight">More featured casinos</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCasinos.map((c) => (
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
          </div>
        </section>
      ) : null}
    </main>
  );
}

function OperatorLogoMini({
  src,
  background,
  name,
}: {
  src: string;
  background?: string | null;
  name: string;
}) {
  return (
    <div
      className="flex h-12 w-12 items-center justify-center rounded-xl border border-black/5 p-1.5"
      style={{ backgroundColor: background || "#1a1230" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={name} className="max-h-full max-w-full object-contain" />
    </div>
  );
}
