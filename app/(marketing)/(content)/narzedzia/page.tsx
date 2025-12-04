import type { Metadata } from "next";

import { getCopy } from "@/app/lib/copy";
import "./tools.module.css";
import { ToolsJumpSelect } from "./ToolsJumpSelect";
import {
  StructuredDataScript,
  ArticleCtaGroup,
  ArticleSummaryBullets,
  TaxonomyChips,
} from "@/app/ui";
import { defaultSiteUrlFactory } from "@/app/lib/url/SiteUrlFactory";
import { ToolCatalog } from "@/app/lib/content/toolCatalog";
import { ToolHubCardModel, type ToolOverviewEntry } from "./ToolHubCardModel";
import { ContentLibrary } from "@/app/lib/content/contentLibrary";

const copy = getCopy("tools");
const toolCatalog = new ToolCatalog();
const contentLibrary = new ContentLibrary();

export const metadata: Metadata = {
  title: copy.seo.title,
  description: copy.seo.description,
  alternates: {
    canonical: copy.seo.canonical,
  },
};

export default function ToolsPage() {
  const overview = loadToolsFromContent();
  const itemListStructuredData = buildToolCollectionJsonLd(overview);
  const categoryLabels = new Map(
    copy.filters.category.options.map((option) => [option.value, option.label]),
  );
  const platformLabels = new Map(
    copy.filters.system.options.map((option) => [option.value, option.label]),
  );
  const cardModels = overview.map(
    (entry) => new ToolHubCardModel(entry, toolCatalog.find(entry.slug)),
  );
  return (
    <section className="tools-page" id="content">
      <StructuredDataScript
        id="tools-item-list"
        data={itemListStructuredData}
      />
      <div className="pbk-container pbk-stack pbk-stack--tight">
        <div className="pbk-readable pbk-readable--start">
          <div className="tools-page__intro">
            <h1>{copy.hero.title}</h1>
            <p>{copy.hero.intro}</p>
          </div>
        </div>
        <ToolsJumpSelect tools={overview} />
        <div className="tools-page__grid">
          {cardModels.map((model) => {
            const summaryBullets = model.getSummaryBullets();
            const categoryValue = model.getCategoryValue();
            const platformValue = model.getPlatformValue();
            const secondaryHref = model.getSecondaryHref();
            const categories = categoryValue
              ? [
                  {
                    label: categoryLabels.get(categoryValue) ?? categoryValue,
                    slug: categoryValue,
                  },
                ]
              : [];
            const tags: { label: string; slug?: string; href?: string }[] = [];
            return (
              <article key={model.getSlug()} className="tools-page__card">
                <span className="tools-page__badge">
                  {model.getBadgeLabel()}
                </span>
                <div className="pbk-stack pbk-stack--tight">
                  <h2 className="tools-page__title">{model.getHeading()}</h2>
                  {model.getSubheading() ? (
                    <p>{model.getSubheading()}</p>
                  ) : null}
                </div>
                <div className="tools-page__meta">
                  <span>
                    {copy.detail.meta.categoryLabel}:{" "}
                    {categories[0]?.label ?? "—"}
                  </span>
                  <span>
                    {copy.detail.meta.platformLabel}:{" "}
                    {platformLabels.get(platformValue ?? "") ??
                      platformValue ??
                      "—"}
                  </span>
                  <span>
                    {copy.detail.meta.pricingLabel}:{" "}
                    {formatPricing(model.getPricingModel())}
                  </span>
                </div>
                <ArticleSummaryBullets
                  bullets={summaryBullets}
                  heading="Dlaczego warto"
                />
                <TaxonomyChips categories={categories} tags={tags} />
                <ArticleCtaGroup
                  primary={{
                    label: copy.cards.primaryCta,
                    href: model.getPrimaryHref(),
                  }}
                  secondary={
                    secondaryHref
                      ? {
                          label: copy.cards.secondaryCta,
                          href: secondaryHref,
                          rel: model.usesAffiliateLink()
                            ? "noopener sponsored"
                            : undefined,
                          target: "_blank",
                        }
                      : undefined
                  }
                  isAffiliate={model.usesAffiliateLink()}
                  helperText={
                    model.usesAffiliateLink()
                      ? copy.cards.disclosure
                      : undefined
                  }
                />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function loadToolsFromContent(): ToolOverviewEntry[] {
  return contentLibrary
    .listRoutes()
    .filter(
      (entry) =>
        entry.path.startsWith("/narzedzia/") && entry.segments.length === 2,
    )
    .filter((entry) => entry.document.frontmatter.draft !== true)
    .map((entry) => {
      const frontmatter = entry.document.frontmatter;
      const hero = frontmatter.hero ?? {};
      const title = frontmatter.title ?? entry.segments.at(-1) ?? "Narzędzie";
      const slug = frontmatter.slug ?? entry.segments.at(-1) ?? "";
      return {
        folderName: entry.segments.at(-1) ?? slug,
        slug,
        path: entry.path,
        title,
        heading: hero.heading ?? title,
        subheading: hero.subheading,
      };
    })
    .sort((a, b) =>
      a.title.toLowerCase().localeCompare(b.title.toLowerCase(), "pl"),
    );
}

function buildToolCollectionJsonLd(entries: ToolOverviewEntry[]) {
  if (!entries.length) {
    return null;
  }

  const factory = defaultSiteUrlFactory;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: entries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: factory.build(entry.path),
      name: entry.heading ?? entry.title ?? entry.folderName,
      description: entry.subheading,
    })),
  };
}

function formatPricing(value: string | undefined) {
  if (!value) {
    return "—";
  }
  switch (value) {
    case "free":
      return copy.cards.badgeFree;
    case "freemium":
      return "Freemium";
    case "paid":
      return copy.cards.badgePaid;
    default:
      return value;
  }
}
