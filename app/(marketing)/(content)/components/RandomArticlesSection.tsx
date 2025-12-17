import { defaultHeroImageForPath } from "@/app/lib/content/heroImageResolver";
import { ContentRecommendationsRepository } from "@/app/lib/content/ContentRecommendationsRepository";
import { RandomArticlesSelectionManager } from "@/app/lib/content/RandomArticlesSelectionManager";
import { ArticleCard, ArticleGrid } from "@/app/ui";

interface RandomArticlesSectionProps {
  currentPath: string;
  limit?: number;
  heading?: string;
  excludePaths?: string[];
}

const recommendationsRepository = new ContentRecommendationsRepository();
const randomArticlesSelectionManager = new RandomArticlesSelectionManager(
  recommendationsRepository,
);

export function RandomArticlesSection({
  currentPath,
  limit = 3,
  heading = "Przeczytaj również",
  excludePaths = [],
}: RandomArticlesSectionProps) {
  const articles = randomArticlesSelectionManager.select({
    currentPath,
    limit,
    excludePaths,
  });
  if (!articles.length) {
    return null;
  }

  return (
    <section
      className="pbk-stack pbk-stack--loose"
      aria-labelledby="random-articles-heading"
    >
      <h2
        id="random-articles-heading"
        className="pbk-card__meta random-articles__heading"
      >
        {heading}
      </h2>
      <ArticleGrid>
        {articles.map((article) => (
          <ArticleCard
            key={article.path}
            title={article.title}
            href={article.path}
            description={article.hero?.subheading ?? article.description}
            hero={resolveArticleHero(article)}
            meta={{
              readingTime: article.meta?.duration,
              publishedAt: article.date,
            }}
            ctaLabel="Czytaj"
          />
        ))}
      </ArticleGrid>
    </section>
  );
}

function resolveArticleHero(article: {
  path: string;
  title: string;
  hero?: { image?: { src?: string; alt?: string } };
  meta?: { heroImageSrc?: string; heroImageAlt?: string };
}) {
  const providedSrc = article.hero?.image?.src ?? article.meta?.heroImageSrc;
  const isBroken =
    providedSrc === "/img/article_image.jpeg" ||
    providedSrc?.endsWith(".webp.jpeg") ||
    providedSrc?.endsWith(".webp.webp");

  if (providedSrc && !isBroken) {
    return {
      src: providedSrc,
      alt: article.hero?.image?.alt ?? article.meta?.heroImageAlt,
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
