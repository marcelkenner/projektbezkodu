import toolsData from "@/data/catalog/tools.json";

export type ToolCategory =
  | "site-builders"
  | "automation"
  | "analytics"
  | "marketing"
  | "";
export type ToolPricing = "free" | "freemium" | "paid" | "";
export type ToolPlatform = "web" | "desktop" | "";

export interface ToolFilter {
  category?: ToolCategory;
  pricing?: ToolPricing;
  platform?: ToolPlatform;
}

export interface ToolLogo {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface ToolCard {
  slug: string;
  name: string;
  category: ToolCategory;
  pricing: ToolPricing;
  platform: ToolPlatform;
  summary: string;
  guideHref: string;
  siteHref: string;
  affiliate: boolean;
  logo?: ToolLogo;
}

export interface ToolDetail extends ToolCard {
  strengths: string[];
  limitations: string[];
  gettingStarted: string[];
  pricingTable: {
    plan: string;
    amount: string;
    period: string;
  }[];
  taxonomy?: {
    categories?: string[];
  };
  related?: {
    compare?: string[];
    caseStudies?: string[];
  };
}

type RawToolEntry = ToolDetail;

export class ToolCatalog {
  private readonly tools: ToolDetail[];

  constructor() {
    this.tools = (toolsData as RawToolEntry[]).map((entry) => ({ ...entry }));
  }

  list(filter: ToolFilter = {}): ToolCard[] {
    return this.tools
      .filter((tool) => this.matchesFilter(tool, filter))
      .map((tool) => this.toCard(tool))
      .sort((a, b) => a.name.localeCompare(b.name, "pl"));
  }

  listDetails(filter: ToolFilter = {}): ToolDetail[] {
    return this.tools
      .filter((tool) => this.matchesFilter(tool, filter))
      .sort((a, b) => a.name.localeCompare(b.name, "pl"));
  }

  find(slug: string): ToolDetail | undefined {
    return this.tools.find((tool) => tool.slug === slug);
  }

  private matchesFilter(tool: ToolDetail, filter: ToolFilter) {
    const categoryMatches =
      !filter.category || tool.category === filter.category;
    const pricingMatches = !filter.pricing || tool.pricing === filter.pricing;
    const platformMatches =
      !filter.platform || tool.platform === filter.platform;
    return categoryMatches && pricingMatches && platformMatches;
  }

  private toCard(tool: ToolDetail): ToolCard {
    const {
      slug,
      name,
      category,
      pricing,
      platform,
      summary,
      guideHref,
      siteHref,
      affiliate,
      logo,
    } = tool;
    return {
      slug,
      name,
      category,
      pricing,
      platform,
      summary,
      guideHref,
      siteHref,
      affiliate,
      logo,
    };
  }
}
