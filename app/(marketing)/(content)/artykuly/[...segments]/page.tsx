import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { ArticleHubManager } from "@/app/lib/content/ArticleHubManager";
import { ArticleRepository } from "@/app/lib/content/repositories";
import { ArtykulyHubPage } from "../ArtykulyHubPage";
import { buildArticleDetailMetadata } from "../[slug]/ArticleDetailMetadata";
import { ArticleDetailPage } from "../[slug]/ArticleDetailPage";

const hubManager = new ArticleHubManager();
const articleRepository = new ArticleRepository();
const summaries = articleRepository.listSummaries();

interface ArticleSegmentsPageProps {
  params: Promise<{ segments: string[] }>;
}

export function generateStaticParams() {
  const hubParams = hubManager.listHubParams(4);
  const hubs = hubParams
    .filter((entry) => entry.segments.length >= 2)
    .map((entry) => ({ segments: entry.segments }));

  const articleParams = summaries
    .map((summary) => summary.path)
    .filter((pathname) => pathname.startsWith("/artykuly/"))
    .map((pathname) => pathname.replace(/^\/|\/$/g, "").split("/").slice(1))
    .filter((segments) => segments.length >= 2)
    .map((segments) => ({ segments }));

  return [...hubs, ...articleParams];
}

export async function generateMetadata({
  params,
}: ArticleSegmentsPageProps): Promise<Metadata> {
  const { segments } = await params;
  const hub = hubManager.getHub(segments);
  if (hub) {
    return {
      title: `${hub.hub.label} | ProjektBezKodu`,
      description:
        hub.hub.description ??
        `Artykuły i materiały z kategorii ${hub.hub.label}.`,
      alternates: { canonical: hub.hub.href },
    };
  }

  const resolved = hubManager.resolveSegments(segments);
  const pathname = `/artykuly/${resolved.join("/")}/`;
  const article = hubManager.findArticleByPath(pathname);
  if (!article) {
    return {};
  }
  return buildArticleDetailMetadata(article.slug);
}

export default async function ArticleSegmentsPage({
  params,
}: ArticleSegmentsPageProps) {
  const { segments } = await params;
  const hub = hubManager.getHub(segments);
  if (hub) {
    if (segments.join("/") !== hub.hub.segments.join("/")) {
      permanentRedirect(hub.hub.href);
    }
    return <ArtykulyHubPage payload={hub} />;
  }

  const resolved = hubManager.resolveSegments(segments);
  const pathname = `/artykuly/${resolved.join("/")}/`;
  const article = hubManager.findArticleByPath(pathname);
  if (!article) {
    notFound();
  }
  return <ArticleDetailPage slug={article.slug} />;
}
