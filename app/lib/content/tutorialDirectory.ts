import type { ContentSummary } from "./repositories";
import { TextNormalizer } from "../text/TextNormalizer";

export interface TutorialFilterCriteria {
  difficulty?: string;
  tool?: string;
}

export interface TutorialFilterOption {
  value: string;
  label: string;
  count: number;
}

export interface TutorialFilterSet {
  difficulties: TutorialFilterOption[];
  tools: TutorialFilterOption[];
}

export class TutorialDirectory {
  constructor(private readonly tutorials: ContentSummary[]) {}

  list(criteria: TutorialFilterCriteria = {}): ContentSummary[] {
    return this.tutorials.filter((tutorial) => {
      const matchesDifficulty = this.matchesDifficulty(
        tutorial,
        criteria.difficulty,
      );
      const matchesTool = this.matchesTool(tutorial, criteria.tool);
      return matchesDifficulty && matchesTool;
    });
  }

  getFilters(): TutorialFilterSet {
    const difficultyMap = new Map<string, TutorialFilterOption>();
    const toolMap = new Map<string, TutorialFilterOption>();

    this.tutorials.forEach((tutorial) => {
      const difficulty = (tutorial.meta?.difficulty ?? "").trim();
      if (difficulty) {
        const slug = TextNormalizer.slugify(difficulty);
        const existing = difficultyMap.get(slug);
        if (existing) {
          difficultyMap.set(slug, {
            ...existing,
            count: existing.count + 1,
          });
        } else {
          difficultyMap.set(slug, {
            value: slug,
            label: difficulty,
            count: 1,
          });
        }
      }

      (tutorial.meta?.tools ?? []).forEach((tool) => {
        const normalizedTool = tool.trim();
        if (!normalizedTool) {
          return;
        }
        const slug = TextNormalizer.slugify(normalizedTool);
        const existing = toolMap.get(slug);
        if (existing) {
          toolMap.set(slug, {
            ...existing,
            count: existing.count + 1,
          });
        } else {
          toolMap.set(slug, {
            value: slug,
            label: normalizedTool,
            count: 1,
          });
        }
      });
    });

    return {
      difficulties: Array.from(difficultyMap.values()).sort((a, b) =>
        a.label.localeCompare(b.label, "pl"),
      ),
      tools: Array.from(toolMap.values()).sort((a, b) =>
        a.label.localeCompare(b.label, "pl"),
      ),
    };
  }

  private matchesDifficulty(
    tutorial: ContentSummary,
    difficulty?: string,
  ): boolean {
    if (!difficulty) {
      return true;
    }
    const tutorialDifficulty = tutorial.meta?.difficulty;
    if (!tutorialDifficulty) {
      return false;
    }
    return TextNormalizer.slugify(tutorialDifficulty) === difficulty;
  }

  private matchesTool(tutorial: ContentSummary, tool?: string): boolean {
    if (!tool) {
      return true;
    }
    return (tutorial.meta?.tools ?? [])
      .map((item) => TextNormalizer.slugify(item))
      .includes(tool);
  }
}
