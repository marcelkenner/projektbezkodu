import affiliatePrograms from "@/data/affiliate-programs.json";

interface AffiliateProgram {
  slug: string;
  url?: string;
  trackingUrl?: string;
  links?: Array<{ type?: string; url: string }>;
}

function flattenPrograms(): AffiliateProgram[] {
  const categories = (affiliatePrograms as { categories?: Array<{ programs?: AffiliateProgram[] }> }).categories ?? [];
  return categories.flatMap((category) => category.programs ?? []);
}

const PROGRAMS = flattenPrograms();

export function getAffiliateProgram(slug: string): AffiliateProgram | undefined {
  return PROGRAMS.find((program) => program.slug === slug);
}

export function getAffiliateLink(slug: string): string | undefined {
  const program = getAffiliateProgram(slug);
  if (!program) {
    return undefined;
  }
  if (program.trackingUrl) {
    return program.trackingUrl;
  }
  const deeplink = program.links?.find((link) => link.type === "tracking" || link.type === "deeplink");
  if (deeplink?.url) {
    return deeplink.url;
  }
  return program.url;
}
