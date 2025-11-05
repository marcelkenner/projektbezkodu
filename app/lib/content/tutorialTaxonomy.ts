import { getCopy } from "@/app/lib/copy";
import { getToolLabel } from "@/app/lib/tools";
import type { TaxonomyTerm } from "./articleTaxonomy";

interface TutorialTaxonomyConfig {
  categories: TaxonomyTerm[];
  tags: TaxonomyTerm[];
}

class TutorialTaxonomyCatalog {
  private readonly categories: Map<string, TaxonomyTerm>;

  private readonly tags: Map<string, TaxonomyTerm>;

  constructor(config: TutorialTaxonomyConfig) {
    this.categories = new Map(
      config.categories.map((category) => [category.slug, category]),
    );
    this.tags = new Map(config.tags.map((tag) => [tag.slug, tag]));
  }

  resolveCategories(slugs: string[] = []): TaxonomyTerm[] {
    return slugs
      .map((slug) => this.categories.get(slug))
      .filter((category): category is TaxonomyTerm => Boolean(category));
  }

  resolveTags(slugs: string[] = []): TaxonomyTerm[] {
    return slugs
      .map((slug) => this.resolveTag(slug))
      .filter((tag): tag is TaxonomyTerm => Boolean(tag));
  }

  private resolveTag(slug: string): TaxonomyTerm {
    const configured = this.tags.get(slug);
    if (configured) {
      return configured;
    }
    const toolLabel = getToolLabel(slug);
    return {
      slug,
      label: toolLabel ?? slug,
    };
  }
}

function loadTutorialTaxonomy(): TutorialTaxonomyConfig {
  const copy = getCopy("tutorials");
  const categories = copy.taxonomy?.categories ?? [];
  const tags = copy.taxonomy?.tags ?? [];
  return {
    categories,
    tags,
  };
}

export const tutorialTaxonomyCatalog = new TutorialTaxonomyCatalog(
  loadTutorialTaxonomy(),
);
