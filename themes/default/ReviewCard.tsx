import Link from "next/link";

export function ReviewCard({
  title,
  href,
  rating,
  summary,
}: {
  title: string;
  href: string;
  rating?: number;
  summary?: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 transition hover:border-[var(--brand)]"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-[var(--ink)]">{title}</h3>
        {typeof rating === "number" ? (
          <span className="rounded-md bg-[var(--wash)] px-2 py-1 text-sm font-semibold">
            {rating.toFixed(1)}
          </span>
        ) : null}
      </div>
      {summary ? <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">{summary}</p> : null}
    </Link>
  );
}
