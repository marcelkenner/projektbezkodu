import Link from "next/link";
import { ArticleRepository } from "@/app/lib/content/repositories";
import { articleTaxonomyCatalog } from "@/app/lib/content/articleTaxonomy";
import { Badge } from "@/app/ui";
import { getCopy } from "../../../lib/copy";

const articleRepository = new ArticleRepository();

export default function ArticlesIndex() {
  const copy = getCopy("articles");
  const articles = articleRepository.listSummaries();

  return (
    <section className="section section--surface">
      <div className="pbk-container pbk-stack">
        <div className="section__header">
          <h1>{copy.title}</h1>
          <p>{copy.intro}</p>
        </div>
        <div className="section__grid">
          {articles.length === 0 ? (
            <div className="pbk-card">
              <p>{copy.emptyState}</p>
            </div>
          ) : (
            articles.map((article) => {
              const categories = articleTaxonomyCatalog.resolveCategories(
                article.taxonomy?.categories,
              );
              return (
                <div key={article.slug} className="pbk-card pbk-stack">
                  <div className="pbk-stack pbk-stack--tight">
                    <h2>{article.title}</h2>
                    {article.description ? (
                      <p className="pbk-card__meta">{article.description}</p>
                    ) : null}
                    {categories.length ? (
                      <div className="pbk-inline-list">
                        {categories.map((category) => (
                          <Badge key={category.slug} variant="accent">
                            {category.label}
                          </Badge>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <Link
                    className="pbk-button pbk-button--tertiary"
                    href={article.path}
                  >
                    Czytaj artykuł
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
