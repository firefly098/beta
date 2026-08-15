import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [pages, casinos, bookmakers, bonuses, drafts] = await Promise.all([
    prisma.page.count(),
    prisma.casinoReview.count(),
    prisma.bookmakerReview.count(),
    prisma.bonusReview.count(),
    Promise.all([
      prisma.page.count({ where: { status: "DRAFT" } }),
      prisma.casinoReview.count({ where: { status: "DRAFT" } }),
      prisma.bookmakerReview.count({ where: { status: "DRAFT" } }),
      prisma.bonusReview.count({ where: { status: "DRAFT" } }),
    ]).then((n) => n.reduce((a, b) => a + b, 0)),
  ]);

  const recent = await prisma.$transaction([
    prisma.page.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, title: true, updatedAt: true, status: true, slug: true },
    }),
    prisma.casinoReview.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, name: true, updatedAt: true, status: true, slug: true },
    }),
  ]);

  const stats = [
    { label: "Pages", value: pages, href: "/admin/pages" },
    { label: "Casinos", value: casinos, href: "/admin/casinos" },
    { label: "Bookmakers", value: bookmakers, href: "/admin/bookmakers" },
    { label: "Bonuses", value: bonuses, href: "/admin/bonuses" },
    { label: "Drafts", value: drafts, href: "/admin/pages" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-zinc-500">Content overview</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-xl border border-zinc-200 bg-white p-4 hover:border-zinc-300"
          >
            <p className="text-xs uppercase tracking-wide text-zinc-500">{s.label}</p>
            <p className="mt-2 text-2xl font-semibold">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-zinc-200 bg-white p-4">
          <h2 className="font-medium">Recent pages</h2>
          <ul className="mt-3 divide-y divide-zinc-100">
            {recent[0].map((p) => (
              <li key={p.id} className="flex items-center justify-between py-2 text-sm">
                <Link href={`/admin/pages/${p.id}`} className="hover:underline">
                  {p.title}
                </Link>
                <span className="text-xs text-zinc-500">{p.status}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-xl border border-zinc-200 bg-white p-4">
          <h2 className="font-medium">Recent casinos</h2>
          <ul className="mt-3 divide-y divide-zinc-100">
            {recent[1].map((p) => (
              <li key={p.id} className="flex items-center justify-between py-2 text-sm">
                <Link href={`/admin/casinos/${p.id}`} className="hover:underline">
                  {p.name}
                </Link>
                <span className="text-xs text-zinc-500">{p.status}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
