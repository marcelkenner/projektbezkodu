export interface FaqItem {
  question: string;
  answer: string;
}

export class FaqStructuredDataBuilder {
  build(items: FaqItem[]) {
    const validItems = items
      .map((item) => ({
        question: item.question?.trim(),
        answer: item.answer?.trim(),
      }))
      .filter(
        (item): item is Required<typeof item> =>
          Boolean(item.question) && Boolean(item.answer),
      );

    if (!validItems.length) {
      return null;
    }

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: validItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    };
  }
}
