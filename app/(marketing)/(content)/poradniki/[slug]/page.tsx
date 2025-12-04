import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  TutorialRepository,
  type ContentSummary,
  type MarkdownDocument,
} from "@/app/lib/content/repositories";
import { tutorialTaxonomyCatalog } from "@/app/lib/content/tutorialTaxonomy";
import { MarkdownRenderer } from "@/app/ui/MarkdownRenderer";
import {
  TableOfContents,
  StructuredDataScript,
  ArticleMetaBadges,
  ArticleSummaryBullets,
  ArticleCtaGroup,
  TaxonomyChips,
  ArticleSharePanel,
} from "@/app/ui";
import type { MarkdownHeading } from "@/app/ui/markdown/types";
import { getCopy } from "@/app/lib/copy";
import { HowToStructuredDataBuilder } from "@/app/lib/seo/HowToStructuredDataBuilder";
import { FaqStructuredDataBuilder } from "@/app/lib/seo/FaqStructuredDataBuilder";
import { extractFaqItems } from "@/app/lib/content/faqExtractor";
import "./pillar-page.module.css";
import { defaultSiteUrlFactory } from "@/app/lib/url/SiteUrlFactory";
import { TextNormalizer } from "@/app/lib/text/TextNormalizer";
import { BreadcrumbComposer } from "@/app/lib/navigation/BreadcrumbComposer";
import { ContentHero } from "@/app/ui/heroes/ContentHero";
import { defaultHeroImage, resolveHeroImage } from "@/app/lib/content/heroImageResolver";

