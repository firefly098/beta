"use client";

import { useMemo, useState } from "react";

type Props = {
  defaults?: {
    seoTitle?: string;
    seoDescription?: string;
    canonicalUrl?: string;
    robots?: string;
    ogTitle?: string;
    ogDescription?: string;
  };
  siteName?: string;
};

export function SeoFields({ defaults = {}, siteName = "example.com" }: Props) {
  const [title, setTitle] = useState(defaults.seoTitle || "");
  const [description, setDescription] = useState(defaults.seoDescription || "");

  const previewTitle = useMemo(() => title || "Page title", [title]);
  const previewDesc = useMemo(
    () => description || "Meta description preview appears here.",
    [description],
  );

  return (
    <fieldset className="rounded-xl border border-zinc-200 bg-white p-4">
      <legend className="px-1 text-sm font-semibold">SEO</legend>
      <label className="mt-2 block text-sm font-medium">
        SEO title
        <input
          name="seoTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
        <span
          className={`mt-1 block text-xs ${title.length > 60 ? "text-amber-600" : "text-zinc-500"}`}
        >
          {title.length}/60 characters
        </span>
      </label>
      <label className="mt-4 block text-sm font-medium">
        Meta description
        <textarea
          name="seoDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
        <span
          className={`mt-1 block text-xs ${
            description.length > 160 ? "text-amber-600" : "text-zinc-500"
          }`}
        >
          {description.length}/160 characters
        </span>
      </label>

      <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
        <p className="text-xs font-medium text-zinc-500">SERP preview</p>
        <p className="mt-2 truncate text-lg text-[#1a0dab]">{previewTitle}</p>
        <p className="truncate text-sm text-[#006621]">{siteName}</p>
        <p className="mt-1 line-clamp-2 text-sm text-zinc-600">{previewDesc}</p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Canonical URL
          <input
            name="canonicalUrl"
            defaultValue={defaults.canonicalUrl || ""}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm font-medium">
          Robots
          <input
            name="robots"
            defaultValue={defaults.robots || "index,follow"}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm font-medium">
          OG title
          <input
            name="ogTitle"
            defaultValue={defaults.ogTitle || ""}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm font-medium">
          OG description
          <input
            name="ogDescription"
            defaultValue={defaults.ogDescription || ""}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </label>
      </div>
    </fieldset>
  );
}
