import { prisma } from "@/lib/prisma";
import { applySeoTemplate } from "@/lib/utils";

export async function getSiteSettings() {
  let settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  if (!settings) {
    settings = await prisma.siteSettings.create({ data: { id: 1 } });
  }
  return prisma.siteSettings.findUniqueOrThrow({
    where: { id: 1 },
    include: {
      logo: true,
      favicon: true,
      defaultOgImage: true,
    },
  });
}

export async function getHomepageConfig() {
  let config = await prisma.homepageConfig.findUnique({ where: { id: 1 } });
  if (!config) {
    config = await prisma.homepageConfig.create({ data: { id: 1 } });
  }
  return prisma.homepageConfig.findUniqueOrThrow({
    where: { id: 1 },
    include: {
      rows: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function getMenu(location: "HEADER" | "FOOTER") {
  return prisma.menu.findUnique({
    where: { location },
    include: {
      items: {
        where: { parentId: null },
        orderBy: { sortOrder: "asc" },
        include: {
          children: { orderBy: { sortOrder: "asc" } },
        },
      },
    },
  });
}

type SeoSource = {
  title?: string;
  name?: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  robots?: string | null;
  canonicalUrl?: string | null;
  ogImage?: { url: string } | null;
};

export async function resolveSeo(
  kind: "page" | "casino" | "bookmaker" | "bonus" | "home" | "archive",
  source?: SeoSource,
) {
  const settings = await getSiteSettings();
  const year = String(new Date().getFullYear());
  const name = source?.name ?? source?.title ?? "";
  const site = settings.siteName;

  let title = source?.seoTitle?.trim() || "";
  let description = source?.seoDescription?.trim() || "";

  if (!title) {
    if (kind === "casino") {
      title = applySeoTemplate(settings.seoTitleTemplateCasino, { name, site, year });
    } else if (kind === "bookmaker") {
      title = applySeoTemplate(settings.seoTitleTemplateBookmaker, { name, site, year });
    } else if (kind === "bonus") {
      title = applySeoTemplate(settings.seoTitleTemplateBonus, { name, site, year });
    } else if (kind === "home") {
      title = `${site}${settings.tagline ? ` — ${settings.tagline}` : ""}`;
    } else if (source?.title) {
      title = `${source.title} | ${site}`;
    } else {
      title = site;
    }
  }

  if (!description) {
    if (kind === "casino") {
      description = applySeoTemplate(settings.seoDescTemplateCasino, { name, site, year });
    } else if (kind === "bookmaker") {
      description = applySeoTemplate(settings.seoDescTemplateBookmaker, { name, site, year });
    } else if (kind === "bonus") {
      description = applySeoTemplate(settings.seoDescTemplateBonus, { name, site, year });
    } else {
      description = settings.tagline || settings.affiliateDisclosure.slice(0, 155);
    }
  }

  return {
    title,
    description,
    robots: source?.robots || "index,follow",
    canonical: source?.canonicalUrl || undefined,
    ogTitle: source?.ogTitle?.trim() || title,
    ogDescription: source?.ogDescription?.trim() || description,
    ogImage: source?.ogImage?.url || settings.defaultOgImage?.url || undefined,
    siteName: site,
    settings,
  };
}

export async function maybeCreateRedirect(oldPath: string, newPath: string) {
  if (!oldPath || !newPath || oldPath === newPath) return;
  await prisma.redirect.upsert({
    where: { fromPath: oldPath },
    create: { fromPath: oldPath, toPath: newPath },
    update: { toPath: newPath },
  });
}
