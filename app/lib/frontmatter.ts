import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { z } from "zod";

const OptionalStringSchema = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((value) => (value == null ? undefined : value));

const FrontmatterSEOSchema = z.object({
  title: z.string(),
  description: z.string(),
  keywords: z.array(z.string()).optional(),
  canonical: OptionalStringSchema,
  image: OptionalStringSchema,
  noindex: z.boolean().optional(),
  nofollow: z.boolean().optional(),
});

const FrontmatterActionLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
  rel: OptionalStringSchema,
});

const FrontmatterMetadataSchema = z.object({
  difficulty: OptionalStringSchema,
  duration: OptionalStringSchema,
  tools: z.array(z.string()).optional(),
  author: OptionalStringSchema,
  updatedAt: OptionalStringSchema,
  hasAffiliateLinks: z.boolean().optional(),
  primaryCta: FrontmatterActionLinkSchema.optional(),
  secondaryCta: FrontmatterActionLinkSchema.optional(),
  format: OptionalStringSchema,
  topics: z.union([z.array(z.string()), z.string(), z.null()]).optional(),
  license: OptionalStringSchema,
  downloadHref: OptionalStringSchema,
  detailsHref: OptionalStringSchema,
  checksum: OptionalStringSchema,
  fileSize: OptionalStringSchema,
  time: OptionalStringSchema,
  stack: z.array(z.string()).optional(),
  metrics: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
        description: OptionalStringSchema,
      }),
    )
    .optional(),
  summaryBullets: z.array(z.string()).optional(),
  period: OptionalStringSchema,
  industry: OptionalStringSchema,
  heroImageAlt: OptionalStringSchema,
  heroImageSrc: OptionalStringSchema,
  heroImageWidth: z.number().optional(),
  heroImageHeight: z.number().optional(),
  lessons: z.array(z.string()).optional(),
});

const FrontmatterTaxonomySchema = z.object({
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

const HeroContentSchema = z.object({
  heading: z.string(),
  subheading: OptionalStringSchema,
  primaryCta: OptionalStringSchema,
  secondaryCta: OptionalStringSchema,
  trustLogos: z.array(z.string()).optional(),
  image: z
    .object({
      src: z.string(),
      alt: z.string(),
      width: z.number().optional(),
      height: z.number().optional(),
    })
    .optional(),
});

const FrontmatterSchema = z
  .object({
    title: OptionalStringSchema,
    slug: z.string().optional(),
    path: z.string().optional(),
    draft: z.boolean().optional(),
    template: z.string().default("default"),
    type: z.string().optional(),
    date: z.string().optional(),
    hero: HeroContentSchema.optional(),
    seo: FrontmatterSEOSchema.optional(),
    meta: FrontmatterMetadataSchema.optional(),
    taxonomy: FrontmatterTaxonomySchema.optional(),
  })
  .passthrough();

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
  type?: string;
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

export interface ContentEntryWithComputed extends ContentEntry {
  wordCount: number;
  readingTimeMinutes: number;
}

function estimateReadingTimeMinutes(
  text: string,
  wordsPerMinute = 200,
): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / wordsPerMinute));
}

function normalizeStringArray(
  value?: string[] | string | null,
): string[] | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (Array.isArray(value)) {
    return value;
  }
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function getSlugFromPath(relativePath: string): string {
  const filename = path.basename(relativePath, path.extname(relativePath));
  if (filename === "index") {
    return path.basename(path.dirname(relativePath));
  }
  return filename;
}

function normalizeTitle(rawTitle: string | undefined, slug: string): string {
  if (rawTitle && rawTitle.trim().length > 0) {
    return rawTitle.trim();
  }
  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map(
      (segment) => segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase(),
    )
    .join(" ");
}

function normalizeFrontmatter(
  raw: z.infer<typeof FrontmatterSchema>,
  relativePath: string,
): Frontmatter {
  const slug = raw.slug ?? getSlugFromPath(relativePath);
  const title = normalizeTitle(raw.title, slug);
  const taxonomy: FrontmatterTaxonomy = {
    categories: raw.taxonomy?.categories ?? [],
    tags: raw.taxonomy?.tags ?? [],
  };
  const meta: FrontmatterMetadata = {
    ...(raw.meta ?? {}),
    topics: normalizeStringArray(raw.meta?.topics),
  };
  return {
    title,
    slug,
    path: raw.path ?? `/${slug}`,
    draft: raw.draft ?? false,
    template: raw.template ?? "default",
    type: raw.type,
    date: raw.date,
    hero: raw.hero,
    seo: raw.seo,
    meta,
    taxonomy,
  };
}

export function readMarkdownFile(relativePath: string): ContentEntry {
  const filePath = path.join(process.cwd(), relativePath);
  const file = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(file);
  const parsed = FrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `Invalid frontmatter in ${relativePath}: ${parsed.error.message}`,
    );
  }
  const frontmatter = normalizeFrontmatter(parsed.data, relativePath);
  return {
    frontmatter,
    content,
  };
}

export function readMarkdownFileWithComputed(
  relativePath: string,
): ContentEntryWithComputed {
  const entry = readMarkdownFile(relativePath);
  const wordCount = entry.content.trim().split(/\s+/).length;
  const readingTimeMinutes = estimateReadingTimeMinutes(entry.content);
  return {
    ...entry,
    wordCount,
    readingTimeMinutes,
  };
}
