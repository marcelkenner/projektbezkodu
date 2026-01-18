import Link from "next/link";
import { defaultHeroImageForPath } from "@/app/lib/content/heroImageResolver";
import type { ArticleHubPayload } from "@/app/lib/content/ArticleHubManager";
import { ArticleCard, ArticleGrid } from "@/app/ui";
import { getCopy } from "@/app/lib/copy";
import { MarkdownRenderer } from "@/app/ui/MarkdownRenderer";
import styles from "./hub.module.css";

const articlesCopy = getCopy("articles");

class ArtykulyHubPageViewModel {
  constructor(private readonly payload: ArticleHubPayload) {}

  renderBody() {
    const body = this.payload.hub.body?.trim() ?? "";
    if (!body) {
      return null;
    }
    const renderer = new MarkdownRenderer(body);
    return <article className="prose">{renderer.render()}</article>;
  }
}

export function ArtykulyHubPage({ payload }: { payload: ArticleHubPayload }) {
  const { hub, subcategories, articles } = payload;
  const viewModel = new ArtykulyHubPageViewModel(payload);

  return (
    <section className={`${styles.scope} artykuly-hub`} id="content">
      <div className="pbk-container pbk-stack pbk-stack--tight">
        <header className="artykuly-hub__intro">
          <h1>{hub.label}</h1>
          {hub.description ? <p>{hub.description}</p> : null}
        </header>

        {viewModel.renderBody()}

        {subcategories.length ? (
          <nav
            className="artykuly-hub__subcategories"
            aria-label="Podkategorie"
          >
            <h2 className="pbk-card__meta">Podkategorie</h2>
            <ul className="artykuly-hub__subcategoriesList">
              {subcategories.map((subcategory) => (
                <li key={subcategory.href}>
                  <Link href={subcategory.href}>{subcategory.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        {articles.length ? (
          <nav aria-label={`Artykuły: ${hub.label}`}>
            <ArticleGrid className="artykuly-hub__grid">
              {articles.map((article) => {
                const fallback = defaultHeroImageForPath(article.path, article.title);
                return (
                  <ArticleCard
                    key={article.path ?? article.slug}
                    title={article.title}
                    href={article.path}
                    description={article.hero?.subheading ?? article.description}
                    hero={{
                      src: article.hero?.image?.src ?? article.meta?.heroImageSrc,
                      alt: article.hero?.image?.alt ?? article.meta?.heroImageAlt,
                      fallbackSrc: fallback.src,
                      width: fallback.width,
                      height: fallback.height,
                    }}
                    meta={{
                      readingTime: article.meta?.duration,
                      publishedAt: article.date,
                    }}
                    ctaLabel={articlesCopy.listing.articleCta}
                  />
                );
              })}
            </ArticleGrid>
          </nav>
        ) : (
          <p className="pbk-card__meta">
            {articlesCopy.listing.categoryEmptyState ?? articlesCopy.emptyState}
          </p>
        )}
      </div>
    </section>
  );
}
