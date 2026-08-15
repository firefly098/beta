import Link from "next/link";
import { OperatorLogo } from "@/themes/default/OperatorLogo";

export function ReviewCard({
  title,
  href,
  rating,
  summary,
  meta,
  logoUrl,
  logoBackground,
}: {
  title: string;
  href: string;
  rating?: number;
  summary?: string;
  meta?: string;
  logoUrl?: string | null;
  logoBackground?: string | null;
}) {
  return (
    <Link href={href} className="surface surface-lift group block p-4">
      {logoUrl ? (
        <div className="mb-4">
          <OperatorLogo name={title} src={logoUrl} background={logoBackground} size="sm" />
        </div>
      ) : null}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {meta ? (
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              {meta}
            </p>
          ) : null}
          <h3 className="mt-1 truncate font-display text-lg font-semibold tracking-tight text-[var(--ink)]">
            {title}
          </h3>
        </div>
        {typeof rating === "number" ? (
          <span className="shrink-0 rounded-md bg-[var(--ink)] px-2 py-1 text-xs font-bold text-[var(--accent)]">
            {rating.toFixed(1)}
          </span>
        ) : null}
      </div>
      {summary ? (
        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-[var(--muted)]">{summary}</p>
      ) : null}
      <p className="mt-4 text-[12px] font-semibold text-[var(--ink)] opacity-60 transition group-hover:opacity-100">
        Read review
      </p>
    </Link>
  );
}
