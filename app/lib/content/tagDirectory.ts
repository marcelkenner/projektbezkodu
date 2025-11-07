import { getCopy } from "@/app/lib/copy";
import { articleTaxonomyCatalog } from "./articleTaxonomy";
import { ArticleRepository, type ContentSummary } from "./repositories";

export interface TagDescriptor {
  slug: string;
  label: string;
  description?: string;
}

interface TagCopy {
  descriptions?: Record<string, string>;
}

export class TagDirectory {
  private readonly descriptions: Record<string, string>;
  private readonly repository: ArticleRepository;

  constructor(repository = new ArticleRepository()) {
    const copy = getCopy("tags") as TagCopy;
    this.descriptions = copy.descriptions ?? {};
    this.repository = repository;
  }

  list(): TagDescriptor[] {
    return articleTaxonomyCatalog.listTags().map((tag) => ({
      ...tag,
      description: this.descriptions[tag.slug],
    }));
  }

  get(slug: string): TagDescriptor | undefined {
    const tag = articleTaxonomyCatalog.getTag(slug);
    if (!tag) {
      return undefined;
    }
    return {
      ...tag,
      description: this.descriptions[slug],
    };
  }

  listArticles(slug: string): ContentSummary[] {
    return this.repository
      .listSummaries()
      .filter((summary) => (summary.taxonomy?.tags ?? []).includes(slug))
      .sort((a, b) => {
        const dateA = a.date ? Date.parse(a.date) : 0;
        const dateB = b.date ? Date.parse(b.date) : 0;
        if (dateA === dateB) {
          return a.title.localeCompare(b.title, "pl");
        }
        return dateB - dateA;
      });
  }
}
