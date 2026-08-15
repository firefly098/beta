"use server";

import { requireAdmin } from "@/lib/admin";
import {
  bool,
  ctaFields,
  linesToJson,
  num,
  publishFields,
  resolveSlug,
  seoFields,
  str,
} from "@/lib/form";
import { prisma } from "@/lib/prisma";
import { maybeCreateRedirect } from "@/lib/site";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPage(formData: FormData) {
  await requireAdmin();
  const title = str(formData, "title");
  const slug = resolveSlug(formData, title);
  const page = await prisma.page.create({
    data: {
      title,
      slug,
      body: str(formData, "body"),
      authorId: str(formData, "authorId") || null,
      ...publishFields(formData),
      ...seoFields(formData),
    },
  });
  revalidatePath("/");
  redirect(`/admin/pages/${page.id}`);
}

export async function updatePage(id: string, formData: FormData) {
  await requireAdmin();
  const existing = await prisma.page.findUniqueOrThrow({ where: { id } });
  const title = str(formData, "title");
  const slug = resolveSlug(formData, title);
  if (slug !== existing.slug) {
    await maybeCreateRedirect(`/pages/${existing.slug}`, `/pages/${slug}`);
  }
  await prisma.page.update({
    where: { id },
    data: {
      title,
      slug,
      body: str(formData, "body"),
      authorId: str(formData, "authorId") || null,
      ...publishFields(formData),
      ...seoFields(formData),
    },
  });
  revalidatePath("/");
  revalidatePath(`/pages/${slug}`);
  redirect(`/admin/pages/${id}`);
}

export async function deletePage(id: string) {
  await requireAdmin();
  await prisma.page.delete({ where: { id } });
  revalidatePath("/");
  redirect("/admin/pages");
}

export async function createCasino(formData: FormData) {
  await requireAdmin();
  const name = str(formData, "name");
  const slug = resolveSlug(formData, name);
  const item = await prisma.casinoReview.create({
    data: {
      name,
      slug,
      body: str(formData, "body"),
      rating: num(formData, "rating"),
      pros: linesToJson(formData, "pros"),
      cons: linesToJson(formData, "cons"),
      licenses: linesToJson(formData, "licenses"),
      payments: linesToJson(formData, "payments"),
      providers: linesToJson(formData, "providers"),
      minDeposit: str(formData, "minDeposit"),
      payoutSpeed: str(formData, "payoutSpeed"),
      verdict: str(formData, "verdict"),
      bonusHighlight: str(formData, "bonusHighlight"),
      authorId: str(formData, "authorId") || null,
      logoId: str(formData, "logoId") || null,
      logoBackground: str(formData, "logoBackground"),
      ...ctaFields(formData),
      ...publishFields(formData),
      ...seoFields(formData),
    },
  });
  revalidatePath("/casinos");
  redirect(`/admin/casinos/${item.id}`);
}

export async function updateCasino(id: string, formData: FormData) {
  await requireAdmin();
  const existing = await prisma.casinoReview.findUniqueOrThrow({ where: { id } });
  const name = str(formData, "name");
  const slug = resolveSlug(formData, name);
  if (slug !== existing.slug) {
    await maybeCreateRedirect(`/casinos/${existing.slug}`, `/casinos/${slug}`);
  }
  await prisma.casinoReview.update({
    where: { id },
    data: {
      name,
      slug,
      body: str(formData, "body"),
      rating: num(formData, "rating"),
      pros: linesToJson(formData, "pros"),
      cons: linesToJson(formData, "cons"),
      licenses: linesToJson(formData, "licenses"),
      payments: linesToJson(formData, "payments"),
      providers: linesToJson(formData, "providers"),
      minDeposit: str(formData, "minDeposit"),
      payoutSpeed: str(formData, "payoutSpeed"),
      verdict: str(formData, "verdict"),
      bonusHighlight: str(formData, "bonusHighlight"),
      authorId: str(formData, "authorId") || null,
      logoId: str(formData, "logoId") || null,
      logoBackground: str(formData, "logoBackground"),
      ...ctaFields(formData),
      ...publishFields(formData),
      ...seoFields(formData),
    },
  });
  revalidatePath("/casinos");
  revalidatePath(`/casinos/${slug}`);
  redirect(`/admin/casinos/${id}`);
}

export async function deleteCasino(id: string) {
  await requireAdmin();
  await prisma.casinoReview.delete({ where: { id } });
  revalidatePath("/casinos");
  redirect("/admin/casinos");
}

export async function createBookmaker(formData: FormData) {
  await requireAdmin();
  const name = str(formData, "name");
  const slug = resolveSlug(formData, name);
  const item = await prisma.bookmakerReview.create({
    data: {
      name,
      slug,
      body: str(formData, "body"),
      rating: num(formData, "rating"),
      pros: linesToJson(formData, "pros"),
      cons: linesToJson(formData, "cons"),
      licenses: linesToJson(formData, "licenses"),
      payments: linesToJson(formData, "payments"),
      sportsCoverage: str(formData, "sportsCoverage"),
      liveBetting: bool(formData, "liveBetting"),
      hasApps: bool(formData, "hasApps"),
      minDeposit: str(formData, "minDeposit"),
      payoutSpeed: str(formData, "payoutSpeed"),
      verdict: str(formData, "verdict"),
      bonusHighlight: str(formData, "bonusHighlight"),
      authorId: str(formData, "authorId") || null,
      logoId: str(formData, "logoId") || null,
      ...ctaFields(formData),
      ...publishFields(formData),
      ...seoFields(formData),
    },
  });
  revalidatePath("/bookmakers");
  redirect(`/admin/bookmakers/${item.id}`);
}

