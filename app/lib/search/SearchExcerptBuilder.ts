import { TextNormalizer } from "@/app/lib/text/TextNormalizer";

const EXCERPT_LIMIT = 160;
const EXCERPT_CONTEXT = 48;

export class SearchExcerptBuilder {
  build(description: string, query: string): string {
    const trimmedDescription = description.trim();
    if (!trimmedDescription) {
      return "";
    }

    const queryTokens = tokenizeQuery(query);
    const matchIndex = this.findMatchIndex(trimmedDescription, queryTokens);

    if (matchIndex < 0) {
      return clampExcerpt(trimmedDescription);
    }

    const start = Math.max(0, matchIndex - EXCERPT_CONTEXT);
    const end = Math.min(
      trimmedDescription.length,
      start + EXCERPT_LIMIT,
    );
    const prefix = start > 0 ? "…" : "";
    const suffix = end < trimmedDescription.length ? "…" : "";

    return `${prefix}${trimmedDescription.slice(start, end).trim()}${suffix}`;
  }

  private findMatchIndex(description: string, queryTokens: readonly string[]) {
    if (!queryTokens.length) {
      return -1;
    }

    const candidates = queryTokens
      .map((token) => findNormalizedMatchIndex(description, token))
      .filter((index) => index >= 0);

    if (!candidates.length) {
      return -1;
    }

    return Math.min(...candidates);
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

function findNormalizedMatchIndex(value: string, normalizedNeedle: string): number {
  if (!normalizedNeedle) {
    return -1;
  }

  const positions = buildNormalizationMap(value);
  const normalizedValue = positions.map((entry) => entry.normalized).join("");
  const normalizedIndex = normalizedValue.indexOf(normalizedNeedle);

  if (normalizedIndex < 0) {
    return -1;
  }

  return positions[normalizedIndex]?.originalIndex ?? -1;
}

function buildNormalizationMap(value: string) {
  const positions: Array<{ normalized: string; originalIndex: number }> = [];

  Array.from(value).forEach((character, originalIndex) => {
    const normalized = character
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    Array.from(normalized).forEach((normalizedCharacter) => {
      positions.push({
        normalized: normalizedCharacter,
        originalIndex,
      });
    });
  });

  return positions;
}

function clampExcerpt(value: string): string {
  if (value.length <= EXCERPT_LIMIT) {
    return value;
  }

  return `${value.slice(0, EXCERPT_LIMIT).trim()}…`;
}
