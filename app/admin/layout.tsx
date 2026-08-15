import { auth, signOut } from "@/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isLogin = !session;

  if (isLogin) {
    return <div className="min-h-screen bg-zinc-50">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-56 shrink-0 border-r border-zinc-200 bg-white md:block">
          <div className="border-b border-zinc-200 px-4 py-4">
            <Link href="/admin" className="font-semibold tracking-tight">
              Review CMS
            </Link>
            <p className="mt-1 truncate text-xs text-zinc-500">{session.user?.email}</p>
          </div>
          <AdminNav />
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
            className="border-t border-zinc-200 p-4"
          >
            <button
              type="submit"
              className="w-full rounded-md border border-zinc-200 px-3 py-2 text-left text-sm text-zinc-600 hover:bg-zinc-50"
            >
              Sign out
            </button>
          </form>
        </aside>
        <main className="flex-1 overflow-auto">
          <div className="border-b border-zinc-200 bg-white px-4 py-3 md:hidden">
            <Link href="/admin" className="font-semibold">
              Review CMS
            </Link>
          </div>
          <div className="mx-auto max-w-6xl p-4 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
