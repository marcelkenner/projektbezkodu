import { getCopy } from "@/app/lib/copy";
import { ArticleRepository, type ContentSummary } from "./repositories";

export interface AuthorLink {
  label: string;
  href: string;
  rel?: string;
}

export interface AuthorProfile {
  slug: string;
  name: string;
  bio: string;
  avatar: string;
  links?: AuthorLink[];
}

export interface AuthorStats {
  articleCount: number;
  totalReadingMinutes: number;
}

class ReadingTimeCalculator {
  parseToMinutes(value?: string): number {
    if (!value) {
      return 0;
    }
    const numeric = Number.parseInt(value.replace(/\D/g, ""), 10);
    return Number.isNaN(numeric) ? 0 : numeric;
  }

  sumMinutes(articles: ContentSummary[]): number {
    return articles.reduce(
      (total, article) => total + this.parseToMinutes(article.meta?.duration),
      0,
    );
  }
}

export class AuthorDirectory {
  private readonly authorsBySlug: Map<string, AuthorProfile>;
  private readonly repository: ArticleRepository;
  private readonly readingTime = new ReadingTimeCalculator();

  constructor(repository = new ArticleRepository()) {
    const copy = getCopy("articles");
    this.authorsBySlug = new Map(
      (copy.authors ?? []).map((author) => [author.slug, author]),
    );
    this.repository = repository;
  }

  listProfiles(): AuthorProfile[] {
    return Array.from(this.authorsBySlug.values()).sort((a, b) =>
      a.name.localeCompare(b.name, "pl"),
    );
  }

  getProfile(slug: string): AuthorProfile | undefined {
    return this.authorsBySlug.get(slug);
  }

  getStats(slug: string): AuthorStats {
    const articles = this.repository
      .listSummaries()
      .filter((summary) => summary.meta?.author === slug);

    return {
      articleCount: articles.length,
      totalReadingMinutes: this.readingTime.sumMinutes(articles),
    };
  }

  listArticles(slug: string): ContentSummary[] {
    return this.repository
      .listSummaries()
      .filter((summary) => summary.meta?.author === slug)
      .sort((a, b) => {
        const dateA = a.date ? Date.parse(a.date) : 0;
        const dateB = b.date ? Date.parse(b.date) : 0;
        if (dateA === dateB) {
          return a.title.localeCompare(b.title, "pl");
        }
        return dateB - dateA;
      });
  }
}
