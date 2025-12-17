import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { ArticleHubManager } from "@/app/lib/content/ArticleHubManager";

const hubManager = new ArticleHubManager();

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return hubManager
    .listHubParams(1)
    .map((entry) => ({ slug: entry.segments[0] }))
    .filter((entry) => entry.slug);
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const hub = hubManager.getHub([slug]);
  if (!hub) {
    return {};
  }
  return {
    title: `${hub.hub.label} | ProjektBezKodu`,
    description:
      hub.hub.description ?? `Artykuły i materiały z kategorii ${hub.hub.label}.`,
    alternates: { canonical: hub.hub.href },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const hub = hubManager.getHub([slug]);
  if (!hub) {
    notFound();
  }
  permanentRedirect(hub.hub.href);
}
