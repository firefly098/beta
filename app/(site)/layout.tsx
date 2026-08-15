import { SiteFooter, SiteHeader } from "@/themes/default/Chrome";
import { getMenu, getSiteSettings } from "@/lib/site";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, header, footer] = await Promise.all([
    getSiteSettings(),
    getMenu("HEADER"),
    getMenu("FOOTER"),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader settings={settings} menu={header} />
      <div className="flex-1">{children}</div>
      <SiteFooter settings={settings} menu={footer} />
    </div>
  );
}
