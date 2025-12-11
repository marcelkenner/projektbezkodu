import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarBlank,
  Clock,
} from "@phosphor-icons/react/dist/ssr";
import "../ui.css";
import styles from "./ArticleCard.module.css";

export interface ArticleCardHero {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  fallbackSrc?: string;
}

export interface ArticleCardMeta {
  readingTime?: string;
  publishedAt?: string;
  extra?: Array<{ label: string }>;
}

export interface ArticleCardProps {
  title: string;
  href: string;
  description?: string;
  hero?: ArticleCardHero;
  ctaLabel: string;
  meta?: ArticleCardMeta;
  priority?: boolean;
}

export interface ArticleGridProps {
  children: ReactNode;
  className?: string;
}

interface ResolvedHero {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface MetaChip {
  key: string;
  label: string;
  dateTime?: string;
  icon?: JSX.Element;
}

const DEFAULT_HERO = "/img/hero_image.webp";
const BROKEN_SUFFIXES = [".webp.jpeg", ".webp.webp"];
const BROKEN_PATHS = ["/img/article_image.jpeg"];
const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNlMmU4ZjAiIC8+PC9zdmc+";

class ArticleCardViewModel {
  constructor(private readonly props: ArticleCardProps) {}

  hero(): ResolvedHero {
    const { hero, title } = this.props;
    const normalized = hero?.src?.trim() ?? "";
    const hasBrokenSuffix = BROKEN_SUFFIXES.some((suffix) =>
      normalized.endsWith(suffix),
    );
    const isBroken = hasBrokenSuffix || BROKEN_PATHS.includes(normalized);
    const fallback = hero?.fallbackSrc ?? DEFAULT_HERO;

    return {
      src: normalized && !isBroken ? normalized : fallback,
      alt: hero?.alt?.trim() || `Grafika do artykułu: ${title}`,
      width: hero?.width ?? 1600,
      height: hero?.height ?? 900,
    };
  }

  dateLabel() {
    const publishedAt = this.props.meta?.publishedAt;
    if (!publishedAt) {
      return null;
    }
    const parsed = Date.parse(publishedAt);
    if (Number.isNaN(parsed)) {
      return { label: publishedAt, dateTime: undefined };
    }
    const date = new Date(parsed);
    const label = new Intl.DateTimeFormat("pl-PL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
    return { label, dateTime: date.toISOString() };
  }

  meta(): MetaChip[] {
    const chips: MetaChip[] = [];
    const readingTime = this.props.meta?.readingTime;
    if (readingTime) {
      chips.push({
        key: `time-${readingTime}`,
        label: readingTime,
        icon: <Clock weight="bold" aria-hidden="true" />,
      });
    }

    const date = this.dateLabel();
    if (date?.label) {
      chips.push({
        key: `date-${date.label}`,
        label: date.label,
        dateTime: date.dateTime,
        icon: <CalendarBlank weight="bold" aria-hidden="true" />,
      });
    }

    (this.props.meta?.extra ?? []).forEach((item, index) => {
      if (item?.label) {
        chips.push({
          key: `extra-${index}-${item.label}`,
          label: item.label,
        });
      }
    });

    return chips;
  }
}

export function ArticleCard(props: ArticleCardProps) {
  const vm = new ArticleCardViewModel(props);
  const hero = vm.hero();
  const meta = vm.meta();

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <Image
          src={hero.src}
          alt={hero.alt}
          width={hero.width}
          height={hero.height}
          className={styles.image}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          priority={props.priority}
        />
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>
          <Link href={props.href} className={styles.titleLink}>
            {props.title}
          </Link>
        </h3>
        {props.description ? (
          <p className={styles.description}>{props.description}</p>
        ) : null}
        {meta.length ? (
          <div className={styles.meta} aria-label="Metadane artykułu">
            {meta.map((item) => (
              <span className={styles.pill} key={item.key}>
                {item.icon ? (
                  <span className={styles.icon}>{item.icon}</span>
                ) : null}
                {item.dateTime ? (
                  <time dateTime={item.dateTime}>{item.label}</time>
                ) : (
                  <span>{item.label}</span>
                )}
              </span>
            ))}
          </div>
        ) : null}
        <div className={styles.ctaRow}>
          <Link className={styles.cta} href={props.href}>
            <span>{props.ctaLabel}</span>
            <ArrowRight
              className={styles.ctaIcon}
              weight="bold"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function ArticleGrid({ children, className }: ArticleGridProps) {
  const classes = [styles.grid, className].filter(Boolean).join(" ");
  return <div className={classes}>{children}</div>;
}
