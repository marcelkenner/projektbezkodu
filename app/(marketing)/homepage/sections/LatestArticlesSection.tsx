import type { ContentSummary } from "@/app/lib/content/repositories";
import { defaultHeroImageForPath } from "@/app/lib/content/heroImageResolver";
import { ArticleCard, ArticleGrid } from "@/app/ui";
import sectionStyles from "../section-shell.module.css";

export interface LatestArticlesCopy {
  heading: string;
  ctaLabel: string;
  loading: string;
  empty: string;
}

export interface LatestArticlesSectionProps {
  copy: LatestArticlesCopy;
  articles: ContentSummary[];
}

export function LatestArticlesSection({
  copy,
  articles,
}: LatestArticlesSectionProps) {
  const items = articles.slice(0, 6);

  return (
    <section
      className={sectionStyles["homepage-section"]}
      aria-labelledby="latest-heading"
    >
      <div className="pbk-container">
        <h2 id="latest-heading">{copy.heading}</h2>
        {items.length ? (
          <ArticleGrid>
            {items.map((article) => (
              <ArticleCard
                key={article.path ?? article.slug}
                title={article.title}
                href={article.path}
                description={article.hero?.subheading ?? article.description}
                hero={resolveHeroImage(article)}
                meta={buildMeta(article)}
                ctaLabel={copy.ctaLabel}
              />
            ))}
          </ArticleGrid>
        ) : (
          <p>{copy.empty}</p>
        )}
      </div>
    </section>
  );
}

function resolveHeroImage(article: ContentSummary) {
  const providedSrc = article.hero?.image?.src ?? article.meta?.heroImageSrc;
  const isBroken =
    providedSrc === "/img/article_image.jpeg" ||
    providedSrc?.endsWith(".webp.jpeg") ||
    providedSrc?.endsWith(".webp.webp");
  const providedAlt =
    article.hero?.image?.alt ??
    article.meta?.heroImageAlt ??
    article.title ??
    "Miniatura artykułu";

  if (providedSrc && !isBroken) {
    return {
      src: providedSrc,
      alt: providedAlt,
    };
  }

  const fallback = defaultHeroImageForPath(article.path, article.title);
  return {
    src: fallback.src,
    alt: fallback.alt,
    width: fallback.width,
    height: fallback.height,
  };
}

function buildMeta(article: ContentSummary) {
  return {
    readingTime: article.meta?.duration,
    publishedAt: article.date,
  };
}