const tutorialRepository = new TutorialRepository();
const pillarCopy = getCopy("pillar");
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
  const coordinator = new PillarPageCoordinator(resolvedParams.slug);
  const viewModel = coordinator.build();
  if (!viewModel) {
    notFound();
  }

  const headings = viewModel.getHeadings();
  const featured = viewModel.getFeatured();
  const download = viewModel.getDownload();
  const journey = viewModel.getJourney();
  const tutorialDocument = viewModel.getDocument();
  const tutorialFrontmatter = tutorialDocument.frontmatter;
  const canonicalPath =
    tutorialFrontmatter.path ?? `/poradniki/${resolvedParams.slug}/`;
  const shareUrl = defaultSiteUrlFactory.build(canonicalPath);
  const breadcrumbs = breadcrumbComposer.compose(
    canonicalPath,
    tutorialFrontmatter.title ?? viewModel.getTitle(),
  );
  const heroImage =
    resolveHeroImage(tutorialFrontmatter, viewModel.getTitle()) ??
    defaultHeroImage(viewModel.getTitle());
  const categoryBadges = viewModel
    .getCategories()
    .reduce<Array<{ label: string; slug?: string }>>((badges, category) => {
      if (!category) {
        return badges;
      }
      badges.push({ label: category.label, slug: category.slug });
      return badges;
    }, []);
  const tagBadges = viewModel
    .getTags()
    .reduce<Array<{ label: string; slug?: string }>>((badges, tag) => {
      if (!tag) {
        return badges;
      }
      badges.push({ label: tag.label, slug: tag.slug });
      return badges;
    }, []);
  const difficulty = viewModel.getDifficulty();
  const duration = viewModel.getDuration();
  const summaryBullets = tutorialFrontmatter.meta?.summaryBullets;
  const primaryCta = tutorialFrontmatter.meta?.primaryCta;
  const secondaryCta = tutorialFrontmatter.meta?.secondaryCta;
  const hasAffiliateLinks = Boolean(
    tutorialFrontmatter.meta?.hasAffiliateLinks,
  );
  const howToStructuredData = tutorialHowToBuilder.build(
    extractHowToSteps(headings),
    tutorialDocument.frontmatter.title,
  );
  const faqItems = extractFaqItems(tutorialDocument.content);
  const faqStructuredData = tutorialFaqBuilder.build(faqItems);
  const structuredDataPayloads = [
    howToStructuredData,
    faqStructuredData,
  ].filter(Boolean) as Record<string, unknown>[];

  return (
    <section className="pillar-page section section--surface" id="content">
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
      <div className="pbk-container pillar-page__layout">
        <aside className="pillar-page__aside">
          <TableOfContents title={viewModel.getTocTitle()} items={headings} />
          {download ? (
            <div className="pillar-page__download pbk-card pbk-stack pbk-stack--tight">
              <h2>{download.heading}</h2>
              <p>{download.description}</p>
              <Link
                className="pbk-button pbk-button--primary"
                href={download.ctaHref}
              >
                {download.ctaLabel}
              </Link>
              <p className="pillar-page__downloadPrivacy">
                <Link href={download.privacyHref}>{download.privacyLabel}</Link>
              </p>
            </div>
          ) : null}
        </aside>
        <article className="pillar-page__content">
          <header className="pillar-page__hero pbk-stack pbk-stack--tight">
            <ArticleMetaBadges
              categories={categoryBadges}
              difficulty={difficulty}
              duration={duration}
            />
          </header>
          <ArticleSharePanel title={tutorialFrontmatter.title} url={shareUrl} />
          <TutorialTools tools={tutorialFrontmatter.meta?.tools} />
          <ArticleSummaryBullets
            bullets={summaryBullets}
            heading="Co wyniesiesz z tego poradnika?"
          />
          <div className="pillar-page__article prose">
            {viewModel.renderContent()}
            <ArticleCtaGroup
              primary={primaryCta ?? undefined}
              secondary={secondaryCta ?? undefined}
              isAffiliate={hasAffiliateLinks}
            />
            <TaxonomyChips
              categories={categoryBadges}
              tags={tagBadges}
              ariaLabel="Powiązane kategorie i tagi"
            />
          </div>
        </article>
        {journey ? <JourneySection journey={journey} /> : null}
        {featured.length ? (
          <section className="pillar-page__featured pbk-card pbk-stack">
            <div className="pillar-page__featuredHeader">
              <h2>{viewModel.getFeaturedHeading()}</h2>
            </div>
            <div className="pillar-page__featuredGrid">
              {featured.map((item) => (
                <article key={item.slug} className="pillar-page__featuredCard">
                  <h3>{item.title}</h3>
                  {item.description ? <p>{item.description}</p> : null}
                  <Link className="pillar-page__featuredLink" href={item.path}>
                    {viewModel.getFeaturedCtaLabel()}
                  </Link>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </section>
  );
}

class PillarPageCoordinator {
  constructor(private readonly slug: string) {}

  build() {
    const tutorial = tutorialRepository.getTutorial(this.slug);
    if (!tutorial) {
      return null;
    }
    const renderer = new MarkdownRenderer(tutorial.content);
    const config = new PillarCopyResolver(this.slug).resolve();
    const featured = new FeaturedTutorialSelector(tutorialRepository).select(
      this.slug,
      config.featuredSlugs,
    );
    return new PillarPageViewModel(tutorial, renderer, config, featured);
  }
}

interface PillarEntryConfig {
  tocTitle: string;
  featuredHeading: string;
  featuredCtaLabel: string;
  featuredSlugs?: string[];
  download?: {
    heading: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
    privacyLabel: string;
    privacyHref: string;
  };
  journey?: PillarJourneyConfig;
}

type PillarSlug = keyof typeof pillarCopy.entries;

function isPillarSlug(slug: string): slug is PillarSlug {
  return Object.prototype.hasOwnProperty.call(pillarCopy.entries, slug);
}

class PillarCopyResolver {
  constructor(private readonly slug: string) {}

  resolve(): PillarEntryConfig {
    const entry = isPillarSlug(this.slug)
      ? pillarCopy.entries[this.slug]
      : ({} as Partial<PillarEntryConfig>);
    return {
      tocTitle: entry.tocTitle ?? pillarCopy.fallback.tocTitle,
      featuredHeading:
        entry.featuredHeading ?? pillarCopy.fallback.featuredHeading,
      featuredCtaLabel:
        entry.featuredCtaLabel ?? pillarCopy.fallback.featuredCtaLabel,
      featuredSlugs: entry.featuredSlugs ?? [],
      download: entry.download ?? pillarCopy.fallback.download,
      journey: entry.journey ?? pillarCopy.fallback.journey,
    };
  }
}

interface PillarJourneyConfig {
  heading: string;
  steps: PillarJourneyStep[];
}

interface PillarJourneyStep {
  label: string;
  description: string;
  resources?: { label: string; href: string }[];
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

type FeaturedItem = ContentSummary;

class FeaturedTutorialSelector {
  constructor(private readonly repository: TutorialRepository) {}

  select(slug: string, preferred: string[] = [], limit = 4): FeaturedItem[] {
    const all = this.repository
      .listSummaries()
      .filter((summary) => summary.slug !== slug);

    if (preferred.length) {
      const preferredItems = preferred
        .map((preferredSlug) =>
          all.find((summary) => summary.slug === preferredSlug),
        )
        .filter((summary): summary is ContentSummary => Boolean(summary));
      if (preferredItems.length >= limit) {
        return preferredItems.slice(0, limit);
      }
      const remaining = all.filter(
        (summary) =>
          !preferredItems.some(
            (preferredItem) => preferredItem.slug === summary.slug,
          ),
      );
      return [
        ...preferredItems,
        ...remaining.slice(0, limit - preferredItems.length),
      ];
    }

    return all.slice(0, limit);
  }
}

function extractHowToSteps(headings: MarkdownHeading[]): string[] {
  const normalized = headings
    .filter((heading) => heading.level === 2)
    .map((heading) => heading.text.trim())
    .filter(Boolean);

  const numbered = normalized.filter((text) =>
    /^(\d+\.|krok\s*\d+)/i.test(text),
  );
  const source = numbered.length ? numbered : normalized;

  return source.map(
    (text) => text.replace(/^(\d+\.?|krok\s*\d*:?)\s*/i, "").trim() || text,
  );
}

class PillarPageViewModel {
  constructor(
    private readonly tutorial: MarkdownDocument,
    private readonly renderer: MarkdownRenderer,
    private readonly config: PillarEntryConfig,
    private readonly featured: FeaturedItem[],
  ) {}

  getHeadings() {
    return this.renderer.getHeadings();
  }

  getTitle() {
    return this.tutorial.frontmatter.title;
  }

  getIntro() {
    return this.tutorial.frontmatter.hero?.subheading ?? this.tutorial.excerpt;
  }

  getCategories() {
    return tutorialTaxonomyCatalog.resolveCategories(
      this.tutorial.frontmatter.taxonomy?.categories,
    );
  }

  getTags() {
    return tutorialTaxonomyCatalog.resolveTags(
      this.tutorial.frontmatter.taxonomy?.tags,
    );
  }

  getDifficulty() {
    return this.tutorial.frontmatter.meta?.difficulty;
  }

  getDuration() {
    return this.tutorial.frontmatter.meta?.duration;
  }

  renderContent() {
    return this.renderer.render();
  }

  getTocTitle() {
    return this.config.tocTitle;
  }

  getFeaturedHeading() {
    return this.config.featuredHeading;
  }

  getFeaturedCtaLabel() {
    return this.config.featuredCtaLabel;
  }

  getFeatured() {
    return this.featured;
  }

  getDownload() {
    return this.config.download;
  }

  getDocument() {
    return this.tutorial;
  }

  getJourney() {
    return this.config.journey;
  }
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
