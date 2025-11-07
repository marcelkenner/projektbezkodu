export class TextNormalizer {
  static normalize(value: string): string {
    return TextNormalizer.stripDiacritics(value).toLowerCase();
  }

  static slugify(value: string): string {
    const normalized = TextNormalizer.normalize(value);
    return normalized.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }

  static toInitial(value: string): string {
    const normalized = TextNormalizer.stripDiacritics(value).toUpperCase();
    return normalized.charAt(0) || "";
  }

  static includes(haystack: string, needle: string): boolean {
    if (!haystack || !needle) {
      return false;
    }
    const normalizedHaystack = TextNormalizer.normalize(haystack);
    const normalizedNeedle = TextNormalizer.normalize(needle);
    return normalizedHaystack.includes(normalizedNeedle);
  }

  private static stripDiacritics(value: string): string {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
}
