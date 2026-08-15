import { PrismaClient, PublishStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const author = await prisma.author.upsert({
    where: { slug: "editorial-team" },
    update: {},
    create: {
      name: "Editorial Team",
      slug: "editorial-team",
      bio: "Our editors research operators, bonuses, and payments so you can bet smarter.",
    },
  });

  const oneXBet = await prisma.casinoReview.upsert({
    where: { slug: "1xbet" },
    update: {
      name: "1xBet",
      body: `<h2>Overview</h2>
<p>1xBet is a global betting and casino brand known for huge market coverage, aggressive promotions, and a casino lobby that sits beside its sportsbook. This review focuses on the casino side: games, payments, bonuses, and day-to-day usability.</p>
<h2>Games and providers</h2>
<p>The casino catalogue is broad — slots, live dealer tables, crash titles, and instant games. Provider depth is a real strength, so regular players usually find both mainstream studios and niche releases without hunting through empty categories.</p>
<h2>Bonuses</h2>
<p>Welcome packaging is typically competitive on paper, but wagering and contribution rules matter. Read the bonus terms carefully before opting in, especially max bet and game weighting rules.</p>
<h2>Banking</h2>
<p>Payment option count is high across cards, e-wallets, and crypto depending on region. Deposit speed is usually instant; withdrawals vary by method and verification status.</p>
<h2>Verdict</h2>
<p>1xBet suits players who want volume — lots of games, lots of markets, lots of promos. If you value a quieter premium boutique casino experience, look elsewhere. If you want choice and constant action, it remains a strong contender.</p>`,
      rating: 8.4,
      pros: JSON.stringify([
        "Massive game and live-casino selection",
        "Frequent promotions and combo products",
        "Strong multi-currency / crypto support in many markets",
        "Sports + casino in one account",
      ]),
      cons: JSON.stringify([
        "Interface can feel crowded for new users",
        "Bonus terms need careful reading",
        "Support quality can vary by region and channel",
      ]),
      licenses: JSON.stringify(["Curacao", "Other regional licenses (varies by market)"]),
      payments: JSON.stringify([
        "Visa",
        "Mastercard",
        "Skrill",
        "Neteller",
        "Crypto",
        "Local methods",
      ]),
      providers: JSON.stringify([
        "Pragmatic Play",
        "NetEnt",
        "Evolution",
        "Play'n GO",
        "Microgaming",
        "Many more",
      ]),
      minDeposit: "From €1 (method/region dependent)",
      payoutSpeed: "Often same day after KYC; method-dependent",
      verdict:
        "A high-volume global casino and betting brand: enormous choice and promotions, with a busier UI and terms you should read closely.",
      bonusHighlight: "Welcome package up to high-tier match + free spins (offer varies by region)",
      ctaLabel: "Visit 1xBet",
      ctaUrl: "https://1xbet.com",
      status: PublishStatus.PUBLISHED,
      publishedAt: new Date(),
      authorId: author.id,
      seoTitle: "1xBet Casino Review 2026 — Bonus, Games & Payouts",
      seoDescription:
        "Independent 1xBet casino review: ratings, welcome bonus, payments, game providers, pros and cons, and final verdict.",
    },
    create: {
      name: "1xBet",
      slug: "1xbet",
      body: `<h2>Overview</h2>
<p>1xBet is a global betting and casino brand known for huge market coverage, aggressive promotions, and a casino lobby that sits beside its sportsbook. This review focuses on the casino side: games, payments, bonuses, and day-to-day usability.</p>
<h2>Games and providers</h2>
<p>The casino catalogue is broad — slots, live dealer tables, crash titles, and instant games. Provider depth is a real strength, so regular players usually find both mainstream studios and niche releases without hunting through empty categories.</p>
<h2>Bonuses</h2>
<p>Welcome packaging is typically competitive on paper, but wagering and contribution rules matter. Read the bonus terms carefully before opting in, especially max bet and game weighting rules.</p>
<h2>Banking</h2>
<p>Payment option count is high across cards, e-wallets, and crypto depending on region. Deposit speed is usually instant; withdrawals vary by method and verification status.</p>
<h2>Verdict</h2>
<p>1xBet suits players who want volume — lots of games, lots of markets, lots of promos. If you value a quieter premium boutique casino experience, look elsewhere. If you want choice and constant action, it remains a strong contender.</p>`,
      rating: 8.4,
      pros: JSON.stringify([
        "Massive game and live-casino selection",
        "Frequent promotions and combo products",
        "Strong multi-currency / crypto support in many markets",
        "Sports + casino in one account",
      ]),
      cons: JSON.stringify([
        "Interface can feel crowded for new users",
        "Bonus terms need careful reading",
        "Support quality can vary by region and channel",
      ]),
      licenses: JSON.stringify(["Curacao", "Other regional licenses (varies by market)"]),
      payments: JSON.stringify([
        "Visa",
        "Mastercard",
        "Skrill",
        "Neteller",
        "Crypto",
        "Local methods",
      ]),
      providers: JSON.stringify([
        "Pragmatic Play",
        "NetEnt",
        "Evolution",
        "Play'n GO",
        "Microgaming",
        "Many more",
      ]),
      minDeposit: "From €1 (method/region dependent)",
      payoutSpeed: "Often same day after KYC; method-dependent",
      verdict:
        "A high-volume global casino and betting brand: enormous choice and promotions, with a busier UI and terms you should read closely.",
      bonusHighlight: "Welcome package up to high-tier match + free spins (offer varies by region)",
      ctaLabel: "Visit 1xBet",
      ctaUrl: "https://1xbet.com",
      status: PublishStatus.PUBLISHED,
      publishedAt: new Date(),
      authorId: author.id,
      seoTitle: "1xBet Casino Review 2026 — Bonus, Games & Payouts",
      seoDescription:
        "Independent 1xBet casino review: ratings, welcome bonus, payments, game providers, pros and cons, and final verdict.",
    },
  });

  const home = await prisma.homepageConfig.findUnique({ where: { id: 1 } });
  const featured = home ? JSON.parse(home.featuredCasinoIds || "[]") as string[] : [];
  if (!featured.includes(oneXBet.id)) {
    featured.unshift(oneXBet.id);
    await prisma.homepageConfig.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        featuredCasinoIds: JSON.stringify(featured),
        heroTitle: "Trusted casino & bookmaker reviews",
        heroSubtitle: "Clear ratings, real payout context, and bonuses explained without the hype.",
      },
      update: {
        featuredCasinoIds: JSON.stringify(featured),
        heroTitle: "Trusted casino & bookmaker reviews",
        heroSubtitle: "Clear ratings, real payout context, and bonuses explained without the hype.",
      },
    });
  }

  await prisma.comparisonRow.deleteMany({
    where: { homepageId: 1, entityType: "CASINO", entityId: oneXBet.id },
  });
  await prisma.comparisonRow.create({
    data: {
      homepageId: 1,
      entityType: "CASINO",
      entityId: oneXBet.id,
      sortOrder: 0,
    },
  });

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      siteName: "Bet Desk Reviews",
      tagline: "Independent casino & bookmaker reviews",
    },
    update: {
      siteName: "Bet Desk Reviews",
      tagline: "Independent casino & bookmaker reviews",
    },
  });

  console.log("1xBet review ready:", `/casinos/${oneXBet.slug}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
