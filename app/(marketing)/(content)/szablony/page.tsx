import Link from "next/link";
import type { Metadata } from "next";
import { SelectField, Button } from "@/app/ui";
import { getCopy } from "@/app/lib/copy";
import {
  TemplateCatalog,
  type TemplateFilter,
  type TemplatePlatform,
  type TemplateType,
  type TemplatePrice,
} from "@/app/lib/content/templateCatalog";
import "./templates.module.css";

const copy = getCopy("templates");
const catalog = new TemplateCatalog();

export const metadata: Metadata = {
  title: copy.seo.title,
  description: copy.seo.description,
  alternates: {
    canonical: copy.seo.canonical,
  },
};

interface TemplatesPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function TemplatesPage({
  searchParams,
}: TemplatesPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const filter = parseFilter(resolvedSearchParams);
  const templates = catalog.list(filter);

  return (
    <section className="templates-page" id="content">
      <div className="pbk-container pbk-stack pbk-stack--tight">
        <div className="pbk-readable">
          <div className="templates-page__intro">
            <h1>{copy.hero.title}</h1>
            <p>{copy.hero.intro}</p>
          </div>
        </div>
        <form className="templates-page__filters" method="get">
          <SelectField
            id="platform"
            name="platform"
            label={copy.filters.platform.label}
            defaultValue={filter.platform ?? ""}
            options={copy.filters.platform.options}
          />
          <SelectField
            id="type"
            name="type"
            label={copy.filters.type.label}
            defaultValue={filter.type ?? ""}
            options={copy.filters.type.options}
          />
          <SelectField
            id="price"
            name="price"
            label={copy.filters.price.label}
            defaultValue={filter.price ?? ""}
            options={copy.filters.price.options}
          />
          <Button type="submit" variant="secondary">
            {copy.filters.submit}
          </Button>
        </form>
        <div className="templates-page__grid">
          {templates.map((template) => (
            <article key={template.slug} className="templates-page__card">
              <div className="pbk-stack pbk-stack--tight">
                <span className="templates-page__badge">{template.badge}</span>
                <h2>{template.name}</h2>
                <p>{template.summary}</p>
              </div>
              <div className="templates-page__actions">
                <Link
                  className="pbk-button pbk-button--primary"
                  href={`/szablony/${template.slug}/`}
                >
                  {copy.cards.ctaPreview}
                </Link>
                <Link
                  className="pbk-button pbk-button--secondary"
                  href={template.primaryHref}
                >
                  {copy.cards.ctaPrimary}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function parseFilter(
  searchParams?: Record<string, string | string[] | undefined>,
): TemplateFilter {
  const platform = toTemplatePlatform(getFirst(searchParams?.platform));
  const type = toTemplateType(getFirst(searchParams?.type));
  const price = toTemplatePrice(getFirst(searchParams?.price));
  return { platform, type, price };
}

function getFirst(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

function toTemplatePlatform(
  value?: string | null,
): TemplatePlatform | undefined {
  if (!value) return undefined;
  const allowed: TemplatePlatform[] = ["webflow", "framer", ""];
  return allowed.includes(value as TemplatePlatform)
    ? (value as TemplatePlatform)
    : undefined;
}

function toTemplateType(value?: string | null): TemplateType | undefined {
  if (!value) return undefined;
  const allowed: TemplateType[] = ["landing", "blog", "portfolio", ""];
  return allowed.includes(value as TemplateType)
    ? (value as TemplateType)
    : undefined;
}

function toTemplatePrice(value?: string | null): TemplatePrice | undefined {
  if (!value) return undefined;
  const allowed: TemplatePrice[] = ["free", "paid", ""];
  return allowed.includes(value as TemplatePrice)
    ? (value as TemplatePrice)
    : undefined;
}
