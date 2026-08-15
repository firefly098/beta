import bcrypt from "bcryptjs";
import { PrismaClient, PublishStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const name = process.env.ADMIN_NAME || "Admin";

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, name },
    create: { email, name, passwordHash },
  });

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  await prisma.homepageConfig.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      faqItems: JSON.stringify([
        {
          question: "How do you rate casinos?",
          answer:
            "We score licensing, payments, game selection, support, and bonus fairness.",
        },
        {
          question: "Are the links affiliate links?",
          answer:
            "Some links are affiliate links. We may earn a commission at no extra cost to you.",
        },
      ]),
    },
  });

  await prisma.menu.upsert({
    where: { location: "HEADER" },
    update: {},
    create: { name: "Header", location: "HEADER" },
  });
  await prisma.menu.upsert({
    where: { location: "FOOTER" },
    update: {},
    create: { name: "Footer", location: "FOOTER" },
  });

  const header = await prisma.menu.findUniqueOrThrow({ where: { location: "HEADER" } });
  const footer = await prisma.menu.findUniqueOrThrow({ where: { location: "FOOTER" } });

  await prisma.menuItem.deleteMany({ where: { menuId: header.id } });
  await prisma.menuItem.createMany({
    data: [
      { menuId: header.id, label: "Home", url: "/", sortOrder: 0 },
      { menuId: header.id, label: "Casinos", url: "/casinos", sortOrder: 1 },
      { menuId: header.id, label: "Bookmakers", url: "/bookmakers", sortOrder: 2 },
      { menuId: header.id, label: "Bonuses", url: "/bonuses", sortOrder: 3 },
    ],
  });

  await prisma.menuItem.deleteMany({ where: { menuId: footer.id } });
  await prisma.menuItem.createMany({
    data: [
      { menuId: footer.id, label: "About", url: "/pages/about", sortOrder: 0 },
      {
        menuId: footer.id,
        label: "Responsible Gambling",
        url: "/pages/responsible-gambling",
        sortOrder: 1,
      },
    ],
  });

  const author = await prisma.author.upsert({
    where: { slug: "editorial-team" },
    update: {},
    create: {
      name: "Editorial Team",
      slug: "editorial-team",
      bio: "Our editors research operators, bonuses, and payments so you can bet smarter.",
    },
  });

  await prisma.page.upsert({
    where: { slug: "about" },
    update: {},
    create: {
      title: "About",
      slug: "about",
      body: "<p>We publish independent casino and bookmaker reviews.</p>",
      status: PublishStatus.PUBLISHED,
      publishedAt: new Date(),
      authorId: author.id,
      seoTitle: "About Us",
      seoDescription: "Learn about our review process and editorial standards.",
    },
  });

  await prisma.page.upsert({
    where: { slug: "responsible-gambling" },
    update: {},
    create: {
      title: "Responsible Gambling",
      slug: "responsible-gambling",
      body: "<p>Gambling should be entertainment. Set limits, never chase losses, and seek help if needed.</p>",
      status: PublishStatus.PUBLISHED,
      publishedAt: new Date(),
      authorId: author.id,
    },
  });

  const casino = await prisma.casinoReview.upsert({
    where: { slug: "sample-casino" },
    update: {},
    create: {
      name: "Sample Casino",
      slug: "sample-casino",
      body: "<p>Sample Casino offers a wide game library, fast payouts, and a clear welcome package.</p>",
      rating: 8.6,
      pros: JSON.stringify(["Fast withdrawals", "Strong slots catalog", "24/7 support"]),
      cons: JSON.stringify(["Limited live tables"]),
      licenses: JSON.stringify(["MGA"]),
      payments: JSON.stringify(["Visa", "Mastercard", "Skrill"]),
      providers: JSON.stringify(["NetEnt", "Pragmatic Play"]),
      minDeposit: "€10",
      payoutSpeed: "0–24 hours",
      verdict: "A solid all-rounder for slots players who value payout speed.",
      bonusHighlight: "100% up to €500 + 100 spins",
      ctaLabel: "Visit Sample Casino",
      ctaUrl: "https://example.com",
      status: PublishStatus.PUBLISHED,
      publishedAt: new Date(),
      authorId: author.id,
    },
  });

  const bookmaker = await prisma.bookmakerReview.upsert({
    where: { slug: "sample-bookmaker" },
    update: {},
    create: {
      name: "Sample Bookmaker",
      slug: "sample-bookmaker",
      body: "<p>Sample Bookmaker covers major leagues with competitive odds and a polished app.</p>",
      rating: 8.2,
      pros: JSON.stringify(["Competitive odds", "Good live betting", "Mobile apps"]),
      cons: JSON.stringify(["Fewer niche sports"]),
      licenses: JSON.stringify(["UKGC"]),
      payments: JSON.stringify(["Visa", "PayPal"]),
      sportsCoverage: "Football, tennis, basketball, esports",
      liveBetting: true,
      hasApps: true,
      minDeposit: "€5",
      payoutSpeed: "1–2 days",
      verdict: "Reliable sportsbook for everyday football and tennis betting.",
      bonusHighlight: "Bet €10 get €30",
      ctaLabel: "Visit Sample Bookmaker",
      ctaUrl: "https://example.com",
      status: PublishStatus.PUBLISHED,
      publishedAt: new Date(),
      authorId: author.id,
    },
  });

  await prisma.bonusReview.upsert({
    where: { slug: "sample-welcome-bonus" },
    update: {},
    create: {
      title: "Sample Welcome Bonus",
      slug: "sample-welcome-bonus",
      body: "<p>A straightforward welcome package with clear wagering terms.</p>",
      bonusType: "WELCOME",
      amount: "100% up to €500 + 100 spins",
      wagering: "35x bonus",
      termsSummary: "New players only. Max cashout rules apply. 18+.",
      casinoId: casino.id,
      ctaLabel: "Claim Bonus",
      ctaUrl: "https://example.com",
      status: PublishStatus.PUBLISHED,
      publishedAt: new Date(),
      authorId: author.id,
    },
  });

  await prisma.comparisonRow.deleteMany({ where: { homepageId: 1 } });
  await prisma.comparisonRow.createMany({
    data: [
      { homepageId: 1, entityType: "CASINO", entityId: casino.id, sortOrder: 0 },
      { homepageId: 1, entityType: "BOOKMAKER", entityId: bookmaker.id, sortOrder: 1 },
    ],
  });

  await prisma.homepageConfig.update({
    where: { id: 1 },
    data: {
      featuredCasinoIds: JSON.stringify([casino.id]),
      featuredBookmakerIds: JSON.stringify([bookmaker.id]),
    },
  });

  console.log(`Seeded admin ${email} / ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
