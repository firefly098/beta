import { saveSettings } from "@/app/admin/actions/site";
import { Field, MediaSelect } from "@/components/admin/ContentFields";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site";
import { parseJsonObjectArray } from "@/lib/utils";

export default async function SettingsAdminPage() {
  await requireAdmin();
  const [settings, media] = await Promise.all([
    getSiteSettings(),
    prisma.media.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  const rgLinks = parseJsonObjectArray<{ label: string; url: string }>(settings.rgLinks)
    .map((l) => `${l.label} | ${l.url}`)
    .join("\n");

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Site settings</h1>
      <form action={saveSettings} className="space-y-4">
        <div className="grid gap-4 rounded-xl border border-zinc-200 bg-white p-4 sm:grid-cols-2">
          <Field label="Site name" name="siteName" defaultValue={settings.siteName} />
          <Field label="Tagline" name="tagline" defaultValue={settings.tagline} />
          <MediaSelect media={media} name="logoId" label="Logo" defaultValue={settings.logoId} />
          <MediaSelect
            media={media}
            name="faviconId"
            label="Favicon"
            defaultValue={settings.faviconId}
          />
          <MediaSelect
            media={media}
            name="defaultOgImageId"
            label="Default OG image"
            defaultValue={settings.defaultOgImageId}
          />
          <Field label="Contact email" name="contactEmail" defaultValue={settings.contactEmail} />
          <Field label="Age notice" name="ageNotice" defaultValue={settings.ageNotice} />
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <Field
            label="Affiliate disclosure"
            name="affiliateDisclosure"
            textarea
            defaultValue={settings.affiliateDisclosure}
          />
          <div className="mt-4">
            <Field
              label="Responsible gambling footer text"
              name="rgFooterText"
              textarea
              defaultValue={settings.rgFooterText}
            />
          </div>
          <label className="mt-4 block text-sm font-medium">
            RG links (Label | url per line)
            <textarea
              name="rgLinks"
              rows={4}
              defaultValue={rgLinks}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </label>
        </div>

        <div className="grid gap-4 rounded-xl border border-zinc-200 bg-white p-4 sm:grid-cols-2">
          <Field
            label="Casino SEO title template"
            name="seoTitleTemplateCasino"
            defaultValue={settings.seoTitleTemplateCasino}
          />
          <Field
            label="Casino SEO description template"
            name="seoDescTemplateCasino"
            defaultValue={settings.seoDescTemplateCasino}
          />
          <Field
            label="Bookmaker SEO title template"
            name="seoTitleTemplateBookmaker"
            defaultValue={settings.seoTitleTemplateBookmaker}
          />
          <Field
            label="Bookmaker SEO description template"
            name="seoDescTemplateBookmaker"
            defaultValue={settings.seoDescTemplateBookmaker}
          />
          <Field
            label="Bonus SEO title template"
            name="seoTitleTemplateBonus"
            defaultValue={settings.seoTitleTemplateBonus}
          />
          <Field
            label="Bonus SEO description template"
            name="seoDescTemplateBonus"
            defaultValue={settings.seoDescTemplateBonus}
          />
        </div>

        <button type="submit" className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white">
          Save settings
        </button>
      </form>
    </div>
  );
}
