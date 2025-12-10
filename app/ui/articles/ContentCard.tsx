import Image from "next/image";
import Link from "next/link";
import "../ui.css";
import "../../(marketing)/(content)/artykuly/articles.module.css";

export interface ContentCardMeta {
  label: string;
}

export interface ContentCardProps {
  title: string;
  href: string;
  subheading?: string;
  heroSrc?: string;
  heroAlt?: string;
  meta?: ContentCardMeta[];
  ctaLabel: string;
}

const PLACEHOLDER = "/img/hero_image.webp";
const LEGACY_BROKEN_SRC = "/img/article_image.jpeg";
const BROKEN_SUFFIXES = [".webp.jpeg", ".webp.webp"];

export function ContentCard({
  title,
  href,
  subheading,
  heroSrc,
  heroAlt,
  meta = [],
  ctaLabel,
}: ContentCardProps) {
  const normalized = heroSrc?.trim() ?? "";
  const hasBrokenSuffix = BROKEN_SUFFIXES.some((suffix) =>
    normalized.endsWith(suffix),
  );
  const hero =
    normalized.length > 0 &&
    normalized !== LEGACY_BROKEN_SRC &&
    !hasBrokenSuffix
      ? normalized
      : PLACEHOLDER;
  const alt = heroAlt ?? `Zdjęcie powiązane z treścią: ${title}`;

  return (
    <article className="articles-card">
      <figure className="articles-card__image" aria-label={alt}>
        <Image
          src={hero}
          alt={alt}
          width={1600}
          height={900}
          className="articles-card__thumb"
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
        <div className="articles-card__overlay" />
      </figure>
      <div className="articles-card__body">
        <h3 className="articles-card__title">{title}</h3>
        {subheading ? (
          <p className="articles-card__summary">{subheading}</p>
        ) : null}
        <div className="articles-card__footer">
          <p className="articles-card__meta">
            {meta.map((item) => (
              <span className="articles-card__metaItem" key={item.label}>
                {item.label}
              </span>
            ))}
          </p>
          <Link className="articles-card__link" href={href}>
            {ctaLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}
