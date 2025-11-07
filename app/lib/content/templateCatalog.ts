import templatesData from "@/data/catalog/templates.json";

export type TemplatePlatform = "webflow" | "framer" | "";
export type TemplateType = "landing" | "blog" | "portfolio" | "";
export type TemplatePrice = "free" | "paid" | "";

export interface TemplateFilter {
  platform?: TemplatePlatform;
  type?: TemplateType;
  price?: TemplatePrice;
}

export interface TemplateCard {
  slug: string;
  name: string;
  platform: TemplatePlatform;
  type: TemplateType;
  price: TemplatePrice | "freemium";
  badge: string;
  summary: string;
  previewHref: string;
  primaryHref: string;
}

export interface TemplateStep {
  description: string;
}

export interface TemplateFaq {
  question: string;
  answer: string;
}

export interface TemplatePricing {
  plan: string;
  amount: string;
  period: string;
}

export interface TemplateDetail extends TemplateCard {
  features: string[];
  requirements: string[];
  steps: string[];
  faq: TemplateFaq[];
  pricing: TemplatePricing[];
}

type RawTemplateEntry = TemplateDetail;

export class TemplateCatalog {
  private readonly templates: TemplateDetail[];

  constructor() {
    this.templates = (templatesData as RawTemplateEntry[]).map((entry) => ({
      ...entry,
    }));
  }

  list(filter: TemplateFilter = {}): TemplateCard[] {
    return this.templates
      .filter((template) => this.matchesFilter(template, filter))
      .map((template) => this.toCard(template))
      .sort((a, b) => a.name.localeCompare(b.name, "pl"));
  }

  find(slug: string): TemplateDetail | undefined {
    return this.templates.find((template) => template.slug === slug);
  }

  private matchesFilter(template: TemplateDetail, filter: TemplateFilter) {
    const platformMatches =
      !filter.platform || template.platform === filter.platform;
    const typeMatches = !filter.type || template.type === filter.type;
    const priceMatches = !filter.price || template.price === filter.price;

    return platformMatches && typeMatches && priceMatches;
  }

  private toCard(template: TemplateDetail): TemplateCard {
    const {
      slug,
      name,
      platform,
      type,
      price,
      badge,
      summary,
      previewHref,
      primaryHref,
    } = template;
    return {
      slug,
      name,
      platform,
      type,
      price,
      badge,
      summary,
      previewHref,
      primaryHref,
    };
  }
}
