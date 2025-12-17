import { articleTaxonomyCatalog, type TaxonomyTerm } from "./articleTaxonomy";
import { ArticleRepository, type ContentSummary } from "./repositories";

export type ArticleCategoryDescriptor = TaxonomyTerm;

export class ArticleCategoryPageDirectory {
  constructor(private readonly repository = new ArticleRepository()) {}

  list(): ArticleCategoryDescriptor[] {
    return articleTaxonomyCatalog.listCategories();
  }

  get(slug: string): ArticleCategoryDescriptor | undefined {
    return articleTaxonomyCatalog.getCategory(slug);
  }

  listArticles(slug: string): ContentSummary[] {
    const articlePrefix = `/artykuly/${slug}/`;
    return this.repository
      .listSummaries()
      .filter((summary) => this.matchesCategory(summary, slug, articlePrefix))
      .sort((a, b) => {
        const dateA = a.date ? Date.parse(a.date) : 0;
        const dateB = b.date ? Date.parse(b.date) : 0;
        if (dateA === dateB) {
          return a.title.localeCompare(b.title, "pl");
        }
        return dateB - dateA;
      });
  }

  private matchesCategory(
    summary: ContentSummary,
    slug: string,
    articlePrefix: string,
  ): boolean {
    if (summary.path.startsWith(articlePrefix) && summary.path !== articlePrefix) {
      return true;
    }
    return (summary.taxonomy?.categories ?? []).includes(slug);
  }
}
