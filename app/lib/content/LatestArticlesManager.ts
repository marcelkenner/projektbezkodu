import type { ContentSummary } from "@/app/lib/content/repositories";
import { ArticleRepository } from "@/app/lib/content/repositories";

interface DatedArticle {
  article: ContentSummary;
  timestamp: number;
}

export class LatestArticlesManager {
  constructor(
    private readonly repository: ArticleRepository = new ArticleRepository(),
  ) {}

  listLatest(limit = 6): ContentSummary[] {
    const withTimestamps = this.repository
      .listSummaries()
      .map((article) => this.withTimestamp(article));

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
