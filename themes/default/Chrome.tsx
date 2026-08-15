import Link from "next/link";
import type { getMenu, getSiteSettings } from "@/lib/site";
import { Disclosure } from "@/themes/default/ui";
import { parseJsonObjectArray } from "@/lib/utils";

type Menu = NonNullable<Awaited<ReturnType<typeof getMenu>>>;
type Settings = Awaited<ReturnType<typeof getSiteSettings>>;

export function SiteHeader({
  settings,
  menu,
}: {
  settings: Settings;
  menu: Menu | null;
}) {
  return (
    <header className="border-b border-[var(--line)] bg-[var(--surface)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-[var(--ink)]">
          {settings.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={settings.logo.url} alt={settings.siteName} className="h-8 w-auto" />
          ) : (
            settings.siteName
          )}
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-[var(--ink)]">
          {(menu?.items || []).map((item) => (
            <Link key={item.id} href={item.url} className="hover:text-[var(--brand)]">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter({
  settings,
  menu,
}: {
  settings: Settings;
  menu: Menu | null;
}) {
  const rgLinks = parseJsonObjectArray<{ label: string; url: string }>(settings.rgLinks);

  return (
    <footer className="mt-auto border-t border-[var(--line)] bg-[var(--surface)]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:justify-between">
          <div>
            <p className="font-semibold">{settings.siteName}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{settings.tagline}</p>
            <p className="mt-3 text-sm font-semibold">{settings.ageNotice}</p>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm">
            {(menu?.items || []).map((item) => (
              <Link key={item.id} href={item.url} className="hover:underline">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-6 text-sm text-[var(--muted)]">{settings.rgFooterText}</p>
        {rgLinks.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-3 text-sm">
            {rgLinks.map((l) => (
              <a key={l.url} href={l.url} className="underline" target="_blank" rel="noopener noreferrer">
                {l.label}
              </a>
            ))}
          </div>
        ) : null}
        <div className="mt-4">
          <Disclosure text={settings.affiliateDisclosure} />
        </div>
      </div>
    </footer>
  );
}
