import { defaultHeroImageForPath } from "@/app/lib/content/heroImageResolver";
import type { ArticleHubPayload } from "@/app/lib/content/ArticleHubManager";
import { ArticleCard, ArticleGrid } from "@/app/ui";
import { getCopy } from "@/app/lib/copy";
import styles from "./hub.module.css";

const articlesCopy = getCopy("articles");

export function ArtykulyHubPage({ payload }: { payload: ArticleHubPayload }) {
  const { hub, articles } = payload;

  return (
    <section className={`${styles.scope} artykuly-hub`} id="content">
      <div className="pbk-container pbk-stack pbk-stack--tight">
        <h1 className="sr-only">{hub.label}</h1>

        {articles.length ? (
          <nav aria-label={`Artykuły: ${hub.label}`}>
            <ArticleGrid className="artykuly-hub__grid">
              {articles.map((article) => {
                const fallback = defaultHeroImageForPath(
                  article.path,
                  article.title,
                );
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
