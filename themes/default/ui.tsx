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
      className={`inline-flex items-center justify-center rounded-md bg-[var(--ink)] px-4 py-2.5 text-[13px] font-semibold text-[var(--accent)] transition hover:bg-[#1a1a1a] ${className}`}
    >
      {label || "Visit"}
    </a>
  );
}

export function RgBlock({ text }: { text: string }) {
  return (
    <aside className="surface mt-12 p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
        Responsible gambling
      </p>
      <p className="mt-2 text-sm leading-relaxed text-[var(--ink)]">{text}</p>
      <p className="mt-3">
        <Link href="/pages/responsible-gambling" className="text-sm font-semibold underline-offset-4 hover:underline">
          Read our RG guide
        </Link>
      </p>
    </aside>
  );
}

export function Disclosure({ text }: { text: string }) {
  return <p className="text-xs leading-relaxed text-[var(--muted)]">{text}</p>;
}

export function ProsCons({ pros, cons }: { pros: string[]; cons: string[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="surface p-5">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ok)]">Pros</h3>
        <ul className="mt-3 space-y-2.5 text-sm text-[var(--ink)]">
          {pros.map((p) => (
            <li key={p} className="flex gap-2.5">
              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--ok)]" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="surface p-5">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--danger)]">
          Cons
        </h3>
        <ul className="mt-3 space-y-2.5 text-sm text-[var(--ink)]">
          {cons.map((c) => (
            <li key={c} className="flex gap-2.5">
              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--danger)]" />
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
    <div className="max-w-xl">
      {eyebrow ? (
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 font-display text-[clamp(1.75rem,4vw,2.35rem)] font-semibold leading-[1.05] tracking-tight text-[var(--ink)]">
        {title}
      </h2>
      {subtitle ? <p className="mt-3 text-[15px] leading-relaxed text-[var(--muted)]">{subtitle}</p> : null}
    </div>
  );
}
