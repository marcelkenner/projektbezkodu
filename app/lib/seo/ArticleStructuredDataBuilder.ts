import { defaultSiteUrlFactory } from "@/app/lib/url/SiteUrlFactory";

interface ArticleImageInput {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface ArticleStructuredDataInput {
  title: string;
  description: string;
  canonicalPath: string;
  authorName?: string;
  datePublished?: string;
  dateModified?: string;
  tags?: string[];
  categories?: string[];
  image?: ArticleImageInput | null;
}

const PUBLISHER_NAME = "ProjektBezKodu";
const PUBLISHER_LOGO_PATH = "/projektbezkodu_logo.png";

export class ArticleStructuredDataBuilder {
  constructor(private readonly originFactory = defaultSiteUrlFactory) {}

  build(input: ArticleStructuredDataInput) {
    const url = this.originFactory.build(input.canonicalPath);
    const datePublished = this.normalizeDate(input.datePublished);
    const dateModified =
      this.normalizeDate(input.dateModified) ?? datePublished ?? undefined;

    return {
      "@context": "https://schema.org",
      "@type": "Article",
      mainEntityOfPage: url,
      headline: input.title,
      description: input.description,
      datePublished,
      dateModified,
      inLanguage: "pl-PL",
      author: this.resolveAuthor(input.authorName),
      publisher: this.buildPublisher(),
      keywords: this.normalizeKeywords(input.tags),
      articleSection: this.normalizeKeywords(input.categories),
      image: this.buildImage(input.image),
    };
  }

  private normalizeDate(value?: string) {
    if (!value) {
      return undefined;
    }
    const parsed = Date.parse(value);
    if (Number.isNaN(parsed)) {
      return undefined;
    }
    return new Date(parsed).toISOString();
  }

  private resolveAuthor(name?: string) {
    const safeName = name?.trim() || PUBLISHER_NAME;
    return {
      "@type": "Person",
      name: safeName,
    };
  }

  private buildPublisher() {
    return {
      "@type": "Organization",
      name: PUBLISHER_NAME,
      logo: {
        "@type": "ImageObject",
        url: this.originFactory.build(PUBLISHER_LOGO_PATH),
      },
    };
  }

  private normalizeKeywords(values?: string[]) {
    if (!values || !values.length) {
      return undefined;
    }
    return values.filter(Boolean);
  }

  private buildImage(image?: ArticleImageInput | null) {
    if (!image?.src) {
      return undefined;
    }
    return [
      {
        "@type": "ImageObject",
        url: this.originFactory.build(image.src),
        width: image.width,
        height: image.height,
        caption: image.alt,
      },
    ];
  }
}
