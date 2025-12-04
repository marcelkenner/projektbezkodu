import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContentLibrary } from "@/app/lib/content/contentLibrary";
import { ContentPageCoordinator } from "@/app/lib/content/contentPageCoordinator";

import styles from "../../../[...segments]/content-page.module.css";
import {
  Breadcrumbs,
  TableOfContents,
  ArticleMetaBadges,
  ArticleSummaryBullets,
  ArticleCtaGroup,
  TaxonomyChips,
  ArticleSharePanel,
} from "@/app/ui";
import { BreadcrumbComposer } from "@/app/lib/navigation/BreadcrumbComposer";
import { defaultSiteUrlFactory } from "@/app/lib/url/SiteUrlFactory";

const library = new ContentLibrary();
const coordinator = new ContentPageCoordinator(library);
const breadcrumbComposer = new BreadcrumbComposer();

interface ToolArticleProps {
  params: Promise<{
    slug: string;
    segments?: string[];
  }>;
}

const buildSegments = (slug: string, extra: string[] = []) => [
  "narzedzia",
  slug,
  ...extra,
];

export function generateStaticParams() {
  return coordinator
    .listStaticParams()
    .filter(
      ({ segments }) => segments[0] === "narzedzia" && segments.length > 2,
    )
    .map(({ segments }) => ({
      slug: segments[1],
      segments: segments.slice(2),
    }));
}

export async function generateMetadata({
  params,
}: ToolArticleProps): Promise<Metadata> {
  const { slug, segments = [] } = await params;
  const viewModel = coordinator.build(buildSegments(slug, segments));
  if (!viewModel) {
    return {};
  }
  return viewModel.getMetadata();
}

export default async function ToolArticle({ params }: ToolArticleProps) {
  const { slug, segments = [] } = await params;
  const viewModel = coordinator.build(buildSegments(slug, segments));
  if (!viewModel) {
    notFound();
  }

  const heading = viewModel.getHeroHeading();
  const subheading = viewModel.getHeroSubheading();
  const publishedDate = viewModel.getPublishedDate();
  const headings = viewModel.getHeadings();
  const hasToc = headings.length > 0;
  const layoutClassName = hasToc
    ? "article-page__layout article-page__layout--with-toc"
    : "article-page__layout";
  const canonicalPath = viewModel.getPath();
  const shareUrl = defaultSiteUrlFactory.build(canonicalPath);
  const shareTitle = heading ?? viewModel.getTitle();
  const breadcrumbs = breadcrumbComposer.compose(canonicalPath, heading);
  const categories = viewModel.getCategories();
  const tags = viewModel.getTags();
  const difficulty = viewModel.getDifficulty();
  const duration = viewModel.getDuration();
  const summaryBullets = viewModel.getSummaryBullets();
  const primaryCta = viewModel.getPrimaryCta();
  const secondaryCta = viewModel.getSecondaryCta();
  const hasAffiliateLinks = viewModel.hasAffiliateLinks();

  return (
    <section className="article-page" id="content">
      <div className="pbk-container">
        <header className="article-page__header">
          <Breadcrumbs items={breadcrumbs} />
          <h1>{heading}</h1>
          {subheading ? (
            <p className={styles.contentPageLead}>{subheading}</p>
          ) : null}
          <ArticleMetaBadges
            categories={categories}
            difficulty={difficulty}
            duration={duration}
          />
          {publishedDate ? (
            <small className={styles.contentPageMeta}>
              <time dateTime={publishedDate}>{formatDate(publishedDate)}</time>
            </small>
          ) : null}
        </header>
        <ArticleSharePanel title={shareTitle} url={shareUrl} />
        <ArticleSummaryBullets bullets={summaryBullets} />
        <div className={layoutClassName}>
          {hasToc ? (
            <div className="article-page__toc">
              <TableOfContents items={headings} />
            </div>
          ) : null}
          <article className="prose">
            {viewModel.getBody()}
            <ArticleCtaGroup
              primary={primaryCta ?? undefined}
              secondary={secondaryCta ?? undefined}
              isAffiliate={hasAffiliateLinks}
            />
          </article>
        </div>
        <TaxonomyChips categories={categories} tags={tags} />
      </div>
    </section>
  );
}

function formatDate(input: string): string {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    return input;
  }
  return new Intl.DateTimeFormat("pl-PL", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(date);
}
