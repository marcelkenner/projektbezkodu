import Link from "next/link";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { ContentLibrary } from "@/app/lib/content/contentLibrary";
import { ContentPageCoordinator } from "@/app/lib/content/contentPageCoordinator";
import { ContentRecommendationsRepository } from "@/app/lib/content/ContentRecommendationsRepository";
import { RandomArticlesSelectionManager } from "@/app/lib/content/RandomArticlesSelectionManager";

import styles from "../../../[...segments]/content-page.module.css";
import articleStyles from "../../../artykuly/article.module.css";
import {
  TableOfContents,
  ArticleMetaBadges,
  ArticleSummaryBullets,
  ArticleCtaGroup,
  TaxonomyChips,
  ArticleSharePanel,
  AuthorCard,
} from "@/app/ui";
import { RandomArticlesSection } from "../../../components/RandomArticlesSection";
import { BreadcrumbComposer } from "@/app/lib/navigation/BreadcrumbComposer";
import { defaultSiteUrlFactory } from "@/app/lib/url/SiteUrlFactory";
import { ToolGuideIndexingPolicy } from "@/app/lib/seo/ToolGuideIndexingPolicy";
import "../../../artykuly/article.module.css";
import { ContentHero } from "@/app/ui/heroes/ContentHero";

const library = new ContentLibrary();
const coordinator = new ContentPageCoordinator(library);
const recommendationsRepository = new ContentRecommendationsRepository(library);
const randomArticlesSelectionManager = new RandomArticlesSelectionManager(
  recommendationsRepository,
);
const breadcrumbComposer = new BreadcrumbComposer();
const toolGuideIndexingPolicy = new ToolGuideIndexingPolicy();

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
  const metadata = viewModel.getMetadata();
  const robots = toolGuideIndexingPolicy.resolveRobots(segments);
  if (!robots) {
    return metadata;
  }
  return {
    ...metadata,
    robots,
  };
}

export default async function ToolArticle({ params }: ToolArticleProps) {
  const { slug, segments = [] } = await params;
  const requestedPath = `/${buildSegments(slug, segments).filter(Boolean).join("/")}/`;
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
  if (requestedPath !== canonicalPath) {
    permanentRedirect(canonicalPath);
  }
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
  const heroImage = viewModel.getHeroImage();
  const sidebarArticles = randomArticlesSelectionManager.select({
    currentPath: canonicalPath,
    limit: 6,
  });
  const sidebarExcludePaths = sidebarArticles.map((article) => article.path);

  return (
    <section
      className={`${articleStyles.articlePage} article-page`}
      id="content"
    >
      <ContentHero
        heading={heading}
        subheading={subheading}
        breadcrumbs={breadcrumbs}
        image={heroImage}
      />
      <div className="pbk-container">
        <header className="article-page__header">
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
              {sidebarArticles.length ? (
                <aside
                  className="pbk-card pbk-stack article-page__relatedTools"
                  aria-label="Polecane artykuły"
                >
                  <h2 className="pbk-card__meta">Sprawdź też</h2>
                  <ul className="pbk-stack pbk-stack--tight">
                    {sidebarArticles.map((article) => (
                      <li key={article.path}>
                        <Link className="pbk-inline-link" href={article.path}>
                          {article.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </aside>
              ) : null}
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
        <AuthorCard />
        <TaxonomyChips categories={categories} tags={tags} />
        <RandomArticlesSection
          currentPath={canonicalPath}
          excludePaths={sidebarExcludePaths}
        />
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
