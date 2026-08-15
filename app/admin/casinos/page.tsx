import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/FormFields";
import Link from "next/link";

export default async function CasinosListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireAdmin();
  const { q } = await searchParams;
  const items = await prisma.casinoReview.findMany({
    where: q
      ? { OR: [{ name: { contains: q } }, { slug: { contains: q } }] }
      : undefined,
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <AdminPageHeader title="Casino reviews" actionHref="/admin/casinos/new" actionLabel="New casino" />
      <form className="mb-4">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search…"
          className="w-full max-w-sm rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
      </form>
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-b border-zinc-100">
                <td className="px-4 py-3">
                  <Link href={`/admin/casinos/${p.id}`} className="font-medium hover:underline">
                    {p.name}
                  </Link>
                </td>
                <td className="px-4 py-3">{p.rating}</td>
                <td className="px-4 py-3">{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
