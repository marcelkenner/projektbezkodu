import Link from "next/link";
import type { Metadata } from "next";
import { Button, FilterBar, SelectField, StructuredDataScript } from "@/app/ui";
import { getCopy } from "@/app/lib/copy";
import { ResourceRepository } from "@/app/lib/content/repositories";
import {
  ResourceDirectory,
  type ResourceFilterCriteria,
  type ResourceFilterOption,
} from "@/app/lib/content/resourceDirectory";
import { defaultSiteUrlFactory } from "@/app/lib/url/SiteUrlFactory";
import styles from "./resources.module.css";

const copy = getCopy("resources");
const repository = new ResourceRepository();

export const metadata: Metadata = {
  title: copy.seo.title,
  description: copy.seo.description,
  alternates: {
    canonical: copy.seo.canonical,
  },
};

interface ResourcesPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

class ResourceListingManager {
  private readonly directory: ResourceDirectory;

  constructor() {
    this.directory = new ResourceDirectory(repository.listSummaries());
  }

  list(criteria: ResourceFilterCriteria) {
    return this.directory.list(criteria);
  }

  filters() {
    return this.directory.getFilters();
  }
}

class ResourcesPageCoordinator {
  private readonly manager = new ResourceListingManager();

  constructor(
    private readonly rawSearchParams?: Record<
      string,
      string | string[] | undefined
    >,
  ) {}

  snapshot() {
    const criteria = this.parseCriteria();
    const entries = this.manager.list(criteria);
    const filters = this.manager.filters();

    return {
      criteria,
      entries,
      filters,
      hasAnyResources: this.manager.list({}).length > 0,
    };
  }

  private parseCriteria(): ResourceFilterCriteria {
    return {
      format: this.getFirst(this.rawSearchParams?.format),
      topic: this.getFirst(this.rawSearchParams?.topic),
      duration: this.getFirst(this.rawSearchParams?.duration),
    };
  }

  private getFirst(value?: string | string[]): string | undefined {
    if (Array.isArray(value)) {
      return value[0] ?? undefined;
    }
    return value ?? undefined;
  }
}

export default async function ResourcesPage({
  searchParams,
}: ResourcesPageProps) {
  return (
    <section className={`${styles.resourcesPage} section section--surface`} id="content">
      <div className="pbk-container pbk-stack">
        <header className={`${styles.resourcesPage__header} pbk-stack pbk-stack--tight`}>
          <div className="pbk-stack pbk-stack--tight">
            <h1>{copy.hero.title}</h1>
            <p>{copy.hero.intro}</p>
            <p className="pbk-card__meta">
              Pracujemy nad nową bazą zasobów. Wróć wkrótce – w międzyczasie
              sprawdź nasze artykuły i poradniki.
            </p>
          </div>
        </header>
        <div className={`${styles.resourcesPage__empty} pbk-card`}>
          <p>{copy.emptyState.noResources}</p>
          <div className={styles.resourcesCard__actions}>
            <Link className="pbk-button pbk-button--primary" href="/artykuly/">
              Przeglądaj artykuły
            </Link>
            <Link className="pbk-button pbk-button--secondary" href="/poradniki/">
              Zobacz poradniki
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function buildOptions(options: ResourceFilterOption[], defaultLabel: string) {
  return [
    { value: "", label: defaultLabel },
    ...options.map((option) => ({
      value: option.value,
      label: `${option.label} (${option.count})`,
    })),
  ];
}

function buildResourceCollectionJsonLd(
  entries: ReturnType<ResourceDirectory["list"]>,
) {
  if (!entries.length) {
    return null;
  }

  const factory = defaultSiteUrlFactory;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: entries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: factory.build(entry.summary.path),
      name: entry.summary.title,
      description: entry.summary.description,
    })),
  };
}
