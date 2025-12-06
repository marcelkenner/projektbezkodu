import { ArticleRepository } from "@/app/lib/content/repositories";
import { ArticleCard } from "../artykuly/ArticleCard";
import "../artykuly/articles.module.css";

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
      <div className="articles-grid">
        {articles.map((article) => (
          <ArticleCard
            key={article.path}
            article={article}
            ctaLabel="Czytaj"
          />
        ))}
      </div>
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
