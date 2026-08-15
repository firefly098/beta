import Link from "next/link";
import { CtaButton } from "@/themes/default/ui";
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
};

export function ComparisonTable({
  rows,
  columns,
}: {
  rows: Row[];
  columns: string[];
}) {
  if (rows.length === 0) return null;

  const show = (key: string) => columns.includes(key);

  return (
    <div className="surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--line)] bg-[var(--wash)]/70">
              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                Operator
              </th>
              {show("rating") ? (
                <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Rating
                </th>
              ) : null}
              {show("bonusHighlight") ? (
                <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Bonus
                </th>
              ) : null}
              {show("payoutSpeed") ? (
                <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Payout
                </th>
              ) : null}
              {show("licenses") ? (
                <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                  License
                </th>
              ) : null}
              {show("cta") ? (
                <th className="sticky right-0 bg-[var(--wash)] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Offer
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-[var(--line)]">
                <td className="px-4 py-3.5 font-semibold">
                  <Link href={row.href} className="hover:underline">
                    {row.name}
                  </Link>
                </td>
                {show("rating") ? (
                  <td className="px-4 py-3.5">
                    <span className="rounded-md bg-[var(--ink)] px-2 py-0.5 text-xs font-bold text-[var(--accent)]">
                      {row.rating.toFixed(1)}
                    </span>
                  </td>
                ) : null}
                {show("bonusHighlight") ? (
                  <td className="px-4 py-3.5 text-[var(--muted)]">{row.bonusHighlight || "—"}</td>
                ) : null}
                {show("payoutSpeed") ? (
                  <td className="px-4 py-3.5 text-[var(--muted)]">{row.payoutSpeed || "—"}</td>
                ) : null}
                {show("licenses") ? (
                  <td className="px-4 py-3.5 text-[var(--muted)]">
                    {parseJsonArray(row.licenses).join(", ") || "—"}
                  </td>
                ) : null}
                {show("cta") ? (
                  <td className="sticky right-0 bg-[var(--surface)] px-4 py-3.5">
                    <CtaButton
                      label={row.ctaLabel}
                      url={row.ctaUrl}
                      tracking={row.ctaTracking}
                      className="!px-3 !py-1.5 !text-[11px]"
                    />
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
