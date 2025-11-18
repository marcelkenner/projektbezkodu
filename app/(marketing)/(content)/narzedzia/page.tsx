import fs from "fs";
import path from "path";
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

const copy = getCopy("tools");
const CONTENT_ROOT = path.join(process.cwd(), "content/narzedzia");
const toolCatalog = new ToolCatalog();

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
  if (!fs.existsSync(CONTENT_ROOT)) {
    return [];
  }

  const entries = fs
    .readdirSync(CONTENT_ROOT, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        !entry.name.startsWith(".") &&
        entry.name !== "_examples",
    );

  const tools: ToolOverviewEntry[] = [];

  entries.forEach((entry) => {
    const indexPath = path.join(CONTENT_ROOT, entry.name, "index.md");
    if (!fs.existsSync(indexPath)) {
      return;
    }

    const file = fs.readFileSync(indexPath, "utf8");
    const frontmatter = parseFrontmatter(file);
    const slug = toNonEmptyString(frontmatter.slug);
    const pathValue = toNonEmptyString(frontmatter.path);
    if (!pathValue) {
      return;
    }
    const title = toNonEmptyString(frontmatter.title) ?? entry.name;
    const hero = isRecord(frontmatter.hero) ? frontmatter.hero : undefined;
    const heroHeading = toNonEmptyString(hero?.heading);
    const heroSubheading = toNonEmptyString(hero?.subheading);

    tools.push({
      folderName: entry.name,
      slug: slug ?? entry.name,
      path: pathValue,
      title,
      heading: heroHeading,
      subheading: heroSubheading,
    });
  });

  return tools.sort((a, b) =>
    a.title.toLowerCase().localeCompare(b.title.toLowerCase(), "pl"),
  );
}

function parseFrontmatter(file: string): Record<string, unknown> {
  const match = /^---\n([\s\S]*?)\n---/.exec(file);
  if (!match) {
    return {};
  }
  const yaml = match[1];
  const entries = yaml.split("\n").filter(Boolean);
  const data: Record<string, unknown> = {};
  entries.forEach((line) => {
    const [key, ...rest] = line.split(":");
    const value = rest
      .join(":")
      .trim()
      .replace(/^"|"$|^'|'$/g, "");
    const keys = key.trim().split(".");
    let target = data as Record<string, unknown>;
    keys.forEach((k, index) => {
      if (index === keys.length - 1) {
        target[k] = value;
      } else {
        target[k] = target[k] ?? {};
        target = target[k] as Record<string, unknown>;
      }
    });
  });
  return data;
}

function toNonEmptyString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
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
