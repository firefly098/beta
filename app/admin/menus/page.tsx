import { saveMenu } from "@/app/admin/actions/site";
import { requireAdmin } from "@/lib/admin";
import { getMenu } from "@/lib/site";

function itemsToText(
  items: { label: string; url: string; children?: { label: string; url: string }[] }[],
) {
  const lines: string[] = [];
  for (const item of items) {
    lines.push(`${item.label} | ${item.url}`);
    for (const child of item.children || []) {
      lines.push(`${child.label} | ${child.url}`);
    }
  }
  return lines.join("\n");
}

export default async function MenusAdminPage() {
  await requireAdmin();
  const [header, footer] = await Promise.all([getMenu("HEADER"), getMenu("FOOTER")]);

  const saveHeader = saveMenu.bind(null, "HEADER");
  const saveFooter = saveMenu.bind(null, "FOOTER");

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold tracking-tight">Menus</h1>
      <p className="mb-6 text-sm text-zinc-500">
        One item per line as <code className="rounded bg-zinc-100 px-1">Label | /url</code>
      </p>
      <div className="grid gap-6 lg:grid-cols-2">
        <form action={saveHeader} className="rounded-xl border border-zinc-200 bg-white p-4">
          <h2 className="font-medium">Header menu</h2>
          <textarea
            name="items"
            rows={10}
            defaultValue={itemsToText(header?.items || [])}
            className="mt-3 w-full rounded-md border border-zinc-300 px-3 py-2 font-mono text-sm"
          />
          <button
            type="submit"
            className="mt-3 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
          >
            Save header
          </button>
        </form>
        <form action={saveFooter} className="rounded-xl border border-zinc-200 bg-white p-4">
          <h2 className="font-medium">Footer menu</h2>
          <textarea
            name="items"
            rows={10}
            defaultValue={itemsToText(footer?.items || [])}
            className="mt-3 w-full rounded-md border border-zinc-300 px-3 py-2 font-mono text-sm"
          />
          <button
            type="submit"
            className="mt-3 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
          >
            Save footer
          </button>
        </form>
      </div>
    </div>
  );
}
