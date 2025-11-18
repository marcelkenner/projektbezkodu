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
import "./resources.module.css";

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
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const coordinator = new ResourcesPageCoordinator(resolvedSearchParams);
  const { entries, filters, criteria, hasAnyResources } =
    coordinator.snapshot();

  const formatOptions = buildOptions(
    filters.formats,
    copy.filters.format.allLabel,
  );
  const topicOptions = buildOptions(
    filters.topics,
    copy.filters.topic.allLabel,
  );
  const durationOptions = buildOptions(
    filters.durations,
    copy.filters.duration.allLabel,
  );

  const hasResults = entries.length > 0;
  const collectionStructuredData = buildResourceCollectionJsonLd(entries);

  return (
    <section className="resources-page section section--surface" id="content">
      <StructuredDataScript
        id="resources-item-list"
        data={collectionStructuredData}
      />
      <div className="pbk-container pbk-stack">
        <header className="resources-page__header pbk-stack pbk-stack--tight">
          <div className="pbk-stack pbk-stack--tight">
            <h1>{copy.hero.title}</h1>
            <p>{copy.hero.intro}</p>
          </div>
          <FilterBar
            className="resources-page__filters"
            method="get"
            legend="Filtruj zasoby"
            actions={
              <Button type="submit" variant="secondary" size="compact">
                {copy.filters.submit}
              </Button>
            }
          >
            <SelectField
              id="format"
              name="format"
              label={copy.filters.format.label}
              defaultValue={criteria.format ?? ""}
              options={formatOptions}
            />
            <SelectField
              id="topic"
              name="topic"
              label={copy.filters.topic.label}
              defaultValue={criteria.topic ?? ""}
              options={topicOptions}
            />
            <SelectField
              id="duration"
              name="duration"
              label={copy.filters.duration.label}
              defaultValue={criteria.duration ?? ""}
              options={durationOptions}
            />
          </FilterBar>
        </header>

        <div className="resources-page__grid">
          {!hasResults ? (
            <div className="resources-page__empty pbk-card">
              <p>
                {hasAnyResources
                  ? copy.emptyState.noMatches
                  : copy.emptyState.noResources}
              </p>
            </div>
          ) : (
            entries.map((entry) => (
              <article key={entry.summary.slug} className="resources-card">
                <header className="resources-card__header pbk-stack pbk-stack--tight">
                  <span aria-hidden="true" className="resources-card__icon">
                    {entry.summary.title.charAt(0)}
                  </span>
                  <h2>{entry.summary.title}</h2>
                  {entry.summary.description ? (
                    <p>{entry.summary.description}</p>
                  ) : null}
                </header>
                <dl className="resources-card__meta">
                  {entry.format ? (
                    <div className="resources-card__metaItem">
                      <dt>{copy.filters.format.label}</dt>
                      <dd>{entry.format.label}</dd>
                    </div>
                  ) : null}
                  {entry.duration ? (
                    <div className="resources-card__metaItem">
                      <dt>{copy.filters.duration.label}</dt>
                      <dd>{entry.duration.label}</dd>
                    </div>
                  ) : null}
                  {entry.license ? (
                    <div className="resources-card__metaItem">
                      <dt>{copy.cards.licensePrefix}</dt>
                      <dd>{entry.license}</dd>
                    </div>
                  ) : null}
                </dl>
                {entry.topics.length ? (
                  <ul className="resources-card__tags">
                    {entry.topics.map((topic) => (
                      <li key={topic.slug}>{topic.label}</li>
                    ))}
                  </ul>
                ) : null}
                <div className="resources-card__actions">
                  {entry.downloadHref ? (
                    <Link
                      className="pbk-button pbk-button--primary"
                      href={entry.downloadHref}
                      rel="noopener"
                    >
                      {copy.cards.downloadCta}
                    </Link>
                  ) : null}
                  <Link
                    className="pbk-button pbk-button--secondary"
                    href={entry.detailsHref ?? entry.summary.path}
                  >
                    {copy.cards.detailsCta}
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
        <p className="resources-page__disclosure">{copy.disclosure}</p>
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
