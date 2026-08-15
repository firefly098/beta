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
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-white/90 backdrop-blur-xl">
      <div className="site-shell flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5">
          {settings.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={settings.logo.url} alt={settings.siteName} className="h-8 w-auto" />
          ) : (
            <>
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[var(--brand)] to-[#8b5cf6] text-white shadow-[var(--shadow)]">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                  <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8 5.8 21.1 7 14.2 2 9.3l6.9-1L12 2z" />
                </svg>
              </span>
              <span className="font-display text-lg font-bold tracking-tight text-[var(--ink)]">
                {settings.siteName}
              </span>
            </>
          )}
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {(menu?.items || []).map((item) => (
            <Link
              key={item.id}
              href={item.url}
              className="text-sm font-semibold text-[var(--muted)] transition hover:text-[var(--brand)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Search"
            className="grid h-10 w-10 place-items-center rounded-full text-[var(--muted)] hover:bg-[var(--wash)]"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
          </button>
          <Link href="/admin/login" className="btn-primary !px-4 !py-2.5 text-sm">
            Log In
          </Link>
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
    <footer className="mt-auto">
      <div className="border-y border-[var(--line)] bg-white">
        <div className="site-shell flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-[var(--ink)]">Trusted by players worldwide</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-[var(--muted)]">
            <span>18+ Play Responsibly</span>
            <span>Licensed & Regulated</span>
            <span>SSL Encrypted</span>
            <span>Secure Payments</span>
          </div>
        </div>
      </div>
      <div className="bg-[var(--ink)] text-white">
        <div className="site-shell py-12">
          <div className="flex flex-col gap-8 md:flex-row md:justify-between">
            <div className="max-w-sm">
              <p className="font-display text-xl font-bold">{settings.siteName}</p>
              <p className="mt-2 text-sm text-white/60">{settings.tagline}</p>
              <p className="mt-4 text-xs font-bold tracking-wide text-[var(--accent)]">
                {settings.ageNotice} ONLY
              </p>
            </div>
            <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/75">
              {(menu?.items || []).map((item) => (
                <Link key={item.id} href={item.url} className="hover:text-white">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <p className="mt-8 text-sm text-white/50">{settings.rgFooterText}</p>
          {rgLinks.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              {rgLinks.map((l) => (
                <a key={l.url} href={l.url} className="text-[var(--accent)] hover:underline" target="_blank" rel="noopener noreferrer">
                  {l.label}
                </a>
              ))}
            </div>
          ) : null}
          <div className="mt-5 border-t border-white/10 pt-5 text-white/40">
            <Disclosure text={settings.affiliateDisclosure} />
          </div>
        </div>
      </div>
    </footer>
  );
}
