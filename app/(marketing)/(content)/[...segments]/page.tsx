import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContentLibrary } from "@/app/lib/content/contentLibrary";
import { ContentPageCoordinator } from "@/app/lib/content/contentPageCoordinator";
import Link from "next/link";
import {
  Breadcrumbs,
  TableOfContents,
  ArticleMetaBadges,
  ArticleSummaryBullets,
  ArticleCtaGroup,
  TaxonomyChips,
  ArticleSharePanel,
  AuthorCard,
  ContentCard,
} from "@/app/ui";
import styles from "./content-page.module.css";
import articleStyles from "../artykuly/article.module.css";
import { BreadcrumbComposer } from "@/app/lib/navigation/BreadcrumbComposer";
import { defaultSiteUrlFactory } from "@/app/lib/url/SiteUrlFactory";
import { RandomArticlesSection } from "../components/RandomArticlesSection";

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
  const sidebarRelated = useArticleLayout
    ? selectSidebarRelatedContent(path, categories)
    : [];
  const hero =
    (
      viewModel as { getHeroImage?: () => { src: string; alt?: string } }
    )?.getHeroImage?.() ?? undefined;
  const metaItems = [
    difficulty ? { label: difficulty } : null,
    duration ? { label: duration } : null,
  ].filter(Boolean) as { label: string }[];

  if (useArticleLayout) {
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
                {sidebarRelated.length ? (
                  <aside
                    className="pbk-card pbk-stack article-page__relatedTools"
                    aria-label="Powiązane treści"
                  >
                    <h2 className="pbk-card__meta">Powiązane</h2>
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
          <RandomArticlesSection currentPath={path} />
        </div>
      </section>
    );
  }

  return (
    <section className="section section--surface" id="content">
      <div className="pbk-container pbk-stack pbk-stack--loose">
        <div className="articles-grid">
          <ContentCard
            title={heading}
            subheading={subheading}
            heroSrc={hero?.src ?? "/img/articles_hero_image.webp"}
            heroAlt={hero?.alt}
            meta={metaItems}
            href={path}
            ctaLabel={primaryCta?.label ?? "Czytaj"}
          />
        </div>
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

function selectSidebarRelatedContent(
  currentPath: string,
  categories: Array<{ label: string; slug: string }>,
) {
  const categorySet = new Set(categories.map((c) => c.slug).filter(Boolean));
  return coordinator
    .listStaticParams()
    .map(({ segments }) => coordinator.build(segments))
    .filter((vm): vm is NonNullable<ReturnType<typeof coordinator.build>> =>
      Boolean(vm),
    )
    .map((vm) => ({
      path: vm.getPath(),
      title: vm.getHeroHeading() ?? vm.getTitle(),
      categories: vm
        .getCategories()
        .map((c) => c.slug)
        .filter(Boolean),
    }))
    .filter((entry) => entry.path !== currentPath)
    .filter(
      (entry) =>
        !categorySet.size ||
        entry.categories.some((cat) => cat && categorySet.has(cat)),
    )
    .slice(0, 3);
}
