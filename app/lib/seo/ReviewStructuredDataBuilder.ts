import { defaultSiteUrlFactory } from "@/app/lib/url/SiteUrlFactory";

interface ReviewInput {
  canonicalPath: string;
  itemName: string;
  itemUrl?: string;
  ratingValue?: number;
  bestRating?: number;
  worstRating?: number;
  reviewBody?: string;
  authorName?: string;
  pros?: string[];
  cons?: string[];
}

export class ReviewStructuredDataBuilder {
  constructor(private readonly urlFactory = defaultSiteUrlFactory) {}

  build(input: ReviewInput) {
    if (typeof input.ratingValue !== "number") {
      return null;
    }

    const positiveNotes = this.buildNotes(input.pros);
    const negativeNotes = this.buildNotes(input.cons);

    return {
      "@context": "https://schema.org",
      "@type": "Review",
      url: this.urlFactory.build(input.canonicalPath),
      itemReviewed: {
        "@type": "Thing",
        name: input.itemName,
        url: input.itemUrl,
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: input.ratingValue,
        bestRating: input.bestRating,
        worstRating: input.worstRating,
      },
      reviewBody: input.reviewBody,
      author: input.authorName
        ? {
            "@type": "Person",
            name: input.authorName,
          }
        : undefined,
      positiveNotes,
      negativeNotes,
    };
  }

  private buildNotes(items?: string[]) {
    if (!items || !items.length) {
      return undefined;
    }

    return {
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item,
      })),
    };
  }
}
