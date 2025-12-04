import Link from "next/link";

export interface ArticleCta {
  label: string;
  href: string;
  rel?: string;
  target?: string;
}

interface ArticleCtaGroupProps {
  primary?: ArticleCta | null;
  secondary?: ArticleCta | null;
  isAffiliate?: boolean;
  helperText?: string;
}

export function ArticleCtaGroup({
  primary,
  secondary,
  isAffiliate = false,
  helperText,
}: ArticleCtaGroupProps) {
  if (!primary && !secondary) {
    return null;
  }

  return (
    <section className="pbk-article-cta pbk-card pbk-stack pbk-stack--tight">
      <div className="pbk-article-cta__buttons">
        {primary ? (
          <ArticleCtaButton
            key="primary"
            cta={primary}
            variant="primary"
            isAffiliate={isAffiliate}
          />
        ) : null}
        {secondary ? (
          <ArticleCtaButton
            key="secondary"
            cta={secondary}
            variant="secondary"
            isAffiliate={isAffiliate}
          />
        ) : null}
      </div>
      {helperText ? (
        <p className="pbk-article-cta__helper">{helperText}</p>
      ) : null}
    </section>
  );
}

function ArticleCtaButton({
  cta,
  variant,
  isAffiliate,
}: {
  cta: ArticleCta;
  variant: "primary" | "secondary";
  isAffiliate: boolean;
}) {
  const relValues = buildRel(cta.rel, isAffiliate);
  return (
    <Link
      className={`pbk-button pbk-button--${variant}`}
      href={cta.href}
      rel={relValues}
      target={cta.target}
    >
      {cta.label}
    </Link>
  );
}

function buildRel(
  rel: string | undefined,
  isAffiliate: boolean,
): string | undefined {
  const relSet = new Set(
    rel
      ?.split(" ")
      .map((token) => token.trim())
      .filter(Boolean),
  );
  relSet.add("noopener");
  relSet.add("noreferrer");
  if (isAffiliate) {
    relSet.add("sponsored");
  }
  return Array.from(relSet).join(" ") || undefined;
}
