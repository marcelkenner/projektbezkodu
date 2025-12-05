import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TutorialRepository } from "@/app/lib/content/repositories";
import {
  TableOfContents,
  StructuredDataScript,
  ArticleMetaBadges,
  ArticleSummaryBullets,
  ArticleCtaGroup,
  TaxonomyChips,
  ArticleSharePanel,
  AuthorCard,
} from "@/app/ui";
import { HowToStructuredDataBuilder } from "@/app/lib/seo/HowToStructuredDataBuilder";
import { FaqStructuredDataBuilder } from "@/app/lib/seo/FaqStructuredDataBuilder";
import { extractFaqItems } from "@/app/lib/content/faqExtractor";
import "./pillar-page.module.css";
import "../../artykuly/article.module.css";
import { defaultSiteUrlFactory } from "@/app/lib/url/SiteUrlFactory";
import { TextNormalizer } from "@/app/lib/text/TextNormalizer";
import { BreadcrumbComposer } from "@/app/lib/navigation/BreadcrumbComposer";
import { ContentHero } from "@/app/ui/heroes/ContentHero";
import {
  defaultHeroImage,
  heroImageKindFrom,
  resolveHeroImage,
} from "@/app/lib/content/heroImageResolver";
import type { MarkdownHeading } from "@/app/ui/markdown/types";
import type {
  PillarEntryConfig,
  PillarJourneyConfig,
  FeaturedItem,
  PillarPageViewModel,
} from "./viewModel";
import { PillarPageCoordinator, extractHowToSteps } from "./viewModel";

const tutorialRepository = new TutorialRepository();
const tutorialHowToBuilder = new HowToStructuredDataBuilder();
const tutorialFaqBuilder = new FaqStructuredDataBuilder();
const breadcrumbComposer = new BreadcrumbComposer();

interface TutorialPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return tutorialRepository.listSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: TutorialPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const tutorial = tutorialRepository.getTutorial(resolvedParams.slug);
  if (!tutorial) {
    return {};
  }
  const { frontmatter } = tutorial;
  return {
    title: frontmatter.seo?.title ?? frontmatter.title,
    description: frontmatter.seo?.description ?? tutorial.excerpt,
  };
}

export default async function TutorialPage({ params }: TutorialPageProps) {
  const resolvedParams = await params;
  const coordinator = new PillarPageCoordinator(
    resolvedParams.slug,
    tutorialRepository,
  );
  const viewModel = coordinator.build();
  if (!viewModel) {
    notFound();
  }

  const headings = viewModel.getHeadings();
  const hasToc = headings.length > 0;
  const download = viewModel.getDownload();
  const hasSidebar = hasToc || Boolean(download);
  const layoutClassName = hasSidebar
    ? "article-page__layout article-page__layout--with-toc"
    : "article-page__layout";
  const tutorialDocument = viewModel.getDocument();
  const tutorialFrontmatter = tutorialDocument.frontmatter;
  const sidebarRelated = selectSidebarRelatedTutorials(
    tutorialFrontmatter.slug ?? resolvedParams.slug,
    categories,
  );
  const canonicalPath =
    tutorialFrontmatter.path ?? `/poradniki/${resolvedParams.slug}/`;
  const shareUrl = defaultSiteUrlFactory.build(canonicalPath);
  const breadcrumbs = breadcrumbComposer.compose(
    canonicalPath,
    tutorialFrontmatter.title ?? viewModel.getTitle(),
  );
  const heroImage =
    resolveHeroImage(tutorialFrontmatter, viewModel.getTitle()) ??
    defaultHeroImage(
      viewModel.getTitle(),
      heroImageKindFrom(tutorialFrontmatter),
    );
  const categories = viewModel
    .getCategories()
    .reduce<Array<{ label: string; slug?: string }>>((badges, category) => {
      if (!category) {
        return badges;
      }
      badges.push({ label: category.label, slug: category.slug });
      return badges;
    }, []);
  const tags = viewModel
    .getTags()
    .reduce<Array<{ label: string; slug?: string }>>((badges, tag) => {
      if (!tag) {
        return badges;
      }
      badges.push({ label: tag.label, slug: tag.slug });
      return badges;
    }, []);
  const summaryBullets = viewModel.getSummaryBullets();
  const primaryCta = viewModel.getPrimaryCta();
  const secondaryCta = viewModel.getSecondaryCta();
  const hasAffiliateLinks = viewModel.hasAffiliateLinks();
  const structuredDataPayloads = buildStructuredData(viewModel, headings);
  const publishedDate = viewModel.getPublishedDate();
  const shareTitle = tutorialFrontmatter.title ?? viewModel.getTitle();
  const featured = viewModel.getFeatured();
  const journey = viewModel.getJourney();
  const tools = viewModel.getTools();

  return (
    <section className="article-page" id="content">
      <StructuredDataScript
        id="tutorial-structured-data"
        data={structuredDataPayloads.length ? structuredDataPayloads : null}
      />
      <ContentHero
        heading={viewModel.getTitle()}
        subheading={viewModel.getIntro()}
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
            difficulty={viewModel.getDifficulty()}
            duration={viewModel.getDuration()}
          />
        </header>
        <ArticleSharePanel title={shareTitle} url={shareUrl} />
        <ArticleSummaryBullets
          bullets={summaryBullets}
          heading="Co wyniesiesz z tego poradnika?"
        />
        <ArticleCtaGroup
          primary={primaryCta ?? undefined}
          secondary={secondaryCta ?? undefined}
          isAffiliate={hasAffiliateLinks}
        />
        <div className={layoutClassName}>
          {hasSidebar ? (
            <div className="pillar-page__sidebar">
              {hasToc ? (
                <div className="article-page__toc">
                  <TableOfContents
                    title={viewModel.getTocTitle()}
                    items={headings}
                  />
                </div>
              ) : null}
              {sidebarRelated.length ? (
                <RelatedSidebar items={sidebarRelated} heading="Sprawdź też" />
              ) : null}
              {download ? <DownloadCard download={download} /> : null}
            </div>
          ) : null}
          <article className="prose">
            <TutorialTools tools={tools} />
            {viewModel.renderContent()}
          </article>
        </div>
        <AuthorCard />
        <TaxonomyChips
          categories={categories}
          tags={tags}
          ariaLabel="Powiązane kategorie i tagi"
        />
        {journey ? <JourneySection journey={journey} /> : null}
        {featured.length ? (
          <FeaturedSection
            items={featured}
            heading={viewModel.getFeaturedHeading()}
            ctaLabel={viewModel.getFeaturedCtaLabel()}
          />
        ) : null}
      </div>
    </section>
  );
}

