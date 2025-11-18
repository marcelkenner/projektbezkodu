import { defaultSiteUrlFactory } from "@/app/lib/url/SiteUrlFactory";

interface ResourceStructuredDataInput {
  title: string;
  description?: string;
  canonicalPath: string;
  downloadHref?: string;
  topics?: string[];
  license?: string;
  fileFormat?: string;
  fileSize?: string;
  heroImage?: {
    src: string;
    width?: number;
    height?: number;
    alt?: string;
  };
}

export class ResourceStructuredDataBuilder {
  constructor(private readonly urlFactory = defaultSiteUrlFactory) {}

  build(input: ResourceStructuredDataInput) {
    return {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: input.title,
      description: input.description,
      url: this.urlFactory.build(input.canonicalPath),
      inLanguage: "pl-PL",
      learningResourceType:
        input.topics && input.topics.length ? input.topics : undefined,
      license: input.license,
      fileFormat: input.fileFormat,
      size: input.fileSize,
      image: input.heroImage?.src
        ? [
            {
              "@type": "ImageObject",
              url: this.urlFactory.build(input.heroImage.src),
              width: input.heroImage.width,
              height: input.heroImage.height,
              caption: input.heroImage.alt,
            },
          ]
        : undefined,
      offers: input.downloadHref
        ? [
            {
              "@type": "Offer",
              url: this.urlFactory.build(input.downloadHref),
              price: "0",
              priceCurrency: "PLN",
              availability: "https://schema.org/OnlineOnly",
            },
          ]
        : undefined,
    };
  }
}