export async function updateBookmaker(id: string, formData: FormData) {
  await requireAdmin();
  const existing = await prisma.bookmakerReview.findUniqueOrThrow({ where: { id } });
  const name = str(formData, "name");
  const slug = resolveSlug(formData, name);
  if (slug !== existing.slug) {
    await maybeCreateRedirect(`/bookmakers/${existing.slug}`, `/bookmakers/${slug}`);
  }
  await prisma.bookmakerReview.update({
    where: { id },
    data: {
      name,
      slug,
      body: str(formData, "body"),
      rating: num(formData, "rating"),
      pros: linesToJson(formData, "pros"),
      cons: linesToJson(formData, "cons"),
      licenses: linesToJson(formData, "licenses"),
      payments: linesToJson(formData, "payments"),
      sportsCoverage: str(formData, "sportsCoverage"),
      liveBetting: bool(formData, "liveBetting"),
      hasApps: bool(formData, "hasApps"),
      minDeposit: str(formData, "minDeposit"),
      payoutSpeed: str(formData, "payoutSpeed"),
      verdict: str(formData, "verdict"),
      bonusHighlight: str(formData, "bonusHighlight"),
      authorId: str(formData, "authorId") || null,
      logoId: str(formData, "logoId") || null,
      ...ctaFields(formData),
      ...publishFields(formData),
      ...seoFields(formData),
    },
  });
  revalidatePath("/bookmakers");
  revalidatePath(`/bookmakers/${slug}`);
  redirect(`/admin/bookmakers/${id}`);
}

export async function deleteBookmaker(id: string) {
  await requireAdmin();
  await prisma.bookmakerReview.delete({ where: { id } });
  revalidatePath("/bookmakers");
  redirect("/admin/bookmakers");
}

export async function createBonus(formData: FormData) {
  await requireAdmin();
  const title = str(formData, "title");
  const slug = resolveSlug(formData, title);
  const item = await prisma.bonusReview.create({
    data: {
      title,
      slug,
      body: str(formData, "body"),
      bonusType: (str(formData, "bonusType") || "WELCOME") as
        | "WELCOME"
        | "FREE_SPINS"
        | "CASHBACK"
        | "DEPOSIT"
        | "NO_DEPOSIT"
        | "OTHER",
      amount: str(formData, "amount"),
      wagering: str(formData, "wagering"),
      termsSummary: str(formData, "termsSummary"),
      casinoId: str(formData, "casinoId") || null,
      bookmakerId: str(formData, "bookmakerId") || null,
      authorId: str(formData, "authorId") || null,
      ...ctaFields(formData),
      ...publishFields(formData),
      ...seoFields(formData),
    },
  });
  revalidatePath("/bonuses");
  redirect(`/admin/bonuses/${item.id}`);
}

export async function updateBonus(id: string, formData: FormData) {
  await requireAdmin();
  const existing = await prisma.bonusReview.findUniqueOrThrow({ where: { id } });
  const title = str(formData, "title");
  const slug = resolveSlug(formData, title);
  if (slug !== existing.slug) {
    await maybeCreateRedirect(`/bonuses/${existing.slug}`, `/bonuses/${slug}`);
  }
  await prisma.bonusReview.update({
    where: { id },
    data: {
      title,
      slug,
      body: str(formData, "body"),
      bonusType: (str(formData, "bonusType") || "WELCOME") as
        | "WELCOME"
        | "FREE_SPINS"
        | "CASHBACK"
        | "DEPOSIT"
        | "NO_DEPOSIT"
        | "OTHER",
      amount: str(formData, "amount"),
      wagering: str(formData, "wagering"),
      termsSummary: str(formData, "termsSummary"),
      casinoId: str(formData, "casinoId") || null,
      bookmakerId: str(formData, "bookmakerId") || null,
      authorId: str(formData, "authorId") || null,
      ...ctaFields(formData),
      ...publishFields(formData),
      ...seoFields(formData),
    },
  });
  revalidatePath("/bonuses");
  revalidatePath(`/bonuses/${slug}`);
  redirect(`/admin/bonuses/${id}`);
}

export async function deleteBonus(id: string) {
  await requireAdmin();
  await prisma.bonusReview.delete({ where: { id } });
  revalidatePath("/bonuses");
  redirect("/admin/bonuses");
}

export async function createAuthor(formData: FormData) {
  await requireAdmin();
  const name = str(formData, "name");
  const slug = resolveSlug(formData, name);
  const author = await prisma.author.create({
    data: {
      name,
      slug,
      bio: str(formData, "bio"),
      avatarId: str(formData, "avatarId") || null,
    },
  });
  redirect(`/admin/authors/${author.id}`);
}

export async function updateAuthor(id: string, formData: FormData) {
  await requireAdmin();
  const name = str(formData, "name");
  await prisma.author.update({
    where: { id },
    data: {
      name,
      slug: resolveSlug(formData, name),
      bio: str(formData, "bio"),
      avatarId: str(formData, "avatarId") || null,
    },
  });
  redirect(`/admin/authors/${id}`);
}

export async function deleteAuthor(id: string) {
  await requireAdmin();
  await prisma.author.delete({ where: { id } });
  redirect("/admin/authors");
}

export async function updateMediaAlt(id: string, formData: FormData) {
  await requireAdmin();
  await prisma.media.update({
    where: { id },
    data: { alt: str(formData, "alt") },
  });
  redirect("/admin/media");
}

export async function deleteMedia(id: string) {
  await requireAdmin();
  await prisma.media.delete({ where: { id } });
  redirect("/admin/media");
}
