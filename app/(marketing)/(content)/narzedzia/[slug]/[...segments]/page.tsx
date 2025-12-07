import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContentLibrary } from "@/app/lib/content/contentLibrary";
import { ContentPageCoordinator } from "@/app/lib/content/contentPageCoordinator";

import styles from "../../../[...segments]/content-page.module.css";
import articleStyles from "../../../artykuly/article.module.css";
import {
  Breadcrumbs,
  TableOfContents,
  ArticleMetaBadges,
  ArticleSummaryBullets,
  ArticleCtaGroup,
  TaxonomyChips,
  ArticleSharePanel,
  AuthorCard,
} from "@/app/ui";
import { BreadcrumbComposer } from "@/app/lib/navigation/BreadcrumbComposer";
import { defaultSiteUrlFactory } from "@/app/lib/url/SiteUrlFactory";
import "../../../artykuly/article.module.css";

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
  const sidebarRelated = selectSidebarRelatedTools(slug, categories);

  return (
    <section
      className={`${articleStyles.articlePage} article-page`}
      id="content"
    >
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
