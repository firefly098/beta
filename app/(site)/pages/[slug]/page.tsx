import { JsonLd, RgBlock } from "@/themes/default/ui";
import { prisma } from "@/lib/prisma";
import { publishedWhere } from "@/lib/publish";
import { resolveSeo } from "@/lib/site";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await prisma.page.findFirst({
    where: { slug, ...publishedWhere },
    include: { ogImage: true },
  });
  if (!item) return {};
  const seo = await resolveSeo("page", { ...item, title: item.title });
  return {
    title: seo.title,
    description: seo.description,
    robots: seo.robots,
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: seo.ogImage ? [seo.ogImage] : undefined,
    },
  };
}

export default async function CmsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const redirectRow = await prisma.redirect.findUnique({
    where: { fromPath: `/pages/${slug}` },
  });
  if (redirectRow) redirect(redirectRow.toPath);

  const item = await prisma.page.findFirst({
    where: { slug, ...publishedWhere },
    include: { author: true },
  });
  if (!item) notFound();
  const seo = await resolveSeo("page", { ...item, title: item.title });

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: item.title,
          description: seo.description,
        }}
      />
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold">{item.title}</h1>
      {item.author ? (
        <p className="mt-2 text-sm text-[var(--muted)]">By {item.author.name}</p>
      ) : null}
      <article className="prose-cms mt-8" dangerouslySetInnerHTML={{ __html: item.body }} />
      <RgBlock text={seo.settings.rgFooterText} />
    </main>
  );
}
