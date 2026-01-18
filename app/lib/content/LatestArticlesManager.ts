import { ContentLibrary, type ContentRouteEntry } from "./contentLibrary";
import type { ContentSummary } from "@/app/lib/content/repositories";

interface DatedArticle {
  article: ContentSummary;
  timestamp: number;
}

interface LatestArticlesManagerOptions {
  includedPathPrefixes?: string[];
}

const DEFAULT_INCLUDED_PREFIXES = [
  "/artykuly/",
  "/poradniki/",
  "/porownania/",
  "/narzedzia/",
  "/zasoby/",
  "/szablony/",
] as const;

export class LatestArticlesManager {
  constructor(
    private readonly library: ContentLibrary = new ContentLibrary(),
    private readonly options: LatestArticlesManagerOptions = {},
  ) {}

  listLatest(limit = 6): ContentSummary[] {
    const withTimestamps = this.listCandidateSummaries().map((article) =>
      this.withTimestamp(article),
    );

    const dated = withTimestamps
      .filter((entry): entry is DatedArticle => entry.timestamp !== null)
      .sort((a, b) => {
        if (a.timestamp === b.timestamp) {
          return a.article.title.localeCompare(b.article.title, "pl");
        }
        return b.timestamp - a.timestamp;
      });

    const undated = withTimestamps
      .filter((entry) => entry.timestamp === null)
      .map((entry) => entry.article)
      .sort((a, b) => a.title.localeCompare(b.title, "pl"));

    return [...dated.map((entry) => entry.article), ...undated].slice(
      0,
      limit,
    );
  }

  private listCandidateSummaries(): ContentSummary[] {
    const prefixes = this.options.includedPathPrefixes ?? DEFAULT_INCLUDED_PREFIXES;
    return this.library
      .listRoutes()
      .filter((entry) => this.shouldInclude(entry, prefixes))
      .map((entry) => this.toSummary(entry));
  }

  private shouldInclude(
    entry: ContentRouteEntry,
    prefixes: readonly string[],
  ): boolean {
    if (entry.document.frontmatter.draft === true) {
      return false;
    }
    if (this.isHubType(entry.document.frontmatter.type)) {
      return false;
    }
    if (!prefixes.some((prefix) => entry.path.startsWith(prefix))) {
      return false;
    }
    return !prefixes.includes(entry.path);
  }

  private isHubType(type: unknown): boolean {
    if (typeof type !== "string") {
      return false;
    }
    return type.trim().toLowerCase() === "hub";
  }

  private toSummary(entry: ContentRouteEntry): ContentSummary {
    const frontmatter = entry.document.frontmatter;
    const hero = frontmatter.hero;
    return {
      slug: entry.document.slug,
      title: frontmatter.title,
      path: entry.path,
      description: hero?.subheading ?? entry.document.excerpt,
      hero,
      meta: frontmatter.meta,
      taxonomy: frontmatter.taxonomy,
      draft: Boolean(frontmatter.draft),
      date: frontmatter.date,
    };
  }

  private withTimestamp(article: ContentSummary) {
    const timestamp = this.parseDate(article.date);
    return { article, timestamp };
  }

  private parseDate(value?: string): number | null {
    if (!value) return null;
    const timestamp = Date.parse(value);
    return Number.isNaN(timestamp) ? null : timestamp;
  }
}
