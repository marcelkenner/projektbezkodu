import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  TableOfContents,
  StructuredDataScript,
  ArticleSummaryBullets,
  ArticleMetaBadges,
  ArticleCtaGroup,
  TaxonomyChips,
  ArticleSharePanel,
  AuthorCard,
} from "@/app/ui";
import { ContentLibrary } from "@/app/lib/content/contentLibrary";
import { ContentPageCoordinator } from "@/app/lib/content/contentPageCoordinator";
import { SoftwareApplicationStructuredDataBuilder } from "@/app/lib/seo/SoftwareApplicationStructuredDataBuilder";
import { defaultSiteUrlFactory } from "@/app/lib/url/SiteUrlFactory";
import { BreadcrumbComposer } from "@/app/lib/navigation/BreadcrumbComposer";
import { ContentHero } from "@/app/ui/heroes/ContentHero";
import "../../artykuly/article.module.css";

const library = new ContentLibrary();
const coordinator = new ContentPageCoordinator(library);
const breadcrumbComposer = new BreadcrumbComposer();
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

function selectSidebarRelatedTools(
  slug: string,
  categories: Array<{ label: string; slug?: string }>,
) {
  const categorySet = new Set(
    categories.map((cat) => cat?.slug).filter(Boolean),
  );
  const tools = library
    .listRoutes()
    .filter(
      (entry) =>
        entry.path.startsWith("/narzedzia/") && entry.segments.length === 2,
    )
    .map((entry) => {
      const frontmatter = entry.document.frontmatter;
      const cats = frontmatter.taxonomy?.categories ?? [];
      return {
        slug: frontmatter.slug ?? entry.segments[1],
        title: frontmatter.title ?? entry.segments[1],
        path: entry.path,
        categories: cats,
      };
    })
    .filter((entry) => entry.slug !== slug);

  const ranked = tools
    .map((entry) => ({
      title: entry.title,
      path: entry.path,
      score: entry.categories.some((cat) => cat && categorySet.has(cat))
        ? 1
        : 0,
    }))
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, "pl"))
    .slice(0, 3);

  if (ranked.some((entry) => entry.score > 0)) {
    return ranked;
  }

  return tools.slice(0, 3).map(({ title, path }) => ({ title, path }));
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
  const heroImage = viewModel.getHeroImage();
  const publishedDate = viewModel.getPublishedDate();
  const tocItems = viewModel.getHeadings();
  const hasToc = tocItems.length > 0;
  const layoutClassName = hasToc
    ? "article-page__layout article-page__layout--with-toc"
    : "article-page__layout";
  const canonicalPath = viewModel.getPath();
  const shareUrl = defaultSiteUrlFactory.build(canonicalPath);
  const frontmatter = viewModel.getFrontmatter();
  const shareTitle = heading ?? frontmatter.title ?? viewModel.getTitle();
  const categories = viewModel.getCategories();
  const tags = viewModel.getTags();
  const summaryBullets = viewModel.getSummaryBullets();
  const primaryCta = viewModel.getPrimaryCta();
  const secondaryCta = viewModel.getSecondaryCta();
  const difficulty = viewModel.getDifficulty();
  const duration = viewModel.getDuration();
  const hasAffiliateLinks = viewModel.hasAffiliateLinks();
  const sidebarRelated = selectSidebarRelatedTools(slug, categories);
  const structuredData = softwareApplicationStructuredDataBuilder.build({
    canonicalPath,
    name: shareTitle,
    description:
      subheading ??
      frontmatter.seo?.description ??
      frontmatter.meta?.summaryBullets?.[0],
    applicationCategory: frontmatter.taxonomy?.categories?.[0],
    landingPage:
      frontmatter.meta?.primaryCta?.href ??
      frontmatter.meta?.secondaryCta?.href ??
      undefined,
    features: frontmatter.meta?.summaryBullets,
  });

  const breadcrumbs = breadcrumbComposer.compose(canonicalPath, shareTitle);

  return (
    <section className="article-page" id="content">
      <StructuredDataScript id="tool-structured-data" data={structuredData} />
      <ContentHero
        heading={heading}
        subheading={subheading}
        breadcrumbs={breadcrumbs}
        image={heroImage}
      />
      <div className="pbk-container">
        <header className="article-page__header">
          {publishedDate ? (
            <small className="pbk-card__meta">
              <time dateTime={publishedDate}>{formatDate(publishedDate)}</time>
            </small>
          ) : null}
          <ArticleMetaBadges
            categories={categories}
            difficulty={difficulty}
            duration={duration}
          />
        </header>
        <ArticleSharePanel title={shareTitle} url={shareUrl} />
        <ArticleSummaryBullets bullets={summaryBullets} />
        <ArticleCtaGroup
          primary={primaryCta ?? undefined}
          secondary={secondaryCta ?? undefined}
          isAffiliate={hasAffiliateLinks}
        />
        <div className={layoutClassName}>
          {hasToc ? (
            <div className="article-page__toc">
              <TableOfContents items={tocItems} />
              {sidebarRelated.length ? (
                <aside
                  className="pbk-card pbk-stack article-page__relatedTools"
                  aria-label="Powiązane narzędzia"
                >
                  <h2 className="pbk-card__meta">Sprawdź też</h2>
                  <ul className="pbk-stack pbk-stack--tight">
                    {sidebarRelated.map((item) => (
                      <li key={item.path}>
                        <Link className="pbk-inline-link" href={item.path}>
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </aside>
              ) : null}
            </div>
          ) : null}
          <article className="prose">{viewModel.getBody()}</article>
        </div>
        <AuthorCard />
        <TaxonomyChips categories={categories} tags={tags} />
      </div>
    </section>
  );
}
