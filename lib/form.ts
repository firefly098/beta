import { PublishStatus } from "@prisma/client";
import { slugify } from "@/lib/utils";

export function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export function bool(formData: FormData, key: string) {
  return formData.get(key) === "true" || formData.get(key) === "on";
}

export function num(formData: FormData, key: string, fallback = 0) {
  const n = Number(formData.get(key));
  return Number.isFinite(n) ? n : fallback;
}

export function linesToJson(formData: FormData, key: string) {
  const raw = str(formData, key);
  const items = raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  return JSON.stringify(items);
}

export function publishFields(formData: FormData) {
  const status = (str(formData, "status") || "DRAFT") as PublishStatus;
  const scheduledAtRaw = str(formData, "scheduledAt");
  return {
    status,
    publishedAt:
      status === "PUBLISHED"
        ? new Date()
        : status === "SCHEDULED" && scheduledAtRaw
          ? new Date(scheduledAtRaw)
          : null,
    scheduledAt: scheduledAtRaw ? new Date(scheduledAtRaw) : null,
  };
}

export function seoFields(formData: FormData) {
  return {
    seoTitle: str(formData, "seoTitle"),
    seoDescription: str(formData, "seoDescription"),
    canonicalUrl: str(formData, "canonicalUrl"),
    robots: str(formData, "robots") || "index,follow",
    ogTitle: str(formData, "ogTitle"),
    ogDescription: str(formData, "ogDescription"),
  };
}

export function resolveSlug(formData: FormData, fromTitle: string) {
  const explicit = str(formData, "slug");
  return explicit || slugify(fromTitle);
}

export function ctaFields(formData: FormData) {
  return {
    ctaLabel: str(formData, "ctaLabel"),
    ctaUrl: str(formData, "ctaUrl"),
    ctaTracking: str(formData, "ctaTracking"),
  };
}
