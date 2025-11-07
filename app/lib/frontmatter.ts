import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface FrontmatterSEO {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
}

export interface FrontmatterActionLink {
  label: string;
  href: string;
  rel?: string;
}

export interface FrontmatterMetadata {
  difficulty?: string;
  duration?: string;
  tools?: string[];
  author?: string;
  updatedAt?: string;
  hasAffiliateLinks?: boolean;
  primaryCta?: FrontmatterActionLink;
  secondaryCta?: FrontmatterActionLink;
  format?: string;
  topics?: string[] | string;
  license?: string;
  downloadHref?: string;
  detailsHref?: string;
  checksum?: string;
  fileSize?: string;
  time?: string;
  stack?: string[];
  metrics?: { label: string; value: string; description?: string }[];
  summaryBullets?: string[];
  period?: string;
  industry?: string;
  heroImageAlt?: string;
  heroImageSrc?: string;
  heroImageWidth?: number;
  heroImageHeight?: number;
  lessons?: string[];
}

export interface FrontmatterTaxonomy {
  categories?: string[];
  tags?: string[];
}

export interface HeroContent {
  heading: string;
  subheading?: string;
  primaryCta?: string;
  secondaryCta?: string;
  trustLogos?: string[];
  image?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
}

export interface Frontmatter {
  title: string;
  slug?: string;
  path: string;
  draft: boolean;
  template: string;
  date?: string;
  hero?: HeroContent;
  seo?: FrontmatterSEO;
  meta?: FrontmatterMetadata;
  taxonomy?: FrontmatterTaxonomy;
}

export interface ContentEntry {
  frontmatter: Frontmatter;
  content: string;
}

export function readMarkdownFile(relativePath: string): ContentEntry {
  const filePath = path.join(process.cwd(), relativePath);
  const file = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(file);
  return {
    frontmatter: data as Frontmatter,
    content,
  };
}
