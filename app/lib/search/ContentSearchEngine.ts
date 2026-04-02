import { PublicContentSearchRepository } from "@/app/lib/search/PublicContentSearchRepository";
import { TextNormalizer } from "@/app/lib/text/TextNormalizer";
import type {
  SearchDocument,
  SearchDocumentRepository,
} from "@/app/lib/search/SearchDocument";
import { SearchExcerptBuilder } from "@/app/lib/search/SearchExcerptBuilder";
import { SearchScoreCalculator } from "@/app/lib/search/SearchScoreCalculator";
import type {
  SearchContentType,
  SearchRequest,
  SearchSort,
} from "@/app/lib/search/SearchRequest";

export interface SearchResult extends SearchDocument {
  score: number;
}

export class ContentSearchEngine {
  constructor(
    private readonly repositories: readonly SearchDocumentRepository[] = [
      new PublicContentSearchRepository(),
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
    return this.repositories.flatMap((repository) => repository.listDocuments());
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
