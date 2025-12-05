import type { ToolDetail } from "@/app/lib/content/toolCatalog";

export interface ToolOverviewEntry {
  folderName: string;
  slug: string;
  path: string;
  title: string;
  heading?: string;
  subheading?: string;
  hero?: {
    src?: string;
    alt?: string;
  };
}

export class ToolHubCardModel {
  constructor(
    private readonly overview: ToolOverviewEntry,
    private readonly detail?: ToolDetail,
  ) {}

  getSlug() {
    return this.overview.slug;
  }

  getHeading() {
    return (
      this.overview.heading ?? this.overview.title ?? this.overview.folderName
    );
  }

  getSubheading() {
    return this.overview.subheading ?? this.detail?.summary ?? "";
  }

  getHeroImage() {
    return this.overview.hero;
  }

  // Backward-compatibility for legacy callers expecting getHero()
  getHero() {
    return this.getHeroImage();
  }

  getBadgeLabel() {
    return this.overview.folderName;
  }

  getSummaryBullets(limit = 3) {
    return (this.detail?.strengths ?? []).slice(0, limit);
  }

  getLogo() {
    return this.detail?.logo;
  }

  getPrimaryHref() {
    return this.overview.path;
  }

  getSecondaryHref() {
    return this.detail?.siteHref;
  }

  usesAffiliateLink() {
    return Boolean(this.detail?.affiliate);
  }

  getCategoryValue() {
    return this.detail?.category;
  }

  getPlatformValue() {
    return this.detail?.platform;
  }

  getPricingModel() {
    return this.detail?.pricing;
  }
}
