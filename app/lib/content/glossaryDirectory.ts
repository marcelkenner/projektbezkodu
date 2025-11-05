import type { ContentSummary } from "./repositories";
import { TextNormalizer } from "../text/TextNormalizer";

export interface GlossaryFilterCriteria {
  query?: string;
}

export interface GlossaryGroup {
  letter: string;
  anchor: string;
  entries: ContentSummary[];
}

export class GlossaryDirectory {
  constructor(private readonly entries: ContentSummary[]) {}

  filter(criteria: GlossaryFilterCriteria = {}): ContentSummary[] {
    if (!criteria.query) {
      return this.sortEntries(this.entries);
    }
    const query = criteria.query ?? "";
    return this.sortEntries(
      this.entries.filter((entry) => this.matches(entry, query)),
    );
  }

  group(
    entries: ContentSummary[],
  ): GlossaryGroup[] {
    const groups = new Map<string, GlossaryGroup>();

    entries.forEach((entry) => {
      const letter = this.resolveLetter(entry);
      const anchor = `letter-${letter.toLowerCase()}`;
      const group = groups.get(letter);
      if (group) {
        group.entries.push(entry);
        return;
      }
      groups.set(letter, {
        letter,
        anchor,
        entries: [entry],
      });
    });

    return Array.from(groups.values()).sort((a, b) =>
      a.letter.localeCompare(b.letter, "pl"),
    );
  }

  private sortEntries(entries: ContentSummary[]): ContentSummary[] {
    return [...entries].sort((a, b) =>
      a.title.localeCompare(b.title, "pl"),
    );
  }

  private matches(entry: ContentSummary, query: string): boolean {
    return (
      TextNormalizer.includes(entry.title, query) ||
      TextNormalizer.includes(entry.description ?? "", query)
    );
  }

  private resolveLetter(entry: ContentSummary): string {
    const candidate = entry.title || entry.slug;
    const initial = TextNormalizer.toInitial(candidate);
    if (!initial || !/[A-Z]/.test(initial)) {
      return "#";
    }
    return initial;
  }
}
