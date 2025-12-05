import {
  TutorialRepository,
  type ContentSummary,
  type MarkdownDocument,
} from "@/app/lib/content/repositories";
import { tutorialTaxonomyCatalog } from "@/app/lib/content/tutorialTaxonomy";
import { MarkdownRenderer } from "@/app/ui/MarkdownRenderer";
import type { MarkdownHeading } from "@/app/ui/markdown/types";
import { getCopy } from "@/app/lib/copy";

const pillarCopy = getCopy("pillar");

export class PillarPageCoordinator {
  constructor(
    private readonly slug: string,
    private readonly repository: TutorialRepository,
  ) {}

  build() {
    const tutorial = this.repository.getTutorial(this.slug);
    if (!tutorial) {
      return null;
    }
    const renderer = new MarkdownRenderer(tutorial.content);
    const config = new PillarCopyResolver(this.slug).resolve();
    const featured = new FeaturedTutorialSelector(this.repository).select(
      this.slug,
      config.featuredSlugs,
    );
    return new PillarPageViewModel(tutorial, renderer, config, featured);
  }
}

export interface PillarEntryConfig {
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

export interface PillarJourneyConfig {
  heading: string;
  steps: PillarJourneyStep[];
}

export interface PillarJourneyStep {
  label: string;
  description: string;
  resources?: { label: string; href: string }[];
}

export type FeaturedItem = ContentSummary;

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

export class PillarPageViewModel {
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

  getSummaryBullets() {
    return this.tutorial.frontmatter.meta?.summaryBullets;
  }

  getPrimaryCta() {
    return this.tutorial.frontmatter.meta?.primaryCta;
  }

  getSecondaryCta() {
    return this.tutorial.frontmatter.meta?.secondaryCta;
  }

  hasAffiliateLinks() {
    return Boolean(this.tutorial.frontmatter.meta?.hasAffiliateLinks);
  }

  getPublishedDate() {
    return this.tutorial.frontmatter.date;
  }

  getTools() {
    return this.tutorial.frontmatter.meta?.tools;
  }
}

export function extractHowToSteps(headings: MarkdownHeading[]): string[] {
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
