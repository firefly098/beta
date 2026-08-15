export function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  textarea,
  rows = 4,
  step,
  min,
  max,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | boolean | null;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  rows?: number;
  step?: string;
  min?: string | number;
  max?: string | number;
}) {
  const value =
    typeof defaultValue === "boolean"
      ? undefined
      : defaultValue === null || defaultValue === undefined
        ? ""
        : String(defaultValue);

  return (
    <label className="block text-sm font-medium">
      {label}
      {textarea ? (
        <textarea
          name={name}
          defaultValue={value}
          required={required}
          rows={rows}
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
      ) : type === "checkbox" ? (
        <input
          name={name}
          type="checkbox"
          defaultChecked={Boolean(defaultValue)}
          className="ml-2 align-middle"
          value="true"
        />
      ) : (
        <input
          name={name}
          type={type}
          defaultValue={value}
          required={required}
          step={step}
          min={min}
          max={max}
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
      )}
    </label>
  );
}

export function StatusSelect({ defaultValue = "DRAFT" }: { defaultValue?: string }) {
  return (
    <label className="block text-sm font-medium">
      Status
      <select
        name="status"
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
      >
        <option value="DRAFT">Draft</option>
        <option value="PUBLISHED">Published</option>
        <option value="SCHEDULED">Scheduled</option>
      </select>
    </label>
  );
}

export function AdminPageHeader({
  title,
  actionHref,
  actionLabel,
}: {
  title: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {actionHref && actionLabel ? (
        <a
          href={actionHref}
          className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          {actionLabel}
        </a>
      ) : null}
    </div>
  );
}
