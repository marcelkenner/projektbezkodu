import { getCopy } from "@/app/lib/copy";

interface LeadMagnetImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface LeadMagnetFormField {
  id: string;
  label: string;
  placeholder?: string;
}

interface LeadMagnetConsentField extends LeadMagnetFormField {
  privacyLabel: string;
  privacyHref: string;
}

export interface LeadMagnetForm {
  action: string;
  method: "get" | "post";
  title: string;
  emailField: LeadMagnetFormField;
  consentField: LeadMagnetConsentField;
  submitLabel: string;
  disclaimer: string;
}

interface LeadMagnetHero {
  title: string;
  bullets: string[];
  image: LeadMagnetImage;
}

interface LeadMagnetSeo {
  title: string;
  description: string;
  canonical: string;
}

export interface LeadMagnetThankYou {
  seo: LeadMagnetSeo;
  hero: {
    title: string;
    intro: string;
  };
  directDownload?: {
    label: string;
    href: string;
  };
  nextSteps?: {
    heading: string;
    articleSlugs: string[];
  };
}

export interface LeadMagnetEntry {
  slug: string;
  seo: LeadMagnetSeo;
  hero: LeadMagnetHero;
  form: LeadMagnetForm;
  thankYou?: LeadMagnetThankYou;
}

interface RawLeadMagnetEntry {
  seo: LeadMagnetSeo;
  hero: LeadMagnetHero;
  form: {
    action: string;
    method: string;
    title: string;
    emailField: LeadMagnetFormField;
    consentField: LeadMagnetConsentField;
    submitLabel: string;
    disclaimer: string;
  };
  thankYou?: LeadMagnetThankYou;
}

interface LeadMagnetCopy {
  items: Record<string, RawLeadMagnetEntry>;
  fallback: {
    seo: LeadMagnetSeo;
    hero: {
      title: string;
      intro: string;
    };
  };
}

export class LeadMagnetCatalog {
  private readonly copy: LeadMagnetCopy;

  constructor() {
    this.copy = getCopy("lead-magnets");
  }

  get(slug: string): LeadMagnetEntry | undefined {
    const entry = this.copy.items[slug];
    if (!entry) {
      return undefined;
    }
    return {
      slug,
      seo: entry.seo,
      hero: entry.hero,
      thankYou: entry.thankYou,
      form: {
        ...entry.form,
        method: entry.form.method === "post" ? "post" : "get",
      },
    };
  }

  listSlugs(): string[] {
    return Object.keys(this.copy.items);
  }

  getFallback() {
    return this.copy.fallback;
  }
}
