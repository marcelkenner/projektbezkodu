import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { ArticleHubManager } from "@/app/lib/content/ArticleHubManager";
import { ArticleRepository } from "@/app/lib/content/repositories";
import { ArtykulyHubPage } from "../ArtykulyHubPage";

import { buildArticleDetailMetadata } from "./ArticleDetailMetadata";
import { ArticleDetailPage } from "./ArticleDetailPage";

const hubManager = new ArticleHubManager();
const articleRepository = new ArticleRepository();

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const hubs = hubManager
    .listHubParams(1)
    .map((entry) => ({ slug: entry.segments[0] }))
    .filter((entry) => entry.slug);
  const articles = articleRepository.listSlugs().map((slug) => ({ slug }));
  return [...hubs, ...articles];
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const hub = hubManager.getHub([slug]);
  if (hub) {
    return {
      title: `${hub.hub.label} | ProjektBezKodu`,
      description:
        hub.hub.description ??
        `Artykuły i materiały z kategorii ${hub.hub.label}.`,
      alternates: { canonical: hub.hub.href },
    };
  }
  return buildArticleDetailMetadata(slug);
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  const hub = hubManager.getHub([slug]);
  if (hub) {
    if (slug !== hub.hub.segments[0]) {
      permanentRedirect(hub.hub.href);
    }
    return <ArtykulyHubPage payload={hub} />;
  }

  if (!articleRepository.getArticle(slug)) {
    notFound();
  }
  return <ArticleDetailPage slug={slug} />;
}