function DownloadCard({
  download,
}: {
  download: PillarEntryConfig["download"];
}) {
  if (!download) {
    return null;
  }

  return (
    <div className="pillar-page__download pbk-card pbk-stack pbk-stack--tight">
      <h2>{download.heading}</h2>
      <p>{download.description}</p>
      <Link className="pbk-button pbk-button--primary" href={download.ctaHref}>
        {download.ctaLabel}
      </Link>
      <p className="pillar-page__downloadPrivacy">
        <Link href={download.privacyHref}>{download.privacyLabel}</Link>
      </p>
    </div>
  );
}

function RelatedSidebar({
  items,
  heading,
}: {
  items: Array<{ title: string; path: string }>;
  heading: string;
}) {
  return (
    <aside className="pbk-card pbk-stack" aria-label="Powiązane poradniki">
      <h2 className="pbk-card__meta">{heading}</h2>
      <ul className="pbk-stack pbk-stack--tight">
        {items.map((item) => (
          <li key={item.path}>
            <Link className="pbk-inline-link" href={item.path}>
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function JourneySection({ journey }: { journey: PillarJourneyConfig }) {
  if (!journey.steps.length) {
    return null;
  }

  return (
    <section className="pillar-page__journey">
      <div className="pillar-page__journeyHeader">
        <h2>{journey.heading}</h2>
      </div>
      <ol className="pillar-page__journeyList">
        {journey.steps.map((step) => (
          <li key={`${step.label}-${step.description}`}>
            <div className="pillar-page__journeyStep">
              <h3>{step.label}</h3>
              <p>{step.description}</p>
              {step.resources?.length ? (
                <div className="pillar-page__journeyResources">
                  {step.resources.map((resource) => (
                    <Link key={resource.href} href={resource.href}>
                      {resource.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function TutorialTools({ tools }: { tools?: string[] }) {
  if (!tools || !tools.length) {
    return null;
  }
  return (
    <div className="pillar-page__tools">
      <span>Narzędzia:</span>
      <ul>
        {tools.map((tool) => {
          const slug = TextNormalizer.slugify(tool);
          return (
            <li key={tool}>
              <Link href={`/narzedzia/${slug}/`}>{tool}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function FeaturedSection({
  items,
  heading,
  ctaLabel,
}: {
  items: FeaturedItem[];
  heading: string;
  ctaLabel: string;
}) {
  if (!items.length) {
    return null;
  }

  return (
    <section className="pillar-page__featured pbk-card pbk-stack">
      <div className="pillar-page__featuredHeader">
        <h2>{heading}</h2>
      </div>
      <div className="pillar-page__featuredGrid">
        {items.map((item) => (
          <article key={item.slug} className="pillar-page__featuredCard">
            <h3>{item.title}</h3>
            {item.description ? <p>{item.description}</p> : null}
            <Link className="pillar-page__featuredLink" href={item.path}>
              {ctaLabel}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

function buildStructuredData(
  viewModel: PillarPageViewModel,
  headings: MarkdownHeading[],
) {
  const howToStructuredData = tutorialHowToBuilder.build(
    extractHowToSteps(headings),
    viewModel.getTitle(),
  );
  const faqItems = extractFaqItems(viewModel.getDocument().content);
  const faqStructuredData = tutorialFaqBuilder.build(faqItems);

  return [howToStructuredData, faqStructuredData].filter(Boolean) as Record<
    string,
    unknown
  >[];
}

function selectSidebarRelatedTutorials(
  slug: string,
  categories: Array<{ label: string; slug?: string }>,
) {
  const categorySlugs = new Set(
    categories.map((category) => category.slug).filter(Boolean),
  );
  const list = tutorialRepository.listSummaries();
  const related = list
    .filter((summary) => summary.slug !== slug)
    .map((summary) => ({
      title: summary.title,
      path: summary.path ?? `/poradniki/${summary.slug}/`,
      categories: summary.taxonomy?.categories ?? [],
    }))
    .filter(
      (entry) =>
        !categorySlugs.size ||
        entry.categories.some((cat) => cat && categorySlugs.has(cat)),
    )
    .slice(0, 3);

  if (related.length) {
    return related;
  }

  return list
    .filter((summary) => summary.slug !== slug)
    .slice(0, 3)
    .map((summary) => ({
      title: summary.title,
      path: summary.path ?? `/poradniki/${summary.slug}/`,
    }));
}

function formatDate(input: string): string {
  const timestamp = Date.parse(input);
  if (Number.isNaN(timestamp)) {
    return input;
  }
  return new Intl.DateTimeFormat("pl-PL", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(new Date(timestamp));
}
