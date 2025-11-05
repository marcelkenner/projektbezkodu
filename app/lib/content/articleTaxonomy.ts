import { getCopy } from "@/app/lib/copy";

export interface TaxonomyTerm {
  slug: string;
  label: string;
  description?: string;
}

interface ArticleTaxonomyConfig {
  categories: TaxonomyTerm[];
  tags: TaxonomyTerm[];
}

export class ArticleTaxonomyCatalog {
  private readonly categories: Map<string, TaxonomyTerm>;
  private readonly tags: Map<string, TaxonomyTerm>;

  constructor(config: ArticleTaxonomyConfig) {
    this.categories = new Map(
      config.categories.map((category) => [category.slug, category]),
    );
    this.tags = new Map(config.tags.map((tag) => [tag.slug, tag]));
  }

  getCategory(slug: string): TaxonomyTerm | undefined {
    return this.categories.get(slug);
  }

  getTag(slug: string): TaxonomyTerm | undefined {
    return this.tags.get(slug);
  }

  resolveCategories(slugs: string[] = []): TaxonomyTerm[] {
    return slugs
      .map((slug) => this.getCategory(slug))
      .filter((category): category is TaxonomyTerm => Boolean(category));
  }

  resolveTags(slugs: string[] = []): TaxonomyTerm[] {
    return slugs
      .map((slug) => this.getTag(slug))
      .filter((tag): tag is TaxonomyTerm => Boolean(tag));
  }
}

function loadTaxonomy(): ArticleTaxonomyConfig {
  const copy = getCopy("articles");
  const categories = copy.taxonomy?.categories ?? [];
  const tags = copy.taxonomy?.tags ?? [];
  return {
    categories,
    tags,
  };
}

export const articleTaxonomyCatalog = new ArticleTaxonomyCatalog(loadTaxonomy());
