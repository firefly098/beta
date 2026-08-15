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
    <div className="overflow-x-auto rounded-xl border border-[var(--line)] bg-[var(--surface)]">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-[var(--wash)] text-xs uppercase tracking-wide text-[var(--muted)]">
          <tr>
            <th className="px-4 py-3">Operator</th>
            {show("rating") ? <th className="px-4 py-3">Rating</th> : null}
            {show("bonusHighlight") ? <th className="px-4 py-3">Bonus</th> : null}
            {show("payoutSpeed") ? <th className="px-4 py-3">Payout</th> : null}
            {show("licenses") ? <th className="px-4 py-3">License</th> : null}
            {show("cta") ? (
              <th className="sticky right-0 bg-[var(--wash)] px-4 py-3">Offer</th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-[var(--line)]">
              <td className="px-4 py-3 font-medium">
                <Link href={row.href} className="hover:underline">
                  {row.name}
                </Link>
              </td>
              {show("rating") ? <td className="px-4 py-3">{row.rating.toFixed(1)}</td> : null}
              {show("bonusHighlight") ? (
                <td className="px-4 py-3">{row.bonusHighlight || "—"}</td>
              ) : null}
              {show("payoutSpeed") ? (
                <td className="px-4 py-3">{row.payoutSpeed || "—"}</td>
              ) : null}
              {show("licenses") ? (
                <td className="px-4 py-3">{parseJsonArray(row.licenses).join(", ") || "—"}</td>
              ) : null}
              {show("cta") ? (
                <td className="sticky right-0 bg-[var(--surface)] px-4 py-3">
                  <CtaButton
                    label={row.ctaLabel}
                    url={row.ctaUrl}
                    tracking={row.ctaTracking}
                    className="whitespace-nowrap"
                  />
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
