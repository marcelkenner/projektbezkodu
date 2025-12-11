import { ArticleRepository } from "@/app/lib/content/repositories";
import { defaultHeroImageForPath } from "@/app/lib/content/heroImageResolver";
import { ArticleCard, ArticleGrid } from "@/app/ui";

interface RandomArticlesSectionProps {
  currentPath: string;
  limit?: number;
  heading?: string;
}

const articleRepository = new ArticleRepository();

export function RandomArticlesSection({
  currentPath,
  limit = 3,
  heading = "Przeczytaj również",
}: RandomArticlesSectionProps) {
  const articles = selectRandomArticles(currentPath, limit);
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

function selectRandomArticles(currentPath: string, limit: number) {
  const articles = articleRepository
    .listSummaries()
    .filter((article) => article.path !== currentPath);

  if (!articles.length) {
    return [];
  }

  const seededRandom = createSeededRandom(currentPath);
  const shuffled = [...articles];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(seededRandom() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, limit);
}

function createSeededRandom(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i += 1) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
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
