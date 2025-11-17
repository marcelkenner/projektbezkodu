import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCopy } from "@/app/lib/copy";
import { TemplateCatalog } from "@/app/lib/content/templateCatalog";
import { StructuredDataScript } from "@/app/ui";
import { ProductStructuredDataBuilder } from "@/app/lib/seo/ProductStructuredDataBuilder";
import { FaqStructuredDataBuilder } from "@/app/lib/seo/FaqStructuredDataBuilder";
import { HowToStructuredDataBuilder } from "@/app/lib/seo/HowToStructuredDataBuilder";
import "./../templates.module.css";

const copy = getCopy("templates");
const catalog = new TemplateCatalog();
const productStructuredDataBuilder = new ProductStructuredDataBuilder();
const faqStructuredDataBuilder = new FaqStructuredDataBuilder();
const howToStructuredDataBuilder = new HowToStructuredDataBuilder();

export function generateStaticParams() {
  return catalog.list().map((template) => ({ slug: template.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const template = catalog.find(resolvedParams.slug);
  if (!template) {
    return {};
  }

  return {
    title: `${template.name} | Szablony ProjektBezKodu`,
    description: copy.detail.seoDescriptionFallback,
    alternates: {
      canonical: `/szablony/${template.slug}/`,
    },
  };
}

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const template = catalog.find(resolvedParams.slug);
  if (!template) {
    notFound();
  }
  const canonicalPath = `/szablony/${template.slug}/`;
  const productStructuredData = productStructuredDataBuilder.build({
    name: template.name,
    description: template.summary,
    canonicalPath,
    brand: template.platform || undefined,
    category: template.type || undefined,
    offers: template.pricing.map((row) => ({
      identifier: `${template.slug}-${row.plan}`,
      price: row.amount,
      currency: undefined,
      url: template.primaryHref,
    })),
    isFree: template.price === "free",
  });
  const faqStructuredData = faqStructuredDataBuilder.build(template.faq);
  const howToStructuredData = howToStructuredDataBuilder.build(
    template.steps,
    copy.detail.stepsHeading,
  );
  const structuredDataPayloads = [productStructuredData, faqStructuredData, howToStructuredData].filter(
    Boolean,
  ) as Record<string, unknown>[];

  return (
    <section className="templates-page" id="content">
      <StructuredDataScript
        id="template-structured-data"
        data={structuredDataPayloads.length ? structuredDataPayloads : null}
      />
      <div className="pbk-container pbk-stack pbk-stack--loose">
        <header className="pbk-stack pbk-stack--tight">
          <h1>{template.name}</h1>
          <div className="templates-detail__meta">
            <span>
              {copy.detail.metadata.categoryLabel}: {template.type || "—"}
            </span>
            <span>
              {copy.detail.metadata.platformLabel}: {template.platform || "—"}
            </span>
            <span>
              {copy.detail.metadata.priceLabel}: {template.price}
            </span>
          </div>
        </header>

        <div className="templates-detail__section">
          <h2>{copy.detail.forWhomHeading}</h2>
          <ul className="templates-detail__list">
            {template.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>

        <div className="templates-detail__section">
          <h2>{copy.detail.sectionsHeading}</h2>
          <ul className="templates-detail__list">
            {template.requirements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="templates-detail__section">
          <h2>{copy.detail.stepsHeading}</h2>
          <ol className="templates-detail__steps">
            {template.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>

        {template.pricing.length ? (
          <div className="templates-detail__section">
            <h2>{copy.detail.pricingHeading}</h2>
            <div className="templates-detail__pricing">
              <table>
                <thead>
                  <tr>
                    <th>Plan</th>
                    <th>Cena</th>
                    <th>Okres</th>
                  </tr>
                </thead>
                <tbody>
                  {template.pricing.map((row) => (
                    <tr key={row.plan}>
                      <td>{row.plan}</td>
                      <td>{row.amount}</td>
                      <td>{row.period}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {template.faq.length ? (
          <div className="templates-detail__section">
            <h2>{copy.detail.faqHeading}</h2>
            <div className="templates-detail__faq">
              {template.faq.map((item) => (
                <div key={item.question} className="pbk-stack pbk-stack--tight">
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="templates-detail__cta">
          <Link
            className="pbk-button pbk-button--primary"
            href={template.primaryHref}
            rel="sponsored noopener"
          >
            {copy.detail.ctaPrimaryLabel}
          </Link>
          <Link
            className="pbk-button pbk-button--secondary"
            href={template.previewHref}
          >
            {copy.detail.ctaSecondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
