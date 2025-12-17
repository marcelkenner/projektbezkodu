import type { ContentLibrary } from "@/app/lib/content/contentLibrary";
import type { ContentSummary } from "@/app/lib/content/repositories";
import {
  ArticleRepository,
  ComparisonRepository,
  TutorialRepository,
} from "@/app/lib/content/repositories";

export class ContentRecommendationsRepository {
  private readonly articleRepository: ArticleRepository;
  private readonly tutorialRepository: TutorialRepository;
  private readonly comparisonRepository: ComparisonRepository;

  constructor(library?: ContentLibrary) {
    this.articleRepository = new ArticleRepository(library);
    this.tutorialRepository = new TutorialRepository();
    this.comparisonRepository = new ComparisonRepository();
  }

  listSummaries(): ContentSummary[] {
    const combined = [
      ...this.articleRepository.listSummaries(),
      ...this.tutorialRepository.listSummaries(),
      ...this.comparisonRepository.listSummaries(),
    ];

    const seen = new Set<string>();
    const unique: ContentSummary[] = [];

    combined.forEach((summary) => {
      if (seen.has(summary.path)) {
        return;
      }
      seen.add(summary.path);
      unique.push(summary);
    });

    return unique;
  }
}

