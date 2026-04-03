import { TextNormalizer } from "@/app/lib/text/TextNormalizer";

export interface SearchScoreInput {
  title: string;
  description: string;
  keywords: readonly string[];
  path: string;
}

export class SearchScoreCalculator {
  calculate(
    input: SearchScoreInput,
    normalizedQuery: string,
    queryTokens: readonly string[],
  ): number {
    if (!normalizedQuery) {
      return 0;
    }

    const normalizedTitle = TextNormalizer.normalize(input.title);
    const normalizedDescription = TextNormalizer.normalize(input.description);
    const normalizedPath = TextNormalizer.normalize(input.path);
    const normalizedKeywords = input.keywords.map((keyword) =>
      TextNormalizer.normalize(keyword),
    );

    let score = 0;

    score += this.calculatePhraseScore(
      normalizedQuery,
      normalizedTitle,
      normalizedDescription,
      normalizedKeywords,
      normalizedPath,
    );

    score += this.calculateTokenScore(
      queryTokens,
      normalizedTitle,
      normalizedDescription,
      normalizedKeywords,
      normalizedPath,
    );

    return score;
  }

  private calculatePhraseScore(
    normalizedQuery: string,
    normalizedTitle: string,
    normalizedDescription: string,
    normalizedKeywords: readonly string[],
    normalizedPath: string,
  ): number {
    let score = 0;

    if (normalizedTitle === normalizedQuery) {
      score += 140;
    } else if (normalizedTitle.startsWith(normalizedQuery)) {
      score += 110;
    } else if (normalizedTitle.includes(normalizedQuery)) {
      score += 80;
    }

    if (normalizedDescription.includes(normalizedQuery)) {
      score += 45;
    }

    if (normalizedKeywords.some((keyword) => keyword.includes(normalizedQuery))) {
      score += 40;
    }

    if (normalizedPath.includes(normalizedQuery)) {
      score += 18;
    }

    return score;
  }

  private calculateTokenScore(
    queryTokens: readonly string[],
    normalizedTitle: string,
    normalizedDescription: string,
    normalizedKeywords: readonly string[],
    normalizedPath: string,
  ): number {
    if (!queryTokens.length) {
      return 0;
    }

    let score = 0;
    let matchedTokens = 0;
    let titleTokenMatches = 0;

    queryTokens.forEach((token) => {
      let tokenMatched = false;

      if (normalizedTitle.includes(token)) {
        score += 20;
        titleTokenMatches += 1;
        tokenMatched = true;
      }

      if (normalizedDescription.includes(token)) {
        score += 7;
        tokenMatched = true;
      }

      if (normalizedKeywords.some((keyword) => keyword.includes(token))) {
        score += 12;
        tokenMatched = true;
      }

      if (normalizedPath.includes(token)) {
        score += 3;
        tokenMatched = true;
      }

      if (tokenMatched) {
        matchedTokens += 1;
      }
    });

    if (titleTokenMatches === queryTokens.length) {
      score += 32;
    }

    if (matchedTokens === queryTokens.length) {
      score += 16;
    }

    return score;
  }
}
