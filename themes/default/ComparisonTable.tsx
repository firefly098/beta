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
    <div className="overflow-hidden rounded-[1.25rem] border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-[var(--ink)] text-white">
            <tr>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-[0.14em]">Operator</th>
              {show("rating") ? (
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-[0.14em]">Rating</th>
              ) : null}
              {show("bonusHighlight") ? (
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-[0.14em]">Bonus</th>
              ) : null}
              {show("payoutSpeed") ? (
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-[0.14em]">Payout</th>
              ) : null}
              {show("licenses") ? (
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-[0.14em]">License</th>
              ) : null}
              {show("cta") ? (
                <th className="sticky right-0 bg-[var(--ink)] px-5 py-4 text-xs font-bold uppercase tracking-[0.14em]">
                  Offer
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.id}
                className={`border-t border-[var(--line)] ${i % 2 === 0 ? "bg-white" : "bg-[var(--wash)]/50"}`}
              >
                <td className="px-5 py-4 font-semibold">
                  <Link href={row.href} className="hover:text-[var(--brand)]">
                    {row.name}
                  </Link>
                </td>
                {show("rating") ? (
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full bg-[var(--ink)] px-2.5 py-1 text-xs font-bold text-white">
                      {row.rating.toFixed(1)}
                    </span>
                  </td>
                ) : null}
                {show("bonusHighlight") ? (
                  <td className="px-5 py-4 text-[var(--muted)]">{row.bonusHighlight || "—"}</td>
                ) : null}
                {show("payoutSpeed") ? (
                  <td className="px-5 py-4 text-[var(--muted)]">{row.payoutSpeed || "—"}</td>
                ) : null}
                {show("licenses") ? (
                  <td className="px-5 py-4 text-[var(--muted)]">
                    {parseJsonArray(row.licenses).join(", ") || "—"}
                  </td>
                ) : null}
                {show("cta") ? (
                  <td className="sticky right-0 bg-inherit px-5 py-4">
                    <CtaButton
                      label={row.ctaLabel}
                      url={row.ctaUrl}
                      tracking={row.ctaTracking}
                      className="whitespace-nowrap !px-4 !py-2 !text-xs"
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
