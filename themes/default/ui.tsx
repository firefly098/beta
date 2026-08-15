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
      className={`btn-primary ${className}`}
    >
      {label || "Visit Casino"}
    </a>
  );
}

export function RgBlock({ text }: { text: string }) {
  return (
    <aside className="surface mt-10 p-5">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand)]">
        Responsible gambling
      </p>
      <p className="mt-2 text-sm leading-relaxed text-[var(--ink)]">{text}</p>
      <Link href="/pages/responsible-gambling" className="mt-3 inline-block text-sm font-bold text-[var(--brand)] hover:underline">
        Learn more
      </Link>
    </aside>
  );
}

export function Disclosure({ text }: { text: string }) {
  return <p className="text-xs leading-relaxed opacity-80">{text}</p>;
}

export function ProsCons({ pros, cons }: { pros: string[]; cons: string[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="surface p-5">
        <h3 className="text-sm font-bold text-[var(--ok)]">Pros</h3>
        <ul className="mt-3 space-y-2 text-sm text-[var(--ink)]">
          {pros.map((p) => (
            <li key={p} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--ok)]" />
              {p}
            </li>
          ))}
        </ul>
      </div>
      <div className="surface p-5">
        <h3 className="text-sm font-bold text-[var(--danger)]">Cons</h3>
        <ul className="mt-3 space-y-2 text-sm text-[var(--ink)]">
          {cons.map((c) => (
            <li key={c} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--danger)]" />
              {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-xl">
        {eyebrow ? (
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--brand)]">{eyebrow}</p>
        ) : null}
        <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-[var(--ink)] md:text-3xl">
          {title}
        </h2>
        {subtitle ? <p className="mt-2 text-sm text-[var(--muted)]">{subtitle}</p> : null}
      </div>
      {action ? (
        <Link href={action.href} className="text-sm font-bold text-[var(--brand)] hover:underline">
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
