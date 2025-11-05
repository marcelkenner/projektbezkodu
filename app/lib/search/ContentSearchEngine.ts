import {
  ArticleRepository,
  ComparisonRepository,
  GlossaryRepository,
  TutorialRepository,
  type ContentSummary,
} from "@/app/lib/content/repositories";
import { TextNormalizer } from "@/app/lib/text/TextNormalizer";

export type SearchDocumentType =
  | "article"
  | "tutorial"
  | "comparison"
  | "glossary";

export interface SearchDocument {
  id: string;
  title: string;
  description: string;
  path: string;
  type: SearchDocumentType;
  keywords: string[];
}

export interface SearchResult extends SearchDocument {
  score: number;
}

export class ContentSearchEngine {
  constructor(
    private readonly articleRepository = new ArticleRepository(),
    private readonly tutorialRepository = new TutorialRepository(),
    private readonly comparisonRepository = new ComparisonRepository(),
    private readonly glossaryRepository = new GlossaryRepository(),
  ) {}

  search(query: string): SearchResult[] {
    const normalizedQuery = TextNormalizer.normalize(query).trim();
    if (!normalizedQuery) {
      return [];
    }

    return this.collectDocuments()
      .map((document) => ({
        ...document,
        score: this.calculateScore(document, normalizedQuery),
      }))
      .filter((result) => result.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return a.title.localeCompare(b.title, "pl");
      });
  }

  private collectDocuments(): SearchDocument[] {
    return [
      ...this.mapSummaries(
        this.articleRepository.listSummaries(),
        "article",
      ),
      ...this.mapSummaries(
        this.tutorialRepository.listSummaries(),
        "tutorial",
      ),
      ...this.mapSummaries(
        this.comparisonRepository.listSummaries(),
        "comparison",
      ),
      ...this.mapSummaries(
        this.glossaryRepository.listSummaries(),
        "glossary",
      ),
    ];
  }

  private mapSummaries(
    summaries: ContentSummary[],
    type: SearchDocumentType,
  ): SearchDocument[] {
    return summaries.map((summary) => ({
      id: `${type}-${summary.slug}`,
      title: summary.title,
      description: summary.description ?? "",
      path: summary.path,
      type,
      keywords: this.resolveKeywords(summary),
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
    const taxonomy = summary.taxonomy;
    if (taxonomy?.categories) {
      keywords.push(...taxonomy.categories);
    }
    if (taxonomy?.tags) {
      keywords.push(...taxonomy.tags);
    }
    return keywords;
  }

  private calculateScore(
    document: SearchDocument,
    normalizedQuery: string,
  ): number {
    let score = 0;
    if (TextNormalizer.includes(document.title, normalizedQuery)) {
      score += 6;
    }
    if (TextNormalizer.includes(document.description, normalizedQuery)) {
      score += 3;
    }
    if (
      document.keywords.some((keyword) =>
        TextNormalizer.includes(keyword, normalizedQuery),
      )
    ) {
      score += 2;
    }
    if (TextNormalizer.includes(document.path, normalizedQuery)) {
      score += 1;
    }
    return score;
  }
}
