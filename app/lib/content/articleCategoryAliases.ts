const ARTICLE_CATEGORY_ALIASES: Readonly<Record<string, string>> = {
  cms: "cms-bez-kodu",
  dostepnosc: "dostepnosc-cyfrowa",
};

export function resolveArticleCategoryAlias(categorySlug: string): string {
  return ARTICLE_CATEGORY_ALIASES[categorySlug] ?? categorySlug;
}

export function listArticleCategoryAliases(categorySlug: string): string[] {
  return Object.entries(ARTICLE_CATEGORY_ALIASES)
    .filter(([, canonicalSlug]) => canonicalSlug === categorySlug)
    .map(([alias]) => alias);
}
