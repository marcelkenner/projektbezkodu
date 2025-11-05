import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface FrontmatterSEO {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
}

export interface FrontmatterMetadata {
  difficulty?: string;
  duration?: string;
  tools?: string[];
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
