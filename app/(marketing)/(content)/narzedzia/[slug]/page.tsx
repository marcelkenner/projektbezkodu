import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCopy } from "@/app/lib/copy";
import { ToolCatalog } from "@/app/lib/content/toolCatalog";
import "./../tools.module.css";

const copy = getCopy("tools");
const catalog = new ToolCatalog();

export function generateStaticParams() {
  return catalog.list().map((tool) => ({ slug: tool.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const tool = catalog.find(params.slug);
  if (!tool) {
    return {};
  }

  return {
    title: `${tool.name} — narzędzie no-code | ProjektBezKodu`,
    description: copy.detail.seoDescriptionFallback,
    alternates: {
      canonical: `/narzedzia/${tool.slug}/`,
    },
  };
}

export default function ToolDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const tool = catalog.find(params.slug);
  if (!tool) {
    notFound();
  }

  return (
    <section className="tools-page" id="content">
      <div className="pbk-container pbk-stack pbk-stack--loose">
        <header className="pbk-stack pbk-stack--tight">
          <h1>{tool.name} — do czego służy</h1>
          <div className="tools-detail__meta">
            <span>
              {copy.detail.meta.categoryLabel}: {tool.category}
            </span>
            <span>
              {copy.detail.meta.platformLabel}: {tool.platform}
            </span>
            <span>
              {copy.detail.meta.pricingLabel}: {tool.pricing}
            </span>
          </div>
        </header>

        <div className="tools-detail__section">
          <h2>{copy.detail.strengthsHeading}</h2>
          <ul className="tools-detail__list">
            {tool.strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="tools-detail__section">
          <h2>{copy.detail.limitationsHeading}</h2>
          <ul className="tools-detail__list">
            {tool.limitations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="tools-detail__section">
          <h2>{copy.detail.gettingStartedHeading}</h2>
          <ol className="tools-detail__steps">
            {tool.gettingStarted.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="tools-detail__section">
          <h2>{copy.detail.pricingHeading}</h2>
          <div className="tools-detail__pricing">
            <table>
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Cena</th>
                  <th>Okres</th>
                </tr>
              </thead>
              <tbody>
                {tool.pricingTable.map((row) => (
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

        <div className="tools-detail__cta">
          <Link
            className="pbk-button pbk-button--primary"
            href={tool.siteHref}
            rel={tool.affiliate ? "sponsored noopener" : "noopener"}
            aria-label={copy.detail.ctaAria.replace("{name}", tool.name)}
          >
            {copy.detail.ctaLabel}
          </Link>
          <Link
            className="pbk-button pbk-button--secondary"
            href={tool.guideHref}
          >
            {copy.cards.primaryCta}
          </Link>
        </div>

        {renderRelated(tool.related?.compare, copy.detail.compareHeading)}
        {renderRelated(
          tool.related?.caseStudies,
          copy.detail.caseStudiesHeading,
        )}
      </div>
    </section>
  );
}

function renderRelated(links: string[] | undefined, heading: string) {
  if (!links?.length) {
    return null;
  }
  return (
    <div className="tools-detail__section">
      <h2>{heading}</h2>
      <div className="tools-detail__links">
        {links.map((href) => (
          <Link key={href} href={href}>
            {href}
          </Link>
        ))}
      </div>
    </div>
  );
}
