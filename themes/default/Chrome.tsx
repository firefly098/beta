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
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--background)_88%,transparent)] backdrop-blur-md">
      <div className="site-shell flex h-14 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5">
          {settings.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={settings.logo.url} alt={settings.siteName} className="h-7 w-auto" />
          ) : (
            <>
              <span className="grid h-7 w-7 place-items-center rounded-md bg-[var(--ink)] text-[11px] font-bold text-[var(--accent)]">
                {settings.siteName.slice(0, 1)}
              </span>
              <span className="font-display text-[1.05rem] font-semibold tracking-tight text-[var(--ink)]">
                {settings.siteName}
              </span>
            </>
          )}
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {(menu?.items || []).map((item) => (
            <Link
              key={item.id}
              href={item.url}
              className="text-[13px] font-medium text-[var(--muted)] transition hover:text-[var(--ink)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <nav className="flex items-center gap-3 overflow-x-auto md:hidden">
          {(menu?.items || []).slice(0, 4).map((item) => (
            <Link
              key={item.id}
              href={item.url}
              className="whitespace-nowrap text-[12px] font-medium text-[var(--muted)]"
            >
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
      <div className="site-shell py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-xl font-semibold tracking-tight">{settings.siteName}</p>
            <p className="mt-2 text-sm text-[var(--muted)]">{settings.tagline}</p>
            <p className="mt-4 text-[11px] font-semibold tracking-[0.14em] text-[var(--ink)]">
              {settings.ageNotice} ONLY
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--muted)]">
            {(menu?.items || []).map((item) => (
              <Link key={item.id} href={item.url} className="hover:text-[var(--ink)]">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-10 space-y-3 border-t border-[var(--line)] pt-6">
          <p className="text-sm leading-relaxed text-[var(--muted)]">{settings.rgFooterText}</p>
          {rgLinks.length > 0 ? (
            <div className="flex flex-wrap gap-4 text-sm">
              {rgLinks.map((l) => (
                <a
                  key={l.url}
                  href={l.url}
                  className="font-medium text-[var(--ink)] underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {l.label}
                </a>
              ))}
            </div>
          ) : null}
          <Disclosure text={settings.affiliateDisclosure} />
        </div>
      </div>
    </footer>
  );
}
