import { defaultSiteUrlFactory } from "@/app/lib/url/SiteUrlFactory";
import { StructuredDataPriceParser } from "@/app/lib/seo/StructuredDataPriceParser";

interface SoftwareApplicationOfferInput {
  identifier: string;
  amount?: string;
  url?: string;
}

interface SoftwareApplicationStructuredDataInput {
  canonicalPath: string;
  name: string;
  description?: string;
  applicationCategory?: string;
  operatingSystem?: string;
  landingPage?: string;
  features?: string[];
  pricingModel?: string;
  offers?: SoftwareApplicationOfferInput[];
}

type SoftwareOffer = {
  "@type": "Offer";
  price: string;
  priceCurrency: string;
  url?: string;
  sku: string;
  availability: string;
};

export class SoftwareApplicationStructuredDataBuilder {
  private readonly priceParser = new StructuredDataPriceParser();

  constructor(private readonly urlFactory = defaultSiteUrlFactory) {}

  build(input: SoftwareApplicationStructuredDataInput) {
    const offers = (input.offers ?? [])
      .map((offer) => {
        const price = this.priceParser.parse(offer.amount);
        if (!price) {
          return null;
        }
        return {
          "@type": "Offer",
          price: price.amount,
          priceCurrency: price.currency,
          url: offer.url ? this.urlFactory.build(offer.url) : undefined,
          sku: offer.identifier,
          availability: "https://schema.org/InStock",
        };
      })
      .filter(Boolean) as SoftwareOffer[];

    return {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: input.name,
      description: input.description,
      applicationCategory: input.applicationCategory,
      operatingSystem: input.operatingSystem ?? "Web",
      offers: offers.length ? offers : undefined,
      featureList: input.features && input.features.length ? input.features : undefined,
      applicationSuite: input.pricingModel,
      url: this.urlFactory.build(input.canonicalPath),
      sameAs: input.landingPage ? [input.landingPage] : undefined,
      isAccessibleForFree: this.isAccessibleForFree(input.pricingModel, offers),
    };
  }

  private isAccessibleForFree(
    pricingModel?: string,
    offers?: {
      price: string;
    }[],
  ) {
    if (offers && offers.some((offer) => offer.price === "0")) {
      return true;
    }
    if (!pricingModel) {
      return undefined;
    }
    return pricingModel === "free" || pricingModel === "freemium"
      ? true
      : undefined;
  }
}
