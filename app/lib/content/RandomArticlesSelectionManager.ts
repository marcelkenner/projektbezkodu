import type { ContentSummary } from "@/app/lib/content/repositories";

export interface ContentSummariesRepository {
  listSummaries(): ContentSummary[];
}

interface RandomArticlesSelectionParams {
  currentPath: string;
  limit: number;
  excludePaths?: string[];
  seed?: string;
}

export class RandomArticlesSelectionManager {
  constructor(private readonly repository: ContentSummariesRepository) {}

  select({
    currentPath,
    limit,
    excludePaths = [],
    seed,
  }: RandomArticlesSelectionParams): ContentSummary[] {
    const excluded = new Set<string>(
      [currentPath, ...excludePaths].filter(Boolean),
    );
    const candidates = this.repository
      .listSummaries()
      .filter((article) => !excluded.has(article.path));

    if (!candidates.length) {
      return [];
    }

    const seededRandom = this.createSeededRandom(seed ?? currentPath);
    const shuffled = [...candidates];

    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(seededRandom() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, limit);
  }

  private createSeededRandom(seed: string) {
    let h = 1779033703 ^ seed.length;
    for (let i = 0; i < seed.length; i += 1) {
      h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return () => {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      h ^= h >>> 16;
      return (h >>> 0) / 4294967296;
    };
  }
}
