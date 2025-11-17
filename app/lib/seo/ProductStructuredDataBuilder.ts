import { defaultSiteUrlFactory } from "@/app/lib/url/SiteUrlFactory";
import { StructuredDataPriceParser } from "@/app/lib/seo/StructuredDataPriceParser";

interface ProductOfferInput {
  identifier: string;
  price?: string;
  currency?: string;
  url?: string;
  availability?: string;
}

interface ProductStructuredDataInput {
  name: string;
  description: string;
  canonicalPath: string;
  brand?: string;
  category?: string;
  image?: string;
  offers?: ProductOfferInput[];
  isFree?: boolean;
}

type StructuredOffer = {
  "@type": "Offer";
  price: string;
  priceCurrency: string;
  availability: string;
  url?: string;
  sku: string;
};

export class ProductStructuredDataBuilder {
  private readonly priceParser = new StructuredDataPriceParser();

  constructor(private readonly urlFactory = defaultSiteUrlFactory) {}

  build(input: ProductStructuredDataInput) {
    const offers = this.buildOffers(input.offers);
    const isAccessibleForFree =
      input.isFree ?? offers.some((offer) => offer.price === "0");

    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: input.name,
      description: input.description,
      sku: input.canonicalPath,
      url: this.urlFactory.build(input.canonicalPath),
      category: input.category,
      brand: input.brand
        ? {
            "@type": "Brand",
            name: input.brand,
          }
        : undefined,
      image: input.image ? [this.urlFactory.build(input.image)] : undefined,
      offers: offers.length ? offers : undefined,
      isAccessibleForFree,
    };
  }

  private buildOffers(offers: ProductOfferInput[] = []): StructuredOffer[] {
    const structured = offers
      .map((offer) => {
        const price = this.priceParser.parse(offer.price);
        if (!price) {
          return null;
        }
        return {
          "@type": "Offer",
          price: price.amount,
          priceCurrency: price.currency,
          availability:
            offer.availability ?? "https://schema.org/InStock",
          url: offer.url ? this.urlFactory.build(offer.url) : undefined,
          sku: offer.identifier,
        };
      })
      .filter(Boolean) as StructuredOffer[];

    return structured;
  }
}
