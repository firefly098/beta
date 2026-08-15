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
    <Link
      href={href}
      className="surface group block p-4 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow)]"
    >
      {logoUrl ? (
        <div className="mb-3">
          <OperatorLogo name={title} src={logoUrl} background={logoBackground} size="sm" />
        </div>
      ) : null}
      <div className="flex items-start justify-between gap-3">
        <div>
          {meta ? (
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--brand)]">
              {meta}
            </p>
          ) : null}
          <h3 className="mt-1 font-display text-lg font-bold tracking-tight text-[var(--ink)]">
            {title}
          </h3>
        </div>
        {typeof rating === "number" ? (
          <span className="rounded-full bg-[var(--brand-soft)] px-2.5 py-1 text-xs font-bold text-[var(--brand)]">
            {rating.toFixed(1)}
          </span>
        ) : null}
      </div>
      {summary ? (
        <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">{summary}</p>
      ) : null}
      <p className="mt-3 text-sm font-bold text-[var(--brand)]">Read Review →</p>
    </Link>
  );
}
