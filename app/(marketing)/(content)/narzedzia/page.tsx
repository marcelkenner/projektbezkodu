import type { Metadata } from "next";

import { getCopy } from "@/app/lib/copy";
import "./tools.module.css";
import { ToolsJumpSelect } from "./ToolsJumpSelect";
import Link from "next/link";
import {
  StructuredDataScript,
  ContentFilterBar,
  SelectField,
  Button,
} from "@/app/ui";
import { defaultSiteUrlFactory } from "@/app/lib/url/SiteUrlFactory";
import { ToolCatalog } from "@/app/lib/content/toolCatalog";
import { ToolHubCardModel, type ToolOverviewEntry } from "./ToolHubCardModel";
import { ContentCard } from "@/app/ui";
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

interface ToolsPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ToolsPage({ searchParams }: ToolsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const selectedCategory = getFirst(resolvedSearchParams?.kategoria);
  const selectedPlatform = getFirst(resolvedSearchParams?.system);
  const overview = loadToolsFromContent();
  const filtered = overview.filter((entry) => {
    const tool = toolCatalog.find(entry.slug);
    const categories = tool?.taxonomy?.categories ?? [];
    const platform = tool?.platform;
    const matchesCategory = selectedCategory
      ? categories.includes(selectedCategory)
      : true;
    const matchesPlatform = selectedPlatform
      ? platform === selectedPlatform
      : true;
    return matchesCategory && matchesPlatform;
  });
  const itemListStructuredData = buildToolCollectionJsonLd(overview);
  const categoryLabels = new Map(
    copy.filters.category.options.map((option) => [option.value, option.label]),
  );
  const platformLabels = new Map(
    copy.filters.system.options.map((option) => [option.value, option.label]),
  );
  const cardModels = filtered.map(
    (entry) => new ToolHubCardModel(entry, toolCatalog.find(entry.slug)),
  );
  return (
    <section className="tools-page" id="content">
      <StructuredDataScript
        id="tools-item-list"
        data={itemListStructuredData}
      />
      <div className="pbk-container pbk-stack pbk-stack--tight pbk-readable pbk-readable--start">
        <div className="tools-page__intro">
          <h1>{copy.hero.title}</h1>
          <p>{copy.hero.intro}</p>
        </div>
        <ContentFilterBar
          variant="tools"
          method="get"
          legend="Filtruj narzędzia"
          actions={
            <>
              <Button type="submit" variant="primary" size="compact">
                {copy.filters.submit}
              </Button>
              <Link
                className="pbk-button pbk-button--tertiary pbk-button--compact"
                href="/narzedzia"
              >
                {copy.filters.reset}
              </Link>
            </>
          }
        >
          <SelectField
            id="kategoria"
            name="kategoria"
            label={copy.filters.category.label}
            defaultValue={selectedCategory ?? ""}
            options={copy.filters.category.options}
          />
          <SelectField
            id="system"
            name="system"
            label={copy.filters.system.label}
            defaultValue={selectedPlatform ?? ""}
            options={copy.filters.system.options}
          />
        </ContentFilterBar>
        <ToolsJumpSelect tools={overview} />
        <div className="articles-grid">
          {cardModels.map((model) => {
            const categoryValue = model.getCategoryValue();
            const platformValue = model.getPlatformValue();
            const categories = categoryValue
              ? [
                  {
                    label: categoryLabels.get(categoryValue) ?? categoryValue,
                    slug: categoryValue,
                  },
                ]
              : [];
            const hero =
              model.getHeroImage()?.src || "/img/tools_hero_image.webp";
            const metaItems = [
              categories[0]?.label
                ? {
                    label: `${copy.detail.meta.categoryLabel}: ${categories[0].label}`,
                  }
                : null,
              platformValue
                ? {
                    label: `${copy.detail.meta.platformLabel}: ${
                      platformLabels.get(platformValue) ?? platformValue
                    }`,
                  }
                : null,
              {
                label: `${copy.detail.meta.pricingLabel}: ${formatPricing(model.getPricingModel())}`,
              },
            ].filter(Boolean) as { label: string }[];
            return (
              <ContentCard
                key={model.getSlug()}
                title={model.getHeading()}
                subheading={model.getSubheading()}
                heroSrc={hero}
                href={model.getPrimaryHref() ?? model.getSlug()}
                meta={metaItems}
                ctaLabel={copy.cards.primaryCta}
              />
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
      const heroImage =
        frontmatter.hero?.image?.src ?? frontmatter.meta?.heroImageSrc;
      const heroAlt =
        frontmatter.hero?.image?.alt ?? frontmatter.meta?.heroImageAlt;
      const normalizedHero =
        heroImage && heroImage !== "/img/article_image.jpeg"
          ? { src: heroImage, alt: heroAlt }
          : undefined;
      return {
        folderName: entry.segments.at(-1) ?? slug,
        slug,
        path: entry.path,
        title,
        heading: hero.heading ?? title,
        subheading: hero.subheading,
        hero: normalizedHero,
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

function getFirst(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value ?? "";
}
