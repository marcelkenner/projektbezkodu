import Link from "next/link";
import type { Metadata } from "next";
import { Button, SelectField } from "@/app/ui";
import { getCopy } from "@/app/lib/copy";
import {
  ToolCatalog,
  type ToolFilter,
  type ToolCategory,
  type ToolPricing,
  type ToolPlatform,
} from "@/app/lib/content/toolCatalog";
import "./tools.module.css";

const copy = getCopy("tools");
const catalog = new ToolCatalog();

export const metadata: Metadata = {
  title: copy.seo.title,
  description: copy.seo.description,
  alternates: {
    canonical: copy.seo.canonical,
  },
};

interface ToolsPageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

export default function ToolsPage({ searchParams }: ToolsPageProps) {
  const filter = parseFilter(searchParams);
  const tools = catalog.list(filter);

  return (
    <section className="tools-page" id="content">
      <div className="pbk-container pbk-stack pbk-stack--tight">
        <div className="tools-page__intro">
          <h1>{copy.hero.title}</h1>
          <p>{copy.hero.intro}</p>
        </div>
        <form className="tools-page__filters" method="get">
          <SelectField
            id="category"
            name="category"
            label={copy.filters.category.label}
            defaultValue={filter.category ?? ""}
            options={copy.filters.category.options}
          />
          <SelectField
            id="pricing"
            name="pricing"
            label={copy.filters.pricing.label}
            defaultValue={filter.pricing ?? ""}
            options={copy.filters.pricing.options}
          />
          <SelectField
            id="system"
            name="platform"
            label={copy.filters.system.label}
            defaultValue={filter.platform ?? ""}
            options={copy.filters.system.options}
          />
          <Button type="submit" variant="secondary">
            {copy.filters.submit}
          </Button>
        </form>
        <div className="tools-page__grid">
          {tools.map((tool) => (
            <article key={tool.slug} className="tools-page__card">
              <div className="pbk-stack pbk-stack--tight">
                <h2>{tool.name}</h2>
                <span className="tools-page__badge">
                  {tool.pricing === "free"
                    ? copy.cards.badgeFree
                    : copy.cards.badgePaid}
                </span>
                <p>{tool.summary}</p>
              </div>
              <div className="tools-page__actions">
                <Link
                  className="pbk-button pbk-button--primary"
                  href={tool.guideHref}
                >
                  {copy.cards.primaryCta}
                </Link>
                <Link
                  className="pbk-button pbk-button--secondary"
                  href={tool.siteHref}
                  rel={tool.affiliate ? "sponsored noopener" : "noopener"}
                >
                  {copy.cards.secondaryCta}
                </Link>
              </div>
            </article>
          ))}
        </div>
        <p className="tools-page__disclosure">{copy.cards.disclosure}</p>
      </div>
    </section>
  );
}

function parseFilter(
  searchParams?: Record<string, string | string[] | undefined>,
): ToolFilter {
  const category = toToolCategory(getFirst(searchParams?.category));
  const pricing = toToolPricing(getFirst(searchParams?.pricing));
  const platform = toToolPlatform(getFirst(searchParams?.platform));
  return { category, pricing, platform };
}

function getFirst(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

function toToolCategory(value?: string | null): ToolCategory | undefined {
  if (!value) return undefined;
  const allowed: ToolCategory[] = [
    "site-builders",
    "automation",
    "analytics",
    "marketing",
    "",
  ];
  return allowed.includes(value as ToolCategory)
    ? (value as ToolCategory)
    : undefined;
}

function toToolPricing(value?: string | null): ToolPricing | undefined {
  if (!value) return undefined;
  const allowed: ToolPricing[] = ["free", "freemium", "paid", ""];
  return allowed.includes(value as ToolPricing)
    ? (value as ToolPricing)
    : undefined;
}

function toToolPlatform(value?: string | null): ToolPlatform | undefined {
  if (!value) return undefined;
  const allowed: ToolPlatform[] = ["web", "desktop", ""];
  return allowed.includes(value as ToolPlatform)
    ? (value as ToolPlatform)
    : undefined;
}
