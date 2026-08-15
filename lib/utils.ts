export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function stringifyJsonArray(items: string[]): string {
  return JSON.stringify(items.filter(Boolean));
}

export function parseJsonObjectArray<T extends Record<string, unknown>>(
  value: string | null | undefined,
): T[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

export function buildCtaHref(url: string, tracking: string): string {
  if (!url) return "#";
  if (!tracking.trim()) return url;
  try {
    const u = new URL(url);
    const params = new URLSearchParams(tracking.replace(/^\?/, ""));
    params.forEach((v, k) => u.searchParams.set(k, v));
    return u.toString();
  } catch {
    const sep = url.includes("?") ? "&" : "?";
    return `${url}${sep}${tracking.replace(/^\?/, "")}`;
  }
}

export function applySeoTemplate(
  template: string,
  vars: { name?: string; site?: string; year?: string },
): string {
  return template
    .replaceAll("{name}", vars.name ?? "")
    .replaceAll("{site}", vars.site ?? "")
    .replaceAll("{year}", vars.year ?? String(new Date().getFullYear()));
}
