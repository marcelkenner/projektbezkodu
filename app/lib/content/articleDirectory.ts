import type { ContentSummary } from "./repositories";
import { TextNormalizer } from "../text/TextNormalizer";

export interface ArticleFilterCriteria {
  query?: string;
  category?: string;
  readingTime?: string;
  tags?: string[];
}

export class ArticleDirectory {
  constructor(private readonly articles: ContentSummary[]) {}

  list(criteria: ArticleFilterCriteria = {}): ContentSummary[] {
    return this.articles.filter((article) => {
      const matchesQuery = this.matchesQuery(article, criteria.query);
      const matchesCategory = this.matchesCategory(article, criteria.category);
      const matchesReadingTime = this.matchesReadingTime(
        article,
        criteria.readingTime,
      );
      const matchesTags = this.matchesTags(article, criteria.tags);
      return (
        matchesQuery && matchesCategory && matchesReadingTime && matchesTags
      );
    });
  }

  private matchesQuery(article: ContentSummary, query?: string): boolean {
    if (!query) {
      return true;
    }
    const normalizedQuery = TextNormalizer.slugify(query);
    if (!normalizedQuery) {
      return true;
    }
    const haystack = [
      article.title,
      article.description,
      article.hero?.subheading,
    ]
      .filter(Boolean)
      .map((value) => TextNormalizer.slugify(value as string))
      .join(" ");
    return haystack.includes(normalizedQuery);
  }

  private matchesCategory(article: ContentSummary, category?: string): boolean {
    if (!category) {
      return true;
    }
    const categories = article.taxonomy?.categories ?? [];
    return categories.includes(category);
  }

  private matchesReadingTime(
    article: ContentSummary,
    readingTime?: string,
  ): boolean {
    if (!readingTime) {
      return true;
    }
    const duration = article.meta?.duration ?? "";
    const minutes = this.extractMinutes(duration);
    if (minutes === undefined) {
      return false;
    }
    const threshold = Number(readingTime);
    if (Number.isNaN(threshold)) {
      return true;
    }
    if (threshold >= 15) {
      return minutes >= threshold;
    }
    return minutes <= threshold;
  }

  private extractMinutes(value: string): number | undefined {
    const match = value.match(/\d+/);
    if (!match) {
      return undefined;
    }
    const minutes = Number(match[0]);
    if (Number.isNaN(minutes)) {
      return undefined;
    }
    return minutes;
  }

  private matchesTags(article: ContentSummary, tags: string[] = []): boolean {
    if (!tags.length) {
      return true;
    }
    const articleTags = new Set(article.taxonomy?.tags ?? []);
    return tags.some((tag) => articleTags.has(tag));
  }
}
