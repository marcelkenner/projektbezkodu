import Link from "next/link";
import { ComparisonRepository } from "@/app/lib/content/repositories";
import { comparisonTaxonomyCatalog } from "@/app/lib/content/comparisonTaxonomy";
import { Badge } from "@/app/ui";
import { getCopy } from "../../../lib/copy";

const comparisonRepository = new ComparisonRepository();

export default function ComparisonsIndex() {
  const copy = getCopy("comparisons");
  const comparisons = comparisonRepository.listSummaries();

  return (
    <section className="section section--surface">
      <div className="pbk-container pbk-stack">
        <div className="section__header">
          <h1>{copy.title}</h1>
          <p>{copy.intro}</p>
        </div>
        <div className="section__grid">
          {comparisons.length === 0 ? (
            <div className="pbk-card">
              <p>{copy.emptyState}</p>
            </div>
          ) : (
            comparisons.map((comparison) => {
              const categories = comparisonTaxonomyCatalog.resolveCategories(
                comparison.taxonomy?.categories,
              );
              const tags = comparisonTaxonomyCatalog.resolveTags(
                comparison.taxonomy?.tags,
              );
              return (
                <div key={comparison.slug} className="pbk-card pbk-stack">
                  {categories.length ? (
                    <div className="pbk-inline-list">
                      {categories.map((category) => (
                        <Badge key={category.slug} variant="accent">
                          {category.label}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                  <h2>{comparison.title}</h2>
                  {comparison.description ? (
                    <p>{comparison.description}</p>
                  ) : null}
                  {tags.length ? (
                    <div className="pbk-inline-list">
                      {tags.map((tag) => (
                        <Badge key={tag.slug} variant="neutral">
                          {tag.label}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                  <Link
                    className="pbk-button pbk-button--tertiary"
                    href={comparison.path}
                  >
                    Zobacz porównanie
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
