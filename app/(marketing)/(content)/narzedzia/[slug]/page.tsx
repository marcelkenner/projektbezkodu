import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TableOfContents, StructuredDataScript } from "@/app/ui";
import { ContentLibrary } from "@/app/lib/content/contentLibrary";
import { ContentPageCoordinator } from "@/app/lib/content/contentPageCoordinator";
import { ToolCatalog } from "@/app/lib/content/toolCatalog";
import { SoftwareApplicationStructuredDataBuilder } from "@/app/lib/seo/SoftwareApplicationStructuredDataBuilder";

const library = new ContentLibrary();
const coordinator = new ContentPageCoordinator(library);
const toolCatalog = new ToolCatalog();
const softwareApplicationStructuredDataBuilder =
  new SoftwareApplicationStructuredDataBuilder();

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

const baseSegments = (slug: string) => ["narzedzia", slug];

function formatDate(input: string): string {
  const timestamp = Date.parse(input);
  if (Number.isNaN(timestamp)) {
    return "";
  }
  return new Intl.DateTimeFormat("pl-PL", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(new Date(timestamp));
}

export function generateStaticParams() {
  return coordinator
    .listStaticParams()
    .filter(
      (entry) =>
        entry.segments.length === 2 && entry.segments[0] === "narzedzia",
    )
    .map(({ segments }) => ({ slug: segments[1] }));
}

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const viewModel = coordinator.build(baseSegments(slug));
  if (!viewModel) {
    return {};
  }
  return viewModel.getMetadata();
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const viewModel = coordinator.build(baseSegments(slug));
  if (!viewModel) {
    notFound();
  }

  const heading = viewModel.getHeroHeading();
  const subheading = viewModel.getHeroSubheading();
  const publishedDate = viewModel.getPublishedDate();
  const tocItems = viewModel.getHeadings();
  const hasToc = tocItems.length > 0;
  const layoutClassName = hasToc
    ? "article-page__layout article-page__layout--with-toc"
    : "article-page__layout";
  const canonicalPath = viewModel.getPath();
  const toolEntry = toolCatalog.find(slug);
  const structuredData = toolEntry
    ? softwareApplicationStructuredDataBuilder.build({
        canonicalPath,
        name: toolEntry.name,
        description: subheading ?? toolEntry.summary,
        applicationCategory: toolEntry.category,
        operatingSystem: mapOperatingSystem(toolEntry.platform),
        landingPage: toolEntry.siteHref,
        features: toolEntry.strengths,
        pricingModel: toolEntry.pricing,
        offers: toolEntry.pricingTable.map((plan) => ({
          identifier: `${toolEntry.slug}-${plan.plan}`,
          amount: plan.amount,
          url: toolEntry.siteHref,
        })),
      })
    : null;

  return (
    <section className="article-page" id="content">
      <StructuredDataScript
        id="tool-structured-data"
        data={structuredData}
      />
      <div className="pbk-container">
        <header className="article-page__header">
          <p className="pbk-card__meta">{viewModel.getPath()}</p>
          <h1>{heading}</h1>
          {subheading ? <p>{subheading}</p> : null}
          {publishedDate ? (
            <small className="pbk-card__meta">
              <time dateTime={publishedDate}>{formatDate(publishedDate)}</time>
            </small>
          ) : null}
        </header>
        <div className={layoutClassName}>
          {hasToc ? (
            <div className="article-page__toc">
              <TableOfContents items={tocItems} />
            </div>
          ) : null}
          <article className="prose">{viewModel.getBody()}</article>
        </div>
      </div>
    </section>
  );
}

function mapOperatingSystem(platform: string | undefined) {
  if (!platform) {
    return "Web";
  }
  if (platform === "desktop") {
    return "Windows, macOS";
  }
  return "Web";
}
