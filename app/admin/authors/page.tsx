import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/FormFields";
import Link from "next/link";

export default async function AuthorsListPage() {
  await requireAdmin();
  const authors = await prisma.author.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <AdminPageHeader title="Authors" actionHref="/admin/authors/new" actionLabel="New author" />
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
            </tr>
          </thead>
          <tbody>
            {authors.map((a) => (
              <tr key={a.id} className="border-b border-zinc-100">
                <td className="px-4 py-3">
                  <Link href={`/admin/authors/${a.id}`} className="font-medium hover:underline">
                    {a.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-zinc-500">{a.slug}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
