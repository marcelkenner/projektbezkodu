import type { ContentSummary } from "@/app/lib/content/repositories";
import { defaultHeroImageForPath } from "@/app/lib/content/heroImageResolver";
import { ContentCard, type ContentCardMeta } from "@/app/ui";
import sectionStyles from "../section-shell.module.css";
import latestStyles from "../latest-articles.module.css";

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
          <div className={latestStyles["homepage-articles__grid"]}>
            {items.map((article) => (
              <ContentCard
                key={article.slug}
                title={article.title}
                href={article.path}
                subheading={article.hero?.subheading ?? article.description}
                {...resolveHeroImage(article)}
                meta={buildMeta(article)}
                ctaLabel={copy.ctaLabel}
              />
            ))}
          </div>
        ) : (
          <p>{copy.empty}</p>
        )}
      </div>
    </section>
  );
}

function resolveHeroImage(article: ContentSummary) {
  const providedSrc = article.hero?.image?.src ?? article.meta?.heroImageSrc;
  const isBroken = providedSrc === "/img/article_image.jpeg";
  const providedAlt =
    article.hero?.image?.alt ??
    article.meta?.heroImageAlt ??
    article.title ??
    "Miniatura artykułu";

  if (providedSrc && !isBroken) {
    return { heroSrc: providedSrc, heroAlt: providedAlt };
  }

  const fallback = defaultHeroImageForPath(article.path, article.title);
  return { heroSrc: fallback.src, heroAlt: fallback.alt };
}

function buildMeta(article: ContentSummary): ContentCardMeta[] {
  const meta: ContentCardMeta[] = [];
  const readingTime = article.meta?.duration;
  const dateLabel = formatDate(article.date);

  if (readingTime) {
    meta.push({ label: readingTime });
  }
  if (dateLabel) {
    meta.push({ label: dateLabel });
  }

  return meta;
}

function formatDate(isoDate?: string) {
  if (!isoDate) {
    return "";
  }
  const parsed = Date.parse(isoDate);
  if (Number.isNaN(parsed)) {
    return "";
  }
  return new Intl.DateTimeFormat("pl-PL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(parsed);
}
