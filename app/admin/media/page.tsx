import { deleteMedia, updateMediaAlt } from "@/app/admin/actions/content";
import { requireAdmin } from "@/lib/admin";
import { saveUpload } from "@/lib/media";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function uploadAction(formData: FormData) {
  "use server";
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return;
  await saveUpload(file);
  revalidatePath("/admin/media");
}

export default async function MediaLibraryPage() {
  await requireAdmin();
  const items = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Media library</h1>
      <form
        action={uploadAction}
        className="mb-8 flex flex-wrap items-end gap-3 rounded-xl border border-zinc-200 bg-white p-4"
      >
        <label className="block text-sm font-medium">
          Upload file
          <input name="file" type="file" accept="image/*" required className="mt-1 block text-sm" />
        </label>
        <button type="submit" className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white">
          Upload
        </button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((m) => {
          const saveAlt = updateMediaAlt.bind(null, m.id);
          const remove = deleteMedia.bind(null, m.id);
          return (
            <div key={m.id} className="rounded-xl border border-zinc-200 bg-white p-3">
              <div className="relative mb-3 aspect-video overflow-hidden rounded-md bg-zinc-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.url} alt={m.alt || m.filename} className="h-full w-full object-contain" />
              </div>
              <p className="truncate text-xs text-zinc-500">{m.id}</p>
              <p className="truncate text-sm font-medium">{m.filename}</p>
              <form action={saveAlt} className="mt-2 flex gap-2">
                <input
                  name="alt"
                  defaultValue={m.alt}
                  placeholder="Alt text"
                  className="flex-1 rounded-md border border-zinc-300 px-2 py-1 text-sm"
                />
                <button type="submit" className="text-sm text-zinc-700 hover:underline">
                  Save
                </button>
              </form>
              <form action={remove} className="mt-2">
                <button type="submit" className="text-xs text-red-600 hover:underline">
                  Delete
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}
