/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { ContentSummary } from "@/app/lib/content/repositories";
import { HomepageIconFactory } from "./HomepageIconFactory";

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

export function LatestArticlesSection({ copy, articles }: LatestArticlesSectionProps) {
  const items = articles.slice(0, 3);

  return (
    <section className="homepage-section" aria-labelledby="latest-heading">
      <div className="pbk-container">
        <h2 id="latest-heading">{copy.heading}</h2>
        {items.length ? (
          <div className="homepage-articles__grid">
            {items.map((article) => (
              <ArticleCard key={article.slug} article={article} ctaLabel={copy.ctaLabel} />
            ))}
          </div>
        ) : (
          <p>{copy.empty}</p>
        )}
      </div>
    </section>
  );
}

function ArticleCard({
  article,
  ctaLabel,
}: {
  article: ContentSummary;
  ctaLabel: string;
}) {
  const placeholder = "/images/placeholders/article-3x2.webp";

  return (
    <article className="homepage-articles__card">
      <img
        src={placeholder}
        alt={`Miniatura artykułu: ${article.title}`}
        width={768}
        height={512}
        loading="lazy"
        decoding="async"
        sizes="(max-width:640px) 92vw, (max-width:1200px) 33vw, 384px"
        srcSet={`${placeholder} 384w`}
      />
      <div className="homepage-articles__content">
        <h3>
          <Link href={article.path}>{article.title}</Link>
        </h3>
        {article.description ? <p>{article.description}</p> : null}
        <ArticleMeta article={article} />
        <Link href={article.path} className="homepage-articles__link">
          {ctaLabel}
        </Link>
      </div>
    </article>
  );
}

function ArticleMeta({ article }: { article: ContentSummary }) {
  const readingTime = article.meta?.duration;
  const dateLabel = formatDate(article.date);

  if (!readingTime && !dateLabel) {
    return null;
  }

  return (
    <p className="homepage-articles__meta">
      {readingTime ? (
        <>
          {HomepageIconFactory.clock()}
          <span>{readingTime}</span>
        </>
      ) : null}
      {dateLabel ? <time dateTime={article.date ?? ""}>{dateLabel}</time> : null}
    </p>
  );
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
