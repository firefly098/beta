"use server";

import { requireAdmin } from "@/lib/admin";
import { str } from "@/lib/form";
import { prisma } from "@/lib/prisma";
import { stringifyJsonArray } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveMenu(location: "HEADER" | "FOOTER", formData: FormData) {
  await requireAdmin();
  const menu = await prisma.menu.findUniqueOrThrow({ where: { location } });
  await prisma.menuItem.deleteMany({ where: { menuId: menu.id } });

  const raw = str(formData, "items");
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  let order = 0;
  for (const line of lines) {
    const [label, url] = line.split("|").map((s) => s.trim());
    if (!label || !url) continue;
    await prisma.menuItem.create({
      data: {
        menuId: menu.id,
        label,
        url,
        sortOrder: order++,
      },
    });
  }

  revalidatePath("/");
  redirect("/admin/menus");
}

export async function saveHomepage(formData: FormData) {
  await requireAdmin();
  const sections = stringifyJsonArray(
    str(formData, "sections")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );
  const columns = stringifyJsonArray(
    str(formData, "comparisonColumns")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );

  const featuredCasinoIds = stringifyJsonArray(formData.getAll("featuredCasinoIds").map(String));
  const featuredBookmakerIds = stringifyJsonArray(
    formData.getAll("featuredBookmakerIds").map(String),
  );
  const featuredBonusIds = stringifyJsonArray(formData.getAll("featuredBonusIds").map(String));

  const faqRaw = str(formData, "faqItems");
  let faqItems = "[]";
  try {
    JSON.parse(faqRaw);
    faqItems = faqRaw;
  } catch {
    faqItems = JSON.stringify(
      faqRaw
        .split("\n\n")
        .map((block) => {
          const [question, ...rest] = block.split("\n");
          return { question: question?.trim(), answer: rest.join("\n").trim() };
        })
        .filter((f) => f.question && f.answer),
    );
  }

  await prisma.homepageConfig.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      heroTitle: str(formData, "heroTitle"),
      heroSubtitle: str(formData, "heroSubtitle"),
      heroCtaLabel: str(formData, "heroCtaLabel"),
      heroCtaUrl: str(formData, "heroCtaUrl"),
      sections,
      comparisonColumns: columns,
      featuredCasinoIds,
      featuredBookmakerIds,
      featuredBonusIds,
      faqItems,
    },
    update: {
      heroTitle: str(formData, "heroTitle"),
      heroSubtitle: str(formData, "heroSubtitle"),
      heroCtaLabel: str(formData, "heroCtaLabel"),
      heroCtaUrl: str(formData, "heroCtaUrl"),
      sections,
      comparisonColumns: columns,
      featuredCasinoIds,
      featuredBookmakerIds,
      featuredBonusIds,
      faqItems,
    },
  });

  await prisma.comparisonRow.deleteMany({ where: { homepageId: 1 } });
  const comparisonLines = str(formData, "comparisonRows")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  let sortOrder = 0;
  for (const line of comparisonLines) {
    const [entityType, entityId] = line.split("|").map((s) => s.trim());
    if (!entityType || !entityId) continue;
    if (entityType !== "CASINO" && entityType !== "BOOKMAKER") continue;
    await prisma.comparisonRow.create({
      data: {
        homepageId: 1,
        entityType,
        entityId,
        sortOrder: sortOrder++,
      },
    });
  }

  revalidatePath("/");
  redirect("/admin/homepage");
}

export async function saveSettings(formData: FormData) {
  await requireAdmin();
  const rgLinks = str(formData, "rgLinks");
  let rgLinksJson = "[]";
  try {
    JSON.parse(rgLinks);
    rgLinksJson = rgLinks;
  } catch {
    rgLinksJson = JSON.stringify(
      rgLinks
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map((line) => {
          const [label, url] = line.split("|").map((s) => s.trim());
          return { label, url };
        })
        .filter((x) => x.label && x.url),
    );
  }

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      siteName: str(formData, "siteName"),
      tagline: str(formData, "tagline"),
      logoId: str(formData, "logoId") || null,
      faviconId: str(formData, "faviconId") || null,
      defaultOgImageId: str(formData, "defaultOgImageId") || null,
      affiliateDisclosure: str(formData, "affiliateDisclosure"),
      rgFooterText: str(formData, "rgFooterText"),
      rgLinks: rgLinksJson,
      ageNotice: str(formData, "ageNotice"),
      contactEmail: str(formData, "contactEmail"),
      seoTitleTemplateCasino: str(formData, "seoTitleTemplateCasino"),
      seoDescTemplateCasino: str(formData, "seoDescTemplateCasino"),
      seoTitleTemplateBookmaker: str(formData, "seoTitleTemplateBookmaker"),
      seoDescTemplateBookmaker: str(formData, "seoDescTemplateBookmaker"),
      seoTitleTemplateBonus: str(formData, "seoTitleTemplateBonus"),
      seoDescTemplateBonus: str(formData, "seoDescTemplateBonus"),
    },
    update: {
      siteName: str(formData, "siteName"),
      tagline: str(formData, "tagline"),
      logoId: str(formData, "logoId") || null,
      faviconId: str(formData, "faviconId") || null,
      defaultOgImageId: str(formData, "defaultOgImageId") || null,
      affiliateDisclosure: str(formData, "affiliateDisclosure"),
      rgFooterText: str(formData, "rgFooterText"),
      rgLinks: rgLinksJson,
      ageNotice: str(formData, "ageNotice"),
      contactEmail: str(formData, "contactEmail"),
      seoTitleTemplateCasino: str(formData, "seoTitleTemplateCasino"),
      seoDescTemplateCasino: str(formData, "seoDescTemplateCasino"),
      seoTitleTemplateBookmaker: str(formData, "seoTitleTemplateBookmaker"),
      seoDescTemplateBookmaker: str(formData, "seoDescTemplateBookmaker"),
      seoTitleTemplateBonus: str(formData, "seoTitleTemplateBonus"),
      seoDescTemplateBonus: str(formData, "seoDescTemplateBonus"),
    },
  });

  revalidatePath("/");
  redirect("/admin/settings");
}
