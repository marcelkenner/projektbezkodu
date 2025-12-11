import { getCopy } from "@/app/lib/copy";
import { ArticleCategoryDirectory } from "@/app/lib/content/articleCategoryDirectory";

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

  listCategories(): TaxonomyTerm[] {
    return Array.from(this.categories.values()).sort((a, b) =>
      a.label.localeCompare(b.label, "pl"),
    );
  }

  listTags(): TaxonomyTerm[] {
    return Array.from(this.tags.values()).sort((a, b) =>
      a.label.localeCompare(b.label, "pl"),
    );
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
  const directory = new ArticleCategoryDirectory();
  const copyCategories = copy.taxonomy?.categories ?? [];
  const copyCategoryMap = new Map(
    copyCategories.map((category) => [category.slug, category]),
  );

  const contentCategories = directory.listCategories();
  const categories =
    contentCategories.length > 0
      ? contentCategories.map((category) => {
          const override = copyCategoryMap.get(category.slug);
          return {
            ...category,
            label: override?.label ?? category.label,
            description: override?.description ?? category.description,
          };
        })
      : copyCategories;
  const tags = copy.taxonomy?.tags ?? [];
  return {
    categories,
    tags,
  };
}

export const articleTaxonomyCatalog = new ArticleTaxonomyCatalog(
  loadTaxonomy(),
);
