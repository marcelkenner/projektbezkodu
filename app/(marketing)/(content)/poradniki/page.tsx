import Link from "next/link";
import { TutorialRepository } from "@/app/lib/content/repositories";
import type { ContentSummary } from "@/app/lib/content/repositories";
import { TutorialDirectory } from "@/app/lib/content/tutorialDirectory";
import { tutorialTaxonomyCatalog } from "@/app/lib/content/tutorialTaxonomy";
import { SearchParamParser } from "@/app/lib/url/SearchParamParser";
import { defaultSiteUrlFactory } from "@/app/lib/url/SiteUrlFactory";
import {
  Button,
  ContentFilterBar,
  SelectField,
  StructuredDataScript,
  ContentCard,
} from "../../../ui";
import { getCopy } from "../../../lib/copy";

const tutorialRepository = new TutorialRepository();

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
  const filteredTutorials = directory.list({
    difficulty: selectedDifficulty,
    tool: selectedTool,
  });
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
        <div className="articles-grid">
          {libraryEmpty ? (
            <div className="pbk-card">
              <p>{copy.emptyState}</p>
            </div>
          ) : !hasResults ? (
            <div className="pbk-card">
              <p>{copy.filters.noMatches}</p>
            </div>
          ) : (
            filteredTutorials.map((tutorial) => {
              const categories = tutorialTaxonomyCatalog.resolveCategories(
                tutorial.taxonomy?.categories,
              );
              const hero = tutorial.hero?.image?.src;
              const subheading = tutorial.hero?.subheading ?? tutorial.excerpt;
              const metaItems: Array<{ label: string }> = [];
              if (tutorial.meta?.difficulty) {
                metaItems.push({ label: tutorial.meta.difficulty });
              }
              if (tutorial.meta?.duration) {
                metaItems.push({ label: tutorial.meta.duration });
              }
              if (categories[0]?.label) {
                metaItems.push({ label: categories[0].label });
              }
              return (
                <ContentCard
                  key={tutorial.slug}
                  title={tutorial.title}
                  subheading={subheading}
                  heroSrc={hero ?? "/img/tutorials_hero_image.jpeg"}
                  heroAlt={tutorial.hero?.image?.alt}
                  href={tutorial.path}
                  meta={metaItems}
                  ctaLabel="Czytaj tutorial"
                />
              );
            })
          )}
        </div>
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
