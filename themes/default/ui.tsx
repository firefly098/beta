import Link from "next/link";
import { buildCtaHref } from "@/lib/utils";

export function CtaButton({
  label,
  url,
  tracking,
  className = "",
}: {
  label: string;
  url: string;
  tracking?: string;
  className?: string;
}) {
  const href = buildCtaHref(url, tracking || "");
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored noopener noreferrer"
      className={`cta-pulse inline-flex items-center justify-center rounded-full bg-[var(--brand)] px-5 py-2.5 text-sm font-bold text-[var(--brand-ink)] shadow-[0_10px_30px_rgba(11,99,246,0.35)] transition hover:-translate-y-0.5 hover:brightness-110 ${className}`}
    >
      {label || "Visit"}
    </a>
  );
}

export function RgBlock({ text }: { text: string }) {
  return (
    <aside className="mt-12 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
        Responsible gambling
      </p>
      <p className="mt-2 text-sm leading-relaxed text-[var(--ink)]">{text}</p>
      <p className="mt-3">
        <Link
          href="/pages/responsible-gambling"
          className="text-sm font-semibold text-[var(--brand)] hover:underline"
        >
          Read our RG guide
        </Link>
      </p>
    </aside>
  );
}

export function Disclosure({ text }: { text: string }) {
  return <p className="text-xs leading-relaxed opacity-80">{text}</p>;
}

export function ProsCons({ pros, cons }: { pros: string[]; cons: string[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]">
        <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--ok)]">Pros</h3>
        <ul className="mt-3 space-y-2 text-sm text-[var(--ink)]">
          {pros.map((p) => (
            <li key={p} className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--ok)]" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]">
        <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--danger)]">Cons</h3>
        <ul className="mt-3 space-y-2 text-sm text-[var(--ink)]">
          {cons.map((c) => (
            <li key={c} className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--danger)]" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow ? (
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl">
        {title}
      </h2>
      {subtitle ? <p className="mt-3 text-[var(--muted)]">{subtitle}</p> : null}
    </div>
  );
}
