import type { Frontmatter } from "@/app/lib/frontmatter";
import {
  ContentLibrary,
  type ContentRouteEntry,
} from "@/app/lib/content/contentLibrary";
import {
  GlossaryRepository,
  type ContentSummary,
} from "@/app/lib/content/repositories";
import {
  buildSearchDocumentId,
  type SearchDocument,
  type SearchDocumentRepository,
  type SearchDocumentType,
} from "@/app/lib/search/SearchDocument";

export class PublicContentSearchRepository implements SearchDocumentRepository {
  constructor(
    private readonly library = new ContentLibrary(),
    private readonly glossaryRepository = new GlossaryRepository(),
  ) {}

  listDocuments(): SearchDocument[] {
    const documents = [
      ...this.library.listRoutes().map((route) => this.mapRoute(route)),
      ...this.glossaryRepository
        .listSummaries()
        .map((summary) => this.mapGlossarySummary(summary)),
    ];

    return Array.from(
      new Map(documents.map((document) => [document.path, document])).values(),
    );
  }

  private mapRoute(route: ContentRouteEntry): SearchDocument {
    const { document } = route;
    const { frontmatter } = document;
    const type = resolveRouteSearchType(route);
    const title = resolveTitle(route);
    const description = resolveDescription(frontmatter, document.excerpt);

    return {
      id: buildSearchDocumentId(type, route.path),
      title,
      description,
      excerpt: description,
      path: route.path,
      type,
      keywords: resolveKeywords(frontmatter),
      publishedAt: frontmatter.date,
      readingTime: frontmatter.meta?.duration,
    };
  }

  private mapGlossarySummary(summary: ContentSummary): SearchDocument {
    return {
      id: buildSearchDocumentId("glossary", summary.path),
      title: summary.title,
      description: summary.description ?? "",
      excerpt: summary.description ?? "",
      path: summary.path,
      type: "glossary",
      keywords: resolveSummaryKeywords(summary),
      publishedAt: summary.date,
      readingTime: summary.meta?.duration,
    };
  }
}

function resolveRouteSearchType(route: ContentRouteEntry): SearchDocumentType {
  const path = route.path;

  if (path.startsWith("/artykuly/")) {
    return isHubRoute(route) ? "page" : "article";
  }
  if (path.startsWith("/poradniki/")) {
    return "tutorial";
  }
  if (path.startsWith("/porownania/")) {
    return "comparison";
  }
  if (path.startsWith("/zasoby/")) {
    return "resource";
  }
  if (path.startsWith("/narzedzia/")) {
    return "tool";
  }

  return "page";
}

function isHubRoute(route: ContentRouteEntry): boolean {
  return route.document.frontmatter.type?.trim().toLowerCase() === "hub";
}

function resolveTitle(route: ContentRouteEntry): string {
  return (
    route.document.frontmatter.title ??
    route.document.frontmatter.hero?.heading ??
    route.segments.at(-1)?.replace(/-/g, " ") ??
    "Treść"
  );
}

function resolveDescription(frontmatter: Frontmatter, excerpt: string): string {
  return (
    frontmatter.hero?.subheading ??
    frontmatter.seo?.description ??
    excerpt
  );
}

function resolveKeywords(frontmatter: Frontmatter): string[] {
  return collectKeywords({
    heroSubheading: frontmatter.hero?.subheading,
    seoTitle: frontmatter.seo?.title,
    seoDescription: frontmatter.seo?.description,
    seoKeywords: frontmatter.seo?.keywords,
    difficulty: frontmatter.meta?.difficulty,
    duration: frontmatter.meta?.duration,
    tools: frontmatter.meta?.tools,
    format: frontmatter.meta?.format,
    topics: frontmatter.meta?.topics,
    time: frontmatter.meta?.time,
    stack: frontmatter.meta?.stack,
    license: frontmatter.meta?.license,
    period: frontmatter.meta?.period,
    industry: frontmatter.meta?.industry,
    summaryBullets: frontmatter.meta?.summaryBullets,
    categories: frontmatter.taxonomy?.categories,
    tags: frontmatter.taxonomy?.tags,
  });
}

function resolveSummaryKeywords(summary: ContentSummary): string[] {
  return collectKeywords({
    heroSubheading: summary.hero?.subheading,
    tools: summary.meta?.tools,
    difficulty: summary.meta?.difficulty,
    duration: summary.meta?.duration,
    format: summary.meta?.format,
    topics: summary.meta?.topics,
    time: summary.meta?.time,
    stack: summary.meta?.stack,
    license: summary.meta?.license,
    period: summary.meta?.period,
    industry: summary.meta?.industry,
    summaryBullets: summary.meta?.summaryBullets,
    categories: summary.taxonomy?.categories,
    tags: summary.taxonomy?.tags,
  });
}

function collectKeywords(input: {
  heroSubheading?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  difficulty?: string;
  duration?: string;
  tools?: string[];
  format?: string;
  topics?: string[] | string;
  time?: string;
  stack?: string[];
  license?: string;
  period?: string;
  industry?: string;
  summaryBullets?: string[];
  categories?: string[];
  tags?: string[];
}): string[] {
  const keywords: string[] = [];

  if (input.heroSubheading) {
    keywords.push(input.heroSubheading);
  }
  if (input.seoTitle) {
    keywords.push(input.seoTitle);
  }
  if (input.seoDescription) {
    keywords.push(input.seoDescription);
  }
  if (input.seoKeywords) {
    keywords.push(...input.seoKeywords);
  }
  if (input.difficulty) {
    keywords.push(input.difficulty);
  }
  if (input.duration) {
    keywords.push(input.duration);
  }
  if (input.tools) {
    keywords.push(...input.tools);
  }
  if (input.format) {
    keywords.push(input.format);
  }
  if (Array.isArray(input.topics)) {
    keywords.push(...input.topics);
  } else if (input.topics) {
    keywords.push(input.topics);
  }
  if (input.time) {
    keywords.push(input.time);
  }
  if (input.stack) {
    keywords.push(...input.stack);
  }
  if (input.license) {
    keywords.push(input.license);
  }
  if (input.period) {
    keywords.push(input.period);
  }
  if (input.industry) {
    keywords.push(input.industry);
  }
  if (input.summaryBullets) {
    keywords.push(...input.summaryBullets);
  }
  if (input.categories) {
    keywords.push(...input.categories);
  }
  if (input.tags) {
    keywords.push(...input.tags);
  }

  return Array.from(
    new Set(
      keywords
        .map((keyword) => keyword.trim())
        .filter(Boolean),
    ),
  );
}
