import { put } from "@vercel/blob";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

export async function saveUpload(file: File) {
  const bytes = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filename = `${Date.now()}-${safeName}`;

  let url: string;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(filename, bytes, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: file.type || undefined,
    });
    url = blob.url;
  } else {
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), bytes);
    url = `/uploads/${filename}`;
  }

  return prisma.media.create({
    data: {
      url,
      filename: file.name,
      mimeType: file.type || "",
      size: bytes.length,
      alt: "",
    },
  });
}
