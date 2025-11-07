import globalCopy from "@/data/copy/global.json";
import homepageCopy from "@/data/copy/homepage.json";
import notFoundCopy from "@/data/copy/not-found.json";
import articlesCopy from "@/data/copy/articles.json";
import comparisonsCopy from "@/data/copy/comparisons.json";
import tutorialsCopy from "@/data/copy/tutorials.json";
import glossaryCopy from "@/data/copy/glossary.json";
import privacyCopy from "@/data/copy/privacy.json";
import termsCopy from "@/data/copy/terms.json";
import searchCopy from "@/data/copy/search.json";
import footerCopy from "@/data/copy/footer.json";
import categoryHubsSource from "@/data/copy/category-hubs.json";
import aboutCopy from "@/data/copy/about.json";
import contactCopy from "@/data/copy/contact.json";
import faqCopy from "@/data/copy/faq.json";
import leadMagnetsCopy from "@/data/copy/lead-magnets.json";
import newsletterCopy from "@/data/copy/newsletter.json";
import templatesCopy from "@/data/copy/templates.json";
import toolsCopy from "@/data/copy/tools.json";
import tagsCopy from "@/data/copy/tags.json";
import sitemapCopy from "@/data/copy/sitemap.json";
import cookiesCopy from "@/data/copy/cookies.json";
import resourcesCopy from "@/data/copy/resources.json";
import affiliateCopy from "@/data/copy/affiliate.json";
import accessibilityCopy from "@/data/copy/accessibility.json";
import offlineCopy from "@/data/copy/offline.json";
import systemStatusCopy from "@/data/copy/system-status.json";
import caseStudiesCopy from "@/data/copy/case-studies.json";
import pillarCopy from "@/data/copy/pillar.json";

interface CategoryHubQuickLink {
  label: string;
  href: string;
}

interface CategoryHubDownload {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  privacyLabel: string;
  privacyHref: string;
}

export interface CategoryHubConfig {
  heading: string;
  subheading: string;
  quickLinks?: CategoryHubQuickLink[];
  featuredSlugs?: string[];
  download?: CategoryHubDownload;
  listHeading?: string;
}

type CategoryHubCopy = Record<string, CategoryHubConfig> & {
  default: CategoryHubConfig & { listHeading: string };
};

const categoryHubsCopy = categoryHubsSource as CategoryHubCopy;

type CopyMap = {
  global: typeof globalCopy;
  homepage: typeof homepageCopy;
  "not-found": typeof notFoundCopy;
  articles: typeof articlesCopy;
  comparisons: typeof comparisonsCopy;
  tutorials: typeof tutorialsCopy;
  glossary: typeof glossaryCopy;
  privacy: typeof privacyCopy;
  terms: typeof termsCopy;
  search: typeof searchCopy;
  footer: typeof footerCopy;
  categoryHubs: CategoryHubCopy;
  about: typeof aboutCopy;
  contact: typeof contactCopy;
  faq: typeof faqCopy;
  "lead-magnets": typeof leadMagnetsCopy;
  newsletter: typeof newsletterCopy;
  templates: typeof templatesCopy;
  tools: typeof toolsCopy;
  tags: typeof tagsCopy;
  sitemap: typeof sitemapCopy;
  cookies: typeof cookiesCopy;
  resources: typeof resourcesCopy;
  affiliate: typeof affiliateCopy;
  accessibility: typeof accessibilityCopy;
  offline: typeof offlineCopy;
  "system-status": typeof systemStatusCopy;
  "case-studies": typeof caseStudiesCopy;
  pillar: typeof pillarCopy;
};

const copies: CopyMap = {
  global: globalCopy,
  homepage: homepageCopy,
  "not-found": notFoundCopy,
  articles: articlesCopy,
  comparisons: comparisonsCopy,
  tutorials: tutorialsCopy,
  glossary: glossaryCopy,
  privacy: privacyCopy,
  terms: termsCopy,
  search: searchCopy,
  footer: footerCopy,
  categoryHubs: categoryHubsCopy,
  about: aboutCopy,
  contact: contactCopy,
  faq: faqCopy,
  "lead-magnets": leadMagnetsCopy,
  newsletter: newsletterCopy,
  templates: templatesCopy,
  tools: toolsCopy,
  tags: tagsCopy,
  sitemap: sitemapCopy,
  cookies: cookiesCopy,
  resources: resourcesCopy,
  affiliate: affiliateCopy,
  accessibility: accessibilityCopy,
  offline: offlineCopy,
  "system-status": systemStatusCopy,
  "case-studies": caseStudiesCopy,
  pillar: pillarCopy,
};

export function getCopy<K extends keyof CopyMap>(section: K): CopyMap[K] {
  return copies[section];
}
