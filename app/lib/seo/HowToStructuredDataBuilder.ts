export class HowToStructuredDataBuilder {
  build(steps: string[], heading: string) {
    const normalizedSteps = steps
      .map((step) => step.trim())
      .filter((step) => step.length > 0);

    if (!normalizedSteps.length) {
      return null;
    }

    return {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: heading,
      step: normalizedSteps.map((step, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        text: step,
      })),
    };
  }
}
