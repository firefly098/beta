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
      className={`inline-flex items-center justify-center rounded-md bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 ${className}`}
    >
      {label || "Visit"}
    </a>
  );
}

export function RgBlock({ text }: { text: string }) {
  return (
    <aside className="mt-10 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      <p className="font-semibold">Responsible gambling</p>
      <p className="mt-1">{text}</p>
      <p className="mt-2">
        <Link href="/pages/responsible-gambling" className="underline">
          Learn more
        </Link>
      </p>
    </aside>
  );
}

export function Disclosure({ text }: { text: string }) {
  return <p className="text-xs text-[var(--muted)]">{text}</p>;
}

export function ProsCons({ pros, cons }: { pros: string[]; cons: string[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <h3 className="font-semibold text-emerald-800">Pros</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
          {pros.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-rose-800">Cons</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
          {cons.map((c) => (
            <li key={c}>{c}</li>
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
