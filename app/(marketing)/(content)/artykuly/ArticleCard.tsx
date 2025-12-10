import Image from "next/image";
import Link from "next/link";
import { Clock } from "@phosphor-icons/react/dist/ssr";
import type { ContentSummary } from "@/app/lib/content/repositories";
import { defaultHeroImageForPath } from "@/app/lib/content/heroImageResolver";
import type { TaxonomyTerm } from "@/app/lib/content/articleTaxonomy";
import styles from "./articles.module.css";

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
    <article className={`articles-card ${styles["articles-card"]}`}>
      <figure
        className={`articles-card__image ${styles["articles-card__image"]}`}
        aria-label={hero.alt}
      >
        <Image
          src={hero.src}
          alt={hero.alt}
          width={hero.width ?? 1600}
          height={hero.height ?? 900}
          className={styles["articles-card__thumb"]}
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
        <div className={styles["articles-card__overlay"]} />
      </figure>
      <div className={`articles-card__body ${styles["articles-card__body"]}`}>
        <h3 className={styles["articles-card__title"]}>{article.title}</h3>
        {subheading ? (
          <p className={styles["articles-card__summary"]}>{subheading}</p>
        ) : null}
        <div
          className={`articles-card__footer ${styles["articles-card__footer"]}`}
        >
          <p className={`articles-card__meta ${styles["articles-card__meta"]}`}>
            {readingTime ? (
              <span
                className={`articles-card__metaItem ${styles["articles-card__metaItem"]}`}
              >
                <Clock
                  aria-hidden="true"
                  className={`articles-card__icon ${styles["articles-card__icon"]}`}
                  weight="bold"
                />
                <span>{readingTime}</span>
              </span>
            ) : null}
            {dateLabel ? (
              <time
                className={`articles-card__metaItem ${styles["articles-card__metaItem"]}`}
                dateTime={article.date ?? ""}
              >
                {dateLabel}
              </time>
            ) : null}
            {category ? (
              <Link
                className={`articles-card__metaItem ${styles["articles-card__metaItem"]}`}
                href={`/kategoria/${category.slug}/`}
              >
                {category.label}
              </Link>
            ) : null}
          </p>
          <Link
            className={`articles-card__link ${styles["articles-card__link"]}`}
            href={article.path}
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}

function resolveHeroImage(article: ContentSummary) {
  const fallback = defaultHeroImageForPath(article.path, article.title);
  return {
    src: fallback.src,
    alt: fallback.alt,
    width: fallback.width,
    height: fallback.height,
  };
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
