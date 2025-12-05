import Link from "next/link";
import { ComparisonRepository } from "@/app/lib/content/repositories";
import { comparisonTaxonomyCatalog } from "@/app/lib/content/comparisonTaxonomy";
import {
  Button,
  ContentFilterBar,
  SelectField,
  ContentCard,
} from "@/app/ui";
import { getCopy } from "../../../lib/copy";

const comparisonRepository = new ComparisonRepository();

interface ComparisonsIndexProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ComparisonsIndex({
  searchParams,
}: ComparisonsIndexProps) {
  const copy = getCopy("comparisons");
  const comparisons = comparisonRepository.listSummaries();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const selectedCategory = getFirst(resolvedSearchParams?.kategoria);
  const selectedTag = getFirst(resolvedSearchParams?.tag);

  const categoryOptions = buildCategoryOptions(comparisons, copy);
  const tagOptions = buildTagOptions(comparisons, copy);

  const filtered = comparisons.filter((comparison) => {
    const categories = comparison.taxonomy?.categories ?? [];
    const tags = comparison.taxonomy?.tags ?? [];
    const matchesCategory = selectedCategory
      ? categories.includes(selectedCategory)
      : true;
    const matchesTag = selectedTag ? tags.includes(selectedTag) : true;
    return matchesCategory && matchesTag;
  });

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
                {copy.filters?.submit ?? "Filtruj"}
              </Button>
              <Link
                className="pbk-button pbk-button--tertiary pbk-button--compact"
                href="/porownania"
              >
                {copy.filters?.reset ?? "Wyczyść"}
              </Link>
            </>
          }
        >
          <SelectField
            id="kategoria"
            name="kategoria"
            label={copy.filters?.categoryLabel ?? "Kategoria"}
            defaultValue={selectedCategory}
            options={categoryOptions}
          />
          <SelectField
            id="tag"
            name="tag"
            label={copy.filters?.tagLabel ?? "Tag"}
            defaultValue={selectedTag}
            options={tagOptions}
          />
        </ContentFilterBar>
        <div className="articles-grid">
          {filtered.length === 0 ? (
            <div className="pbk-card">
              <p>{copy.emptyState}</p>
            </div>
          ) : (
            filtered.map((comparison) => {
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
              return (
                <ContentCard
                  key={comparison.slug}
                  title={comparison.title}
                  subheading={comparison.description}
                  heroSrc={
                    comparison.meta?.heroImageSrc ??
                    "/img/comparisons_hero_image.webp.jpeg"
                  }
                  heroAlt={comparison.meta?.heroImageAlt}
                  meta={metaItems}
                  href={comparison.path}
                  ctaLabel="Zobacz porównanie"
                />
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

function buildCategoryOptions(comparisons, copy) {
  const base = [{ value: "", label: copy.filters?.all ?? "Wszystkie" }];
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

function buildTagOptions(comparisons, copy) {
  const base = [{ value: "", label: copy.filters?.all ?? "Wszystkie" }];
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
