import {
  ArticleRepository,
  ComparisonRepository,
  GlossaryRepository,
  ResourceRepository,
  TutorialRepository,
  type ContentSummary,
} from "@/app/lib/content/repositories";
import { TextNormalizer } from "@/app/lib/text/TextNormalizer";
import { SearchExcerptBuilder } from "@/app/lib/search/SearchExcerptBuilder";
import { SearchScoreCalculator } from "@/app/lib/search/SearchScoreCalculator";
import type {
  SearchContentType,
  SearchRequest,
  SearchSort,
} from "@/app/lib/search/SearchRequest";

export type SearchDocumentType = Exclude<SearchContentType, "all">;

export interface SearchDocument {
  id: string;
  title: string;
  description: string;
  excerpt: string;
  path: string;
  type: SearchDocumentType;
  keywords: string[];
  publishedAt?: string;
  readingTime?: string;
}

export interface SearchResult extends SearchDocument {
  score: number;
}

export interface SearchableSummaryRepository {
  listSummaries(): ContentSummary[];
}

export interface SearchContentSource {
  type: SearchDocumentType;
  repository: SearchableSummaryRepository;
}

export class ContentSearchEngine {
  constructor(
    private readonly sources: readonly SearchContentSource[] = [
      { type: "article", repository: new ArticleRepository() },
      { type: "tutorial", repository: new TutorialRepository() },
      { type: "comparison", repository: new ComparisonRepository() },
      { type: "glossary", repository: new GlossaryRepository() },
      { type: "resource", repository: new ResourceRepository() },
    ],
    private readonly scoreCalculator = new SearchScoreCalculator(),
    private readonly excerptBuilder = new SearchExcerptBuilder(),
  ) {}

  search(request: SearchRequest): SearchResult[] {
    if (request.kind === "empty") {
      return [];
    }

    const normalizedQuery = TextNormalizer.normalize(request.query).trim();
    const queryTokens = tokenizeQuery(request.query);
    if (!normalizedQuery || !queryTokens.length) {
      return [];
    }

    return this.collectDocuments()
      .filter((document) => this.matchesType(document, request.type))
      .map((document) => ({
        ...document,
        excerpt: this.excerptBuilder.build(document.description, request.query),
        score: this.scoreCalculator.calculate(
          document,
          normalizedQuery,
          queryTokens,
        ),
      }))
      .filter((result) => result.score > 0)
      .sort((left, right) => this.compareResults(left, right, request.sort));
  }

  private matchesType(
    document: SearchDocument,
    requestedType: SearchContentType,
  ): boolean {
    return requestedType === "all" || document.type === requestedType;
  }

  private collectDocuments(): SearchDocument[] {
    return this.sources.flatMap((source) =>
      this.mapSummaries(source.repository.listSummaries(), source.type),
    );
  }

  private mapSummaries(
    summaries: ContentSummary[],
    type: SearchDocumentType,
  ): SearchDocument[] {
    return summaries.map((summary) => ({
      id: `${type}-${summary.slug}`,
      title: summary.title,
      description: summary.description ?? "",
      excerpt: summary.description ?? "",
      path: summary.path,
      type,
      keywords: this.resolveKeywords(summary),
      publishedAt: summary.date,
      readingTime: summary.meta?.duration,
    }));
  }

  private resolveKeywords(summary: ContentSummary): string[] {
    const keywords: string[] = [];
    if (summary.hero?.subheading) {
      keywords.push(summary.hero.subheading);
    }
    if (summary.meta?.tools) {
      keywords.push(...summary.meta.tools);
    }
    if (summary.meta?.difficulty) {
      keywords.push(summary.meta.difficulty);
    }
    if (summary.meta?.format) {
      keywords.push(summary.meta.format);
    }
    if (summary.meta?.time) {
      keywords.push(summary.meta.time);
    }
    if (Array.isArray(summary.meta?.topics)) {
      keywords.push(...summary.meta.topics);
    } else if (summary.meta?.topics) {
      keywords.push(summary.meta.topics);
    }
    const taxonomy = summary.taxonomy;
    if (taxonomy?.categories) {
      keywords.push(...taxonomy.categories);
    }
    if (taxonomy?.tags) {
      keywords.push(...taxonomy.tags);
    }

    return Array.from(new Set(keywords.map((keyword) => keyword.trim()))).filter(
      Boolean,
    );
  }

  private compareResults(
    left: SearchResult,
    right: SearchResult,
    sort: SearchSort,
  ): number {
    if (sort === "newest") {
      const dateComparison = this.compareByDate(left.publishedAt, right.publishedAt);
      if (dateComparison !== 0) {
        return dateComparison;
      }
    }

    if (right.score !== left.score) {
      return right.score - left.score;
    }

    const dateComparison = this.compareByDate(left.publishedAt, right.publishedAt);
    if (dateComparison !== 0) {
      return dateComparison;
    }

    return left.title.localeCompare(right.title, "pl");
  }

  private compareByDate(left?: string, right?: string): number {
    const leftValue = left ? Date.parse(left) : 0;
    const rightValue = right ? Date.parse(right) : 0;

    if (leftValue === rightValue) {
      return 0;
    }

    return rightValue - leftValue;
  }
}

function tokenizeQuery(query: string): string[] {
  const normalized = TextNormalizer.normalize(query).trim();
  if (!normalized) {
    return [];
  }

  return Array.from(
    new Set(normalized.split(/[^a-z0-9]+/).map((token) => token.trim())),
  ).filter(Boolean);
}
