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
      <figure
        className="articles-card__image"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.55)), url(${hero})`,
        }}
        aria-label={alt}
      >
        <div className="articles-card__imageContent">
          <p className="articles-card__imageTitle">{title}</p>
          {subheading ? (
            <p className="articles-card__imageSubtitle">{subheading}</p>
          ) : null}
        </div>
      </figure>
      <div className="articles-card__body">
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
