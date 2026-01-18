export class SlugHumanizer {
  humanize(value: string): string {
    if (!value) {
      return "";
    }

    const cleaned = value.trim();
    if (!cleaned) {
      return "";
    }

    const uppercasedKnown = this.uppercaseKnownShortSlugs(cleaned);
    return uppercasedKnown
      .split("-")
      .map((part) => this.capitalizeWord(part))
      .filter(Boolean)
      .join(" ");
  }

  private capitalizeWord(word: string): string {
    if (!word) {
      return "";
    }
    if (word.length <= 2 && /^[a-z0-9]+$/i.test(word)) {
      return word.toUpperCase();
    }
    return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
  }

  private uppercaseKnownShortSlugs(value: string): string {
    return value
      .replace(/\bai\b/gi, "AI")
      .replace(/\bcms\b/gi, "CMS")
      .replace(/\bseo\b/gi, "SEO");
  }
}

