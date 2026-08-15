"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/casinos", label: "Casinos" },
  { href: "/admin/bookmakers", label: "Bookmakers" },
  { href: "/admin/bonuses", label: "Bonuses" },
  { href: "/admin/authors", label: "Authors" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/menus", label: "Menus" },
  { href: "/admin/homepage", label: "Homepage" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
        CMS
      </p>
      {links.map((link) => {
        const active =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-md px-3 py-2 text-sm ${
              active
                ? "bg-zinc-900 text-white"
                : "text-zinc-700 hover:bg-zinc-100"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
      <Link
        href="/"
        className="mt-6 rounded-md px-3 py-2 text-sm text-zinc-500 hover:bg-zinc-100"
        target="_blank"
      >
        View site ↗
      </Link>
    </nav>
  );
}
