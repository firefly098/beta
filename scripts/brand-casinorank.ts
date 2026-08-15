import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      siteName: "CasinoRank",
      tagline: "Independent casino reviews, bonuses, and trusted rankings",
    },
    update: {
      siteName: "CasinoRank",
      tagline: "Independent casino reviews, bonuses, and trusted rankings",
    },
  });
  await prisma.homepageConfig.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      heroTitle: "Find the Best Casinos. Play with Confidence.",
      heroSubtitle:
        "Compare licensed operators, welcome bonuses, and payout speed before you play.",
      heroCtaLabel: "Browse Top Casinos",
      heroCtaUrl: "/casinos",
    },
    update: {
      heroTitle: "Find the Best Casinos. Play with Confidence.",
      heroSubtitle:
        "Compare licensed operators, welcome bonuses, and payout speed before you play.",
      heroCtaLabel: "Browse Top Casinos",
      heroCtaUrl: "/casinos",
    },
  });
  console.log("CasinoRank branding applied");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
