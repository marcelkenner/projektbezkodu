import { ArticleSummaryBullets, ArticleCtaGroup } from "@/app/ui";

export interface GlossaryPromoContent {
  heading: string;
  body: string;
  bulletsHeading?: string;
  bullets?: string[];
  primary?: {
    label: string;
    href: string;
    rel?: string;
    target?: string;
  };
  secondary?: {
    label: string;
    href: string;
    rel?: string;
    target?: string;
  };
  helperText?: string;
}

export function GlossaryPromo({ promo }: { promo?: GlossaryPromoContent }) {
  if (!promo) {
    return null;
  }

  return (
    <div className="glossary-page__conversion">
      <div className="glossary-page__conversionCopy pbk-stack pbk-stack--tight">
        <h2>{promo.heading}</h2>
        <p>{promo.body}</p>
      </div>
      <ArticleSummaryBullets
        bullets={promo.bullets ?? []}
        heading={promo.bulletsHeading}
      />
      <ArticleCtaGroup
        primary={promo.primary ?? undefined}
        secondary={promo.secondary ?? undefined}
        helperText={promo.helperText}
        isAffiliate={true}
      />
    </div>
  );
}
