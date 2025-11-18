import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContentLibrary } from "@/app/lib/content/contentLibrary";
import { ContentPageCoordinator } from "@/app/lib/content/contentPageCoordinator";

import {
  Breadcrumbs,
  TableOfContents,
  ArticleMetaBadges,
  ArticleSummaryBullets,
  ArticleCtaGroup,
  TaxonomyChips,
  ArticleSharePanel,
} from "@/app/ui";
import styles from "./content-page.module.css";
import "../artykuly/article.module.css";
import { BreadcrumbComposer } from "@/app/lib/navigation/BreadcrumbComposer";
import { defaultSiteUrlFactory } from "@/app/lib/url/SiteUrlFactory";

const library = new ContentLibrary();
const coordinator = new ContentPageCoordinator(library);
const breadcrumbComposer = new BreadcrumbComposer();

interface ContentPageProps {
  params: Promise<{
    segments: string[];
  }>;
}

export function generateStaticParams() {
  return coordinator.listStaticParams();
}

export async function generateMetadata({
  params,
}: ContentPageProps): Promise<Metadata> {
  const { segments } = await params;
  const viewModel = coordinator.build(segments);
  if (!viewModel) {
    return {};
  }
  return viewModel.getMetadata();
}

export default async function ContentPage({ params }: ContentPageProps) {
  const { segments } = await params;
  const viewModel = coordinator.build(segments);
  if (!viewModel) {
    notFound();
  }

  const heading = viewModel.getHeroHeading();
  const subheading = viewModel.getHeroSubheading();
  const publishedDate = viewModel.getPublishedDate();
  const tocItems = viewModel.getHeadings();
  const hasToc = tocItems.length > 0;
  const useArticleLayout = viewModel.shouldUseArticleLayout();
  const layoutClassName = hasToc
    ? "article-page__layout article-page__layout--with-toc"
    : "article-page__layout";
  const path = viewModel.getPath();
  const breadcrumbs = breadcrumbComposer.compose(path, heading);
  const shareUrl = defaultSiteUrlFactory.build(path);
  const categories = viewModel.getCategories();
  const tags = viewModel.getTags();
  const difficulty = viewModel.getDifficulty();
  const duration = viewModel.getDuration();
  const summaryBullets = viewModel.getSummaryBullets();
  const primaryCta = viewModel.getPrimaryCta();
  const secondaryCta = viewModel.getSecondaryCta();
  const hasAffiliateLinks = viewModel.hasAffiliateLinks();

  if (useArticleLayout) {
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
                <time dateTime={publishedDate}>
                  {formatDate(publishedDate)}
                </time>
              </small>
            ) : null}
          </header>
          <ArticleSharePanel title={heading} url={shareUrl} />
          <ArticleSummaryBullets bullets={summaryBullets} />
          <div className={layoutClassName}>
            {hasToc ? (
              <div className="article-page__toc">
                <TableOfContents items={tocItems} />
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

  return (
    <section className="section section--surface" id="content">
      <div className="pbk-container pbk-stack pbk-stack--loose">
        <header className="pbk-stack pbk-stack--tight">
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
        <ArticleSharePanel title={heading} url={shareUrl} />
        <ArticleSummaryBullets bullets={summaryBullets} />
        <article className="prose">
          {viewModel.getBody()}
          <ArticleCtaGroup
            primary={primaryCta ?? undefined}
            secondary={secondaryCta ?? undefined}
            isAffiliate={hasAffiliateLinks}
          />
        </article>
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
