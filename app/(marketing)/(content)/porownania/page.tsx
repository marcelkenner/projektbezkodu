import Link from "next/link";
import { ComparisonRepository } from "@/app/lib/content/repositories";
import { comparisonTaxonomyCatalog } from "@/app/lib/content/comparisonTaxonomy";
import {
  ArticleCard,
  ArticleGrid,
  Button,
  ContentFilterBar,
  SelectField,
} from "@/app/ui";
import { getCopy } from "../../../lib/copy";
import { ArticlesPagination } from "../artykuly/ArticlesPagination";

const comparisonRepository = new ComparisonRepository();
const PAGE_SIZE = 12;

interface ComparisonsIndexProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ComparisonsIndex({
  searchParams,
}: ComparisonsIndexProps) {
  const copy = getCopy("comparisons");
  const filters =
    (
      copy as {
        filters?: {
          submit?: string;
          reset?: string;
          categoryLabel?: string;
          tagLabel?: string;
          all?: string;
        };
      }
    ).filters ?? {};
  const comparisons = comparisonRepository.listSummaries();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const selectedCategory = getFirst(resolvedSearchParams?.kategoria);
  const selectedTag = getFirst(resolvedSearchParams?.tag);
  const pageValue = getFirst(resolvedSearchParams?.page);
  const pageNumber = pageValue ? Number(pageValue) : 1;
  const requestedPage =
    Number.isFinite(pageNumber) && pageNumber > 0 ? pageNumber : 1;

  const categoryOptions = buildCategoryOptions(comparisons, filters);
  const tagOptions = buildTagOptions(comparisons, filters);

  const filtered = comparisons.filter((comparison) => {
    const categories = comparison.taxonomy?.categories ?? [];
    const tags = comparison.taxonomy?.tags ?? [];
    const matchesCategory = selectedCategory
      ? categories.includes(selectedCategory)
      : true;
    const matchesTag = selectedTag ? tags.includes(selectedTag) : true;
    return matchesCategory && matchesTag;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pagedComparisons = filtered.slice(start, end);
  const paginationCopy = {
    ariaLabel: "Paginacja porównań",
    previous: "Poprzednia",
    next: "Następna",
  };
  const baseParams = new URLSearchParams();
  if (selectedCategory) baseParams.set("kategoria", selectedCategory);
  if (selectedTag) baseParams.set("tag", selectedTag);

  return (
    <section className="section section--surface">
      <div className="pbk-container pbk-stack">
        <div className="section__header">
          <h1>{copy.title}</h1>
          <p>{copy.intro}</p>
        </div>
        <ContentFilterBar
          variant="comparisons"
          method="get"
          legend="Filtruj porównania"
          actions={
            <>
              <Button type="submit" variant="primary" size="compact">
                {filters.submit ?? "Filtruj"}
              </Button>
              <Link
                className="pbk-button pbk-button--tertiary pbk-button--compact"
                href="/porownania"
              >
                {filters.reset ?? "Wyczyść"}
              </Link>
            </>
          }
        >
          <SelectField
            id="kategoria"
            name="kategoria"
            label={filters.categoryLabel ?? "Kategoria"}
            defaultValue={selectedCategory}
            options={categoryOptions}
          />
          <SelectField
            id="tag"
            name="tag"
            label={filters.tagLabel ?? "Tag"}
            defaultValue={selectedTag}
            options={tagOptions}
          />
        </ContentFilterBar>
        <ArticleGrid>
          {filtered.length === 0 ? (
            <div className="pbk-card">
              <p>{copy.emptyState}</p>
            </div>
          ) : (
            pagedComparisons.map((comparison) => {
              const categories = comparisonTaxonomyCatalog.resolveCategories(
                comparison.taxonomy?.categories,
              );
              const tags = comparisonTaxonomyCatalog.resolveTags(
                comparison.taxonomy?.tags,
              );
              const metaItems = [
                ...(categories[0]?.label
                  ? [{ label: categories[0].label }]
                  : []),
                ...(tags.length ? [{ label: tags[0].label }] : []),
              ];
              const hero = comparison.meta?.heroImageSrc;
              return (
                <ArticleCard
                  key={comparison.slug}
                  title={comparison.title}
                  description={comparison.description}
                  hero={{
                    src: hero,
                    alt: comparison.meta?.heroImageAlt ?? comparison.title,
                    fallbackSrc: "/img/comparisons_hero_image.webp",
                  }}
                  meta={{
                    readingTime: comparison.meta?.duration,
                    publishedAt: comparison.date,
                    extra: metaItems,
                  }}
                  href={comparison.path}
                  ctaLabel="Zobacz porównanie"
                />
              );
            })
          )}
        </ArticleGrid>
        <ArticlesPagination
          copy={paginationCopy}
          currentPage={currentPage}
          totalPages={totalPages}
          baseSearchParams={baseParams}
          basePath="/porownania"
        />
      </div>
    </section>
  );
}

function buildCategoryOptions(
  comparisons: ReturnType<ComparisonRepository["listSummaries"]>,
  filters: { all?: string },
) {
  const base = [{ value: "", label: filters.all ?? "Wszystkie" }];
  const set = new Set<string>();
  comparisons.forEach((item) =>
    (item.taxonomy?.categories ?? []).forEach((cat) => cat && set.add(cat)),
  );
  return [
    base[0],
    ...Array.from(set)
      .sort((a, b) => a.localeCompare(b, "pl"))
      .map((value) => ({
        value,
        label: value,
      })),
  ];
}

function buildTagOptions(
  comparisons: ReturnType<ComparisonRepository["listSummaries"]>,
  filters: { all?: string },
) {
  const base = [{ value: "", label: filters.all ?? "Wszystkie" }];
  const set = new Set<string>();
  comparisons.forEach((item) =>
    (item.taxonomy?.tags ?? []).forEach((tag) => tag && set.add(tag)),
  );
  return [
    base[0],
    ...Array.from(set)
      .sort((a, b) => a.localeCompare(b, "pl"))
      .map((value) => ({
        value,
        label: value,
      })),
  ];
}

function getFirst(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value ?? "";
}
