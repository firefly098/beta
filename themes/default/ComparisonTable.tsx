import Link from "next/link";
import { CtaButton } from "@/themes/default/ui";
import { OperatorLogo } from "@/themes/default/OperatorLogo";
import { parseJsonArray } from "@/lib/utils";

type Row = {
  id: string;
  name: string;
  href: string;
  rating: number;
  bonusHighlight: string;
  payoutSpeed: string;
  licenses: string;
  ctaLabel: string;
  ctaUrl: string;
  ctaTracking: string;
  logoUrl?: string | null;
  logoBackground?: string | null;
};

function stars(rating: number) {
  const score = Math.max(0, Math.min(5, rating / 2));
  return score.toFixed(1);
}

function ratingLabel(rating: number) {
  if (rating >= 9) return "Excellent";
  if (rating >= 8) return "Great";
  if (rating >= 7) return "Good";
  return "Fair";
}

export function RankedCasinosTable({ rows }: { rows: Row[] }) {
  if (rows.length === 0) return null;

  return (
    <div className="surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--line)] bg-[var(--wash)]/80 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
              <th className="px-4 py-3">Rank</th>
              <th className="px-4 py-3">Casino</th>
              <th className="px-4 py-3">Welcome Bonus</th>
              <th className="px-4 py-3">Payout</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Review</th>
              <th className="px-4 py-3">Play Now</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id} className="border-t border-[var(--line)]">
                <td className="px-4 py-4">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--brand-soft)] text-sm font-bold text-[var(--brand)]">
                    {index + 1}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    {row.logoUrl ? (
                      <OperatorLogo
                        name={row.name}
                        src={row.logoUrl}
                        background={row.logoBackground}
                        size="sm"
                      />
                    ) : (
                      <div className="flex h-11 w-[6.75rem] items-center justify-center rounded-lg bg-[var(--ink)] px-2 text-xs font-bold text-white">
                        {row.name}
                      </div>
                    )}
                  </div>
                </td>
                <td className="max-w-[220px] px-4 py-4 font-medium text-[var(--ink)]">
                  {row.bonusHighlight || "—"}
                </td>
                <td className="px-4 py-4 text-[var(--muted)]">{row.payoutSpeed || "—"}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[var(--accent)]">★★★★★</span>
                    <span className="font-bold text-[var(--ink)]">{stars(row.rating)}</span>
                    <span className="text-xs text-[var(--muted)]">{ratingLabel(row.rating)}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <Link href={row.href} className="font-bold text-[var(--brand)] hover:underline">
                    Read Review
                  </Link>
                </td>
                <td className="px-4 py-4">
                  <CtaButton
                    label={row.ctaLabel || "Visit Casino"}
                    url={row.ctaUrl}
                    tracking={row.ctaTracking}
                    className="!px-4 !py-2 !text-xs"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ComparisonTable({
  rows,
  columns,
}: {
  rows: Row[];
  columns: string[];
}) {
  void columns;
  return <RankedCasinosTable rows={rows} />;
}

export function licensesText(licenses: string) {
  return parseJsonArray(licenses).join(", ");
}
