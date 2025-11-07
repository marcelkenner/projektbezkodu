/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Clock } from "@phosphor-icons/react/dist/ssr";
import type { ContentSummary } from "@/app/lib/content/repositories";
import type { TaxonomyTerm } from "@/app/lib/content/articleTaxonomy";

const ARTICLE_PLACEHOLDER = "/images/placeholders/article-3x2.webp";

interface ArticleCardProps {
  article: ContentSummary;
  ctaLabel: string;
  category?: TaxonomyTerm;
}

export function ArticleCard({ article, ctaLabel, category }: ArticleCardProps) {
  const readingTime = article.meta?.duration;
  const dateLabel = formatDate(article.date);

  return (
    <article className="articles-card">
      <img
        className="articles-card__image"
        src={ARTICLE_PLACEHOLDER}
        alt={`Miniatura artykułu: ${article.title}`}
        width={768}
        height={512}
        loading="lazy"
        decoding="async"
        srcSet={`${ARTICLE_PLACEHOLDER} 384w`}
        sizes="(max-width:640px) 92vw, (max-width:1200px) 33vw, 384px"
      />
      <div className="articles-card__body">
        <div>
          <h3>
            <Link href={article.path}>{article.title}</Link>
          </h3>
          {article.description ? <p>{article.description}</p> : null}
        </div>
        <p className="articles-card__meta">
          {readingTime ? (
            <>
              <Clock
                aria-hidden="true"
                className="articles-card__icon"
                weight="bold"
              />
              <span>{readingTime}</span>
            </>
          ) : null}
          {dateLabel ? (
            <time dateTime={article.date ?? ""}>{dateLabel}</time>
          ) : null}
          {category ? (
            <Link href={`/kategoria/${category.slug}/`}>{category.label}</Link>
          ) : null}
        </p>
        <Link className="articles-card__link" href={article.path}>
          {ctaLabel}
        </Link>
      </div>
    </article>
  );
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
