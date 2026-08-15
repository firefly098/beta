import { prisma } from "@/lib/prisma";
import { publishedWhere } from "@/lib/publish";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.AUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const [pages, casinos, bookmakers, bonuses] = await Promise.all([
    prisma.page.findMany({ where: publishedWhere, select: { slug: true, updatedAt: true } }),
    prisma.casinoReview.findMany({
      where: publishedWhere,
      select: { slug: true, updatedAt: true },
    }),
    prisma.bookmakerReview.findMany({
      where: publishedWhere,
      select: { slug: true, updatedAt: true },
    }),
    prisma.bonusReview.findMany({
      where: publishedWhere,
      select: { slug: true, updatedAt: true },
    }),
  ]);

  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/casinos`, lastModified: new Date() },
    { url: `${base}/bookmakers`, lastModified: new Date() },
    { url: `${base}/bonuses`, lastModified: new Date() },
    ...pages.map((p) => ({
      url: `${base}/pages/${p.slug}`,
      lastModified: p.updatedAt,
    })),
    ...casinos.map((p) => ({
      url: `${base}/casinos/${p.slug}`,
      lastModified: p.updatedAt,
    })),
    ...bookmakers.map((p) => ({
      url: `${base}/bookmakers/${p.slug}`,
      lastModified: p.updatedAt,
    })),
    ...bonuses.map((p) => ({
      url: `${base}/bonuses/${p.slug}`,
      lastModified: p.updatedAt,
    })),
  ];
}
