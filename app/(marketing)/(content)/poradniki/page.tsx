import Link from "next/link";
import { TutorialRepository } from "@/app/lib/content/repositories";
import type { ContentSummary } from "@/app/lib/content/repositories";
import { TutorialDirectory } from "@/app/lib/content/tutorialDirectory";
import { tutorialTaxonomyCatalog } from "@/app/lib/content/tutorialTaxonomy";
import { SearchParamParser } from "@/app/lib/url/SearchParamParser";
import { defaultSiteUrlFactory } from "@/app/lib/url/SiteUrlFactory";
import {
  ArticleCard,
  ArticleGrid,
  Button,
  ContentFilterBar,
  SelectField,
  StructuredDataScript,
} from "../../../ui";
import { getCopy } from "../../../lib/copy";
import { ArticlesPagination } from "../artykuly/ArticlesPagination";

const tutorialRepository = new TutorialRepository();
const PAGE_SIZE = 12;

interface TutorialsIndexProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

function formatResultLabel(template: string, count: number): string {
  return template.replace("{count}", String(count));
}

export default async function TutorialsIndex({
  searchParams,
}: TutorialsIndexProps) {
  const copy = getCopy("tutorials");
  const allTutorials = tutorialRepository.listSummaries();
  const directory = new TutorialDirectory(allTutorials);
  const filters = directory.getFilters();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const parser = new SearchParamParser(resolvedSearchParams);
  const selectedDifficulty = parser.getSingle("difficulty");
  const selectedTool = parser.getSingle("tool");
  const pageValue = parser.getSingle("page");
  const pageNumber = pageValue ? Number(pageValue) : 1;
  const requestedPage =
    Number.isFinite(pageNumber) && pageNumber > 0 ? pageNumber : 1;
  const filteredTutorials = directory.list({
    difficulty: selectedDifficulty,
    tool: selectedTool,
  });
  const totalPages = Math.max(
    1,
    Math.ceil(filteredTutorials.length / PAGE_SIZE),
  );
  const currentPage = Math.min(requestedPage, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pagedTutorials = filteredTutorials.slice(start, end);
  const libraryEmpty = allTutorials.length === 0;

  const baseOption = "";
  const difficultyOptions = [
    { value: "", label: copy.filters.allOption },
    ...filters.difficulties.map((option) => ({
      value: option.value,
      label: `${option.label} (${option.count})`,
    })),
  ];

  const toolOptions = [
    { value: "", label: copy.filters.allOption },
    ...filters.tools.map((option) => ({
      value: option.value,
      label: `${option.label} (${option.count})`,
    })),
  ];

  const hasResults = filteredTutorials.length > 0;
  const itemListStructuredData =
    buildTutorialCollectionJsonLd(filteredTutorials);
  const paginationCopy = {
    ariaLabel: "Paginacja tutoriali",
    previous: "Poprzednia",
    next: "Następna",
  };
  const baseParams = new URLSearchParams();
  if (selectedDifficulty) baseParams.set("difficulty", selectedDifficulty);
  if (selectedTool) baseParams.set("tool", selectedTool);

  return (
    <section className="section section--surface">
      <StructuredDataScript
        id="tutorials-item-list"
        data={itemListStructuredData}
      />
      <div className="pbk-container pbk-stack">
        <div className="section__header">
          <h1>{copy.title}</h1>
          <p>{copy.intro}</p>
        </div>
        {libraryEmpty ? null : (
          <ContentFilterBar
            variant="tutorials"
            method="get"
            legend="Filtruj tutoriale"
            actions={
              <>
                <Button type="submit" variant="primary" size="compact">
                  {copy.filters.submitLabel}
                </Button>
                <Link
                  className="pbk-button pbk-button--tertiary pbk-button--compact"
                  href="/poradniki"
                  prefetch={false}
                >
                  {copy.filters.resetLabel}
                </Link>
              </>
            }
            footer={
              <p className="pbk-input__description">
                {formatResultLabel(
                  copy.filters.resultLabel,
                  filteredTutorials.length,
                )}
              </p>
            }
          >
            <SelectField
              id="difficulty"
              name="difficulty"
              label={copy.filters.difficultyLabel}
              defaultValue={selectedDifficulty ?? baseOption}
              options={difficultyOptions}
            />
            <SelectField
              id="tool"
              name="tool"
              label={copy.filters.toolLabel}
              defaultValue={selectedTool ?? baseOption}
              options={toolOptions}
            />
          </ContentFilterBar>
        )}
        <ArticleGrid>
          {libraryEmpty ? (
            <div className="pbk-card">
              <p>{copy.emptyState}</p>
            </div>
          ) : !hasResults ? (
            <div className="pbk-card">
              <p>{copy.filters.noMatches}</p>
            </div>
          ) : (
            pagedTutorials.map((tutorial) => {
              const categories = tutorialTaxonomyCatalog.resolveCategories(
                tutorial.taxonomy?.categories,
              );
              const hero = tutorial.hero?.image?.src;
              const subheading =
                tutorial.hero?.subheading ?? tutorial.description ?? "";
              const extraMeta: Array<{ label: string }> = [];
              if (tutorial.meta?.difficulty) {
                extraMeta.push({ label: tutorial.meta.difficulty });
              }
              if (categories[0]?.label) {
                extraMeta.push({ label: categories[0].label });
              }
              return (
                <ArticleCard
                  key={tutorial.slug}
                  title={tutorial.title}
                  description={subheading}
                  hero={{
                    src: hero,
                    alt: tutorial.hero?.image?.alt,
                    fallbackSrc: "/img/tutorials_hero_image.webp",
                  }}
                  href={tutorial.path}
                  meta={{
                    readingTime: tutorial.meta?.duration,
                    publishedAt: tutorial.date,
                    extra: extraMeta,
                  }}
                  ctaLabel="Czytaj tutorial"
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
          basePath="/poradniki"
        />
      </div>
    </section>
  );
}

function buildTutorialCollectionJsonLd(tutorials: ContentSummary[]) {
  if (!tutorials.length) {
    return null;
  }

  const factory = defaultSiteUrlFactory;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: tutorials.map((tutorial, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: factory.build(tutorial.path),
      name: tutorial.title,
      description: tutorial.description,
    })),
  };
}
