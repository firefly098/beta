import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const media = await prisma.media.upsert({
    where: { id: "1xbet-logo-media" },
    update: {
      url: "/brand/1xbet-logo.png",
      alt: "1xBet logo",
      filename: "1xbet-logo.png",
      mimeType: "image/png",
    },
    create: {
      id: "1xbet-logo-media",
      url: "/brand/1xbet-logo.png",
      alt: "1xBet logo",
      filename: "1xbet-logo.png",
      mimeType: "image/png",
      size: 4783,
    },
  });

  await prisma.casinoReview.update({
    where: { slug: "1xbet" },
    data: {
      logoId: media.id,
      logoBackground: "#195684",
    },
  });

  console.log("1xBet logo attached with #195684 background");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
