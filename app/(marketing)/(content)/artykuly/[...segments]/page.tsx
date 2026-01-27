import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { ArticleHubManager } from "@/app/lib/content/ArticleHubManager";
import { ArticleCategoryFolderDirectory } from "@/app/lib/content/ArticleCategoryFolderDirectory";
import { ContentLibrary } from "@/app/lib/content/contentLibrary";
import { ArticleRepository } from "@/app/lib/content/repositories";
import { ArtykulyHubPage } from "../ArtykulyHubPage";
import { buildArticleDetailMetadata } from "../article/ArticleDetailMetadata";
import { ArticleDetailPage } from "../article/ArticleDetailPage";

const hubManager = new ArticleHubManager();
const categoryFolderDirectory = new ArticleCategoryFolderDirectory();
const articleRepository = new ArticleRepository();
const contentLibrary = new ContentLibrary();
const summaries = articleRepository.listSummaries();

interface ArticleSegmentsPageProps {
  params: Promise<{ segments: string[] }>;
}

export function generateStaticParams() {
  const hubParams = hubManager.listHubParams(4);
  const hubs = hubParams
    .filter((entry) => entry.segments.length >= 1)
    .map((entry) => ({ segments: entry.segments }));

  const categoryFolders = categoryFolderDirectory
    .listSlugs()
    .map((slug) => ({ segments: [slug] }));

  const articleParams = summaries
    .map((summary) => summary.path)
    .filter((pathname) => pathname.startsWith("/artykuly/"))
    .map((pathname) => pathname.replace(/^\/|\/$/g, "").split("/").slice(1))
    .filter((segments) => segments.length >= 2)
    .map((segments) => ({ segments }));

  return dedupeStaticParams([...hubs, ...categoryFolders, ...articleParams]);
}

function dedupeStaticParams(entries: Array<{ segments: string[] }>) {
  const seen = new Set<string>();
  const resolved: Array<{ segments: string[] }> = [];
  entries.forEach((entry) => {
    const key = entry.segments.join("/");
    if (!key || seen.has(key)) {
      return;
    }
    seen.add(key);
    resolved.push(entry);
  });
  return resolved;
}

export async function generateMetadata({
  params,
}: ArticleSegmentsPageProps): Promise<Metadata> {
  const { segments } = await params;
  if (segments.length > 3) {
    return {};
  }
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
    const entry = contentLibrary.getEntry(["artykuly", ...resolved]);
    if (!entry || isHubType(entry.document.frontmatter.type)) {
      return {};
    }
    return buildArticleDetailMetadata(entry.document.slug);
  }
  return buildArticleDetailMetadata(article.slug);
}

export default async function ArticleSegmentsPage({
  params,
}: ArticleSegmentsPageProps) {
  const { segments } = await params;
  if (segments.length > 3) {
    notFound();
  }
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
    const entry = contentLibrary.getEntry(["artykuly", ...resolved]);
    if (!entry || isHubType(entry.document.frontmatter.type)) {
      notFound();
    }
    if (entry.path !== pathname) {
      permanentRedirect(entry.path);
    }
    return <ArticleDetailPage slug={entry.document.slug} />;
  }
  return <ArticleDetailPage slug={article.slug} />;
}

function isHubType(type: unknown): boolean {
  if (typeof type !== "string") {
    return false;
  }
  return type.trim().toLowerCase() === "hub";
}
