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

const PLACEHOLDER = "/img/article_image.jpeg";

export function ContentCard({
  title,
  href,
  subheading,
  heroSrc,
  heroAlt,
  meta = [],
  ctaLabel,
}: ContentCardProps) {
  const hero = heroSrc ?? PLACEHOLDER;
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
