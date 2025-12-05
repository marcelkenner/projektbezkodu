import Link from "next/link";
import { Clock } from "@phosphor-icons/react/dist/ssr";
import type { ContentSummary } from "@/app/lib/content/repositories";
import { defaultHeroImageForPath } from "@/app/lib/content/heroImageResolver";
import type { TaxonomyTerm } from "@/app/lib/content/articleTaxonomy";

interface ArticleCardProps {
  article: ContentSummary;
  ctaLabel: string;
  category?: TaxonomyTerm;
}

export function ArticleCard({ article, ctaLabel, category }: ArticleCardProps) {
  const readingTime = article.meta?.duration;
  const dateLabel = formatDate(article.date);
  const hero = resolveHeroImage(article);
  const subheading = article.hero?.subheading ?? undefined;

  return (
    <article className="articles-card">
      <figure
        className="articles-card__image"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.55)), url(${hero.src})`,
        }}
        aria-label={hero.alt}
      >
        <div className="articles-card__imageContent">
          <p className="articles-card__imageTitle">{article.title}</p>
          {subheading ? (
            <p className="articles-card__imageSubtitle">{subheading}</p>
          ) : null}
        </div>
      </figure>
      <div className="articles-card__body">
        <div className="articles-card__footer">
          <p className="articles-card__meta">
            {readingTime ? (
              <span className="articles-card__metaItem">
                <Clock
                  aria-hidden="true"
                  className="articles-card__icon"
                  weight="bold"
                />
                <span>{readingTime}</span>
              </span>
            ) : null}
            {dateLabel ? (
              <time
                className="articles-card__metaItem"
                dateTime={article.date ?? ""}
              >
                {dateLabel}
              </time>
            ) : null}
            {category ? (
              <Link
                className="articles-card__metaItem"
                href={`/kategoria/${category.slug}/`}
              >
                {category.label}
              </Link>
            ) : null}
          </p>
          <Link className="articles-card__link" href={article.path}>
            {ctaLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}

function resolveHeroImage(article: ContentSummary) {
  const fallback = defaultHeroImageForPath(article.path, article.title);
  return { src: fallback.src, alt: fallback.alt };
}

function formatDate(isoDate?: string): string {
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
