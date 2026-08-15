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
    <header className="sticky top-0 z-40 border-b border-[var(--line)]/80 bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] backdrop-blur-xl">
      <div className="site-shell flex items-center justify-between gap-6 py-3.5">
        <Link href="/" className="group flex items-center gap-2.5">
          {settings.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={settings.logo.url} alt={settings.siteName} className="h-8 w-auto" />
          ) : (
            <>
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--ink)] text-sm font-bold text-white shadow-[var(--shadow)]">
                {settings.siteName.slice(0, 1)}
              </span>
              <span className="font-display text-xl font-semibold tracking-tight text-[var(--ink)] transition group-hover:text-[var(--brand)]">
                {settings.siteName}
              </span>
            </>
          )}
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {(menu?.items || []).map((item) => (
            <Link
              key={item.id}
              href={item.url}
              className="rounded-full px-3.5 py-2 text-sm font-semibold text-[var(--muted)] transition hover:bg-[var(--wash)] hover:text-[var(--ink)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          {(menu?.items || []).slice(0, 3).map((item) => (
            <Link
              key={item.id}
              href={item.url}
              className="rounded-full bg-[var(--wash)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)]"
            >
              {item.label}
            </Link>
          ))}
        </div>
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
    <footer className="mt-auto border-t border-[var(--line)] bg-[var(--ink)] text-white">
      <div className="site-shell py-12">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-md">
            <p className="font-display text-2xl font-semibold tracking-tight">{settings.siteName}</p>
            <p className="mt-2 text-sm text-white/65">{settings.tagline}</p>
            <p className="mt-4 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold tracking-wide">
              {settings.ageNotice} ONLY
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-white/80">
            {(menu?.items || []).map((item) => (
              <Link key={item.id} href={item.url} className="hover:text-white">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-white/60">{settings.rgFooterText}</p>
        {rgLinks.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-4 text-sm">
            {rgLinks.map((l) => (
              <a
                key={l.url}
                href={l.url}
                className="text-[var(--accent)] underline-offset-2 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {l.label}
              </a>
            ))}
          </div>
        ) : null}
        <div className="mt-6 border-t border-white/10 pt-5 text-white/50">
          <Disclosure text={settings.affiliateDisclosure} />
        </div>
      </div>
    </footer>
  );
}
