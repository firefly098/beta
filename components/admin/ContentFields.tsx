import { parseJsonArray } from "@/lib/utils";
import { Field, StatusSelect } from "@/components/admin/FormFields";
import { SeoFields } from "@/components/admin/SeoFields";

type AuthorOption = { id: string; name: string };
type MediaOption = { id: string; filename: string; url: string };

export function AuthorSelect({
  authors,
  defaultValue,
}: {
  authors: AuthorOption[];
  defaultValue?: string | null;
}) {
  return (
    <label className="block text-sm font-medium">
      Author
      <select
        name="authorId"
        defaultValue={defaultValue || ""}
        className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
      >
        <option value="">None</option>
        {authors.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>
    </label>
  );
}

export function MediaSelect({
  media,
  name,
  label,
  defaultValue,
}: {
  media: MediaOption[];
  name: string;
  label: string;
  defaultValue?: string | null;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <select
        name={name}
        defaultValue={defaultValue || ""}
        className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
      >
        <option value="">None</option>
        {media.map((m) => (
          <option key={m.id} value={m.id}>
            {m.filename}
          </option>
        ))}
      </select>
    </label>
  );
}

export function LinesField({
  label,
  name,
  jsonValue,
}: {
  label: string;
  name: string;
  jsonValue?: string;
}) {
  const text = parseJsonArray(jsonValue).join("\n");
  return (
    <label className="block text-sm font-medium">
      {label} <span className="font-normal text-zinc-500">(one per line)</span>
      <textarea
        name={name}
        defaultValue={text}
        rows={4}
        className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
      />
    </label>
  );
}

export function CtaFields({
  defaults,
}: {
  defaults?: { ctaLabel?: string; ctaUrl?: string; ctaTracking?: string };
}) {
  return (
    <fieldset className="rounded-xl border border-zinc-200 bg-white p-4">
      <legend className="px-1 text-sm font-semibold">CTA / Affiliate</legend>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="CTA label" name="ctaLabel" defaultValue={defaults?.ctaLabel} />
        <Field label="CTA URL" name="ctaUrl" defaultValue={defaults?.ctaUrl} />
        <Field
          label="Tracking params"
          name="ctaTracking"
          defaultValue={defaults?.ctaTracking}
        />
      </div>
    </fieldset>
  );
}

export { Field, StatusSelect, SeoFields };
