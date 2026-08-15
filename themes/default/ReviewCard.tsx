import Link from "next/link";

export function ReviewCard({
  title,
  href,
  rating,
  summary,
  meta,
}: {
  title: string;
  href: string;
  rating?: number;
  summary?: string;
  meta?: string;
}) {
  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-[1.25rem] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[var(--shadow)] transition duration-300 hover:-translate-y-1 hover:border-[var(--brand)]/40"
    >
      <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[var(--brand)] to-[var(--accent)] transition duration-300 group-hover:scale-x-100" />
      <div className="flex items-start justify-between gap-3">
        <div>
          {meta ? (
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
              {meta}
            </p>
          ) : null}
          <h3 className="mt-1 font-display text-xl font-semibold tracking-tight text-[var(--ink)]">
            {title}
          </h3>
        </div>
        {typeof rating === "number" ? (
          <span className="rounded-2xl bg-[var(--ink)] px-3 py-2 text-sm font-bold text-white">
            {rating.toFixed(1)}
          </span>
        ) : null}
      </div>
      {summary ? (
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[var(--muted)]">{summary}</p>
      ) : null}
      <p className="mt-4 text-sm font-semibold text-[var(--brand)]">Read review →</p>
    </Link>
  );
}
