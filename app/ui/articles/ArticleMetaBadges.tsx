import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "@/app/ui/Badge";

interface MetaCategory {
  label: string;
  slug?: string;
  href?: string;
}

interface ArticleMetaBadgesProps {
  categories?: MetaCategory[];
  difficulty?: string | null;
  duration?: string | null;
  categoriesTitle?: string;
  metaTitle?: string;
  difficultyLabel?: string;
  durationLabel?: string;
}

const DEFAULT_CATEGORY_TITLE = "Kategorie";
const DEFAULT_META_TITLE = "Parametry";
const DEFAULT_DIFFICULTY_LABEL = "Poziom";
const DEFAULT_DURATION_LABEL = "Czas";

export function ArticleMetaBadges({
  categories = [],
  difficulty,
  duration,
  categoriesTitle = DEFAULT_CATEGORY_TITLE,
  metaTitle = DEFAULT_META_TITLE,
  difficultyLabel = DEFAULT_DIFFICULTY_LABEL,
  durationLabel = DEFAULT_DURATION_LABEL,
}: ArticleMetaBadgesProps) {
  const hasDifficulty = Boolean(difficulty);
  const hasDuration = Boolean(duration);
  const visibleCategories = categories.filter((category) =>
    Boolean(category?.label),
  );

  const shouldRenderCategories = visibleCategories.length > 0;
  const shouldRenderMeta = hasDifficulty || hasDuration;

  if (!shouldRenderCategories && !shouldRenderMeta) {
    return null;
  }

  return (
    <div className="pbk-article-metaBadges">
      {shouldRenderCategories ? (
        <div className="pbk-article-metaBadges__group">
          <p className="pbk-article-metaBadges__title">{categoriesTitle}</p>
          <div className="pbk-article-metaBadges__items">
            {visibleCategories.map((category) => (
              <MetaBadgeLink
                key={`${category.slug ?? category.label}`}
                href={resolveCategoryHref(category)}
              >
                {category.label}
              </MetaBadgeLink>
            ))}
          </div>
        </div>
      ) : null}
      {shouldRenderMeta ? (
        <div className="pbk-article-metaBadges__group">
          <p className="pbk-article-metaBadges__title">{metaTitle}</p>
          <div className="pbk-article-metaBadges__items">
            {hasDifficulty ? (
              <LabeledBadge label={difficultyLabel} value={difficulty!} />
            ) : null}
            {hasDuration ? (
              <LabeledBadge
                label={durationLabel}
                value={duration!}
                variant="neutral"
              />
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MetaBadgeLink({
  href,
  children,
}: {
  href?: string;
  children: ReactNode;
}) {
  if (!href) {
    return <Badge>{children}</Badge>;
  }
  return (
    <Link href={href} className="pbk-article-metaBadges__link">
      <Badge>{children}</Badge>
    </Link>
  );
}

function LabeledBadge({
  label,
  value,
  variant = "accent",
}: {
  label: string;
  value: string;
  variant?: "accent" | "neutral";
}) {
  return (
    <Badge variant={variant}>
      <span className="pbk-article-metaBadges__badgeLabel">{label}</span>
      <span className="pbk-article-metaBadges__badgeValue">{value}</span>
    </Badge>
  );
}

function resolveCategoryHref(category: MetaCategory): string | undefined {
  if (category.href) {
    return category.href;
  }
  if (category.slug) {
    return `/artykuly/${category.slug}/`;
  }
  return undefined;
}
