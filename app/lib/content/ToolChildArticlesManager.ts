import type { ContentRouteEntry } from "@/app/lib/content/contentLibrary";
import { ContentLibrary } from "@/app/lib/content/contentLibrary";

export interface ToolChildArticleCardModel {
  title: string;
  description?: string;
  path: string;
  hero: { src: string; alt?: string; fallbackSrc: string };
  meta?: { duration?: string; publishedAt?: string; extra?: Array<{ label: string }> };
}

export class ToolChildArticlesManager {
  constructor(private readonly library: ContentLibrary) {}

  list(slug: string): ToolChildArticleCardModel[] {
    return this.library
      .listRoutes()
      .filter((entry) => this.isToolChildEntry(entry, slug))
      .map((entry) => this.toCardModel(entry))
      .sort((a, b) => a.title.localeCompare(b.title, "pl"));
  }

  private isToolChildEntry(entry: ContentRouteEntry, slug: string): boolean {
    if (!entry.path.startsWith(`/narzedzia/${slug}/`)) {
      return false;
    }

    if (entry.path === `/narzedzia/${slug}/`) {
      return false;
    }

    if (entry.segments.length < 2) {
      return false;
    }

    return entry.document.frontmatter.draft !== true;
  }

  private toCardModel(entry: ContentRouteEntry): ToolChildArticleCardModel {
    const frontmatter = entry.document.frontmatter;
    const heroSrc =
      frontmatter.hero?.image?.src ??
      frontmatter.meta?.heroImageSrc ??
      "/img/tools_hero_image.webp";
    const description =
      frontmatter.hero?.subheading ??
      frontmatter.seo?.description ??
      entry.document.excerpt;
    const primaryCategory = frontmatter.taxonomy?.categories?.[0];

    return {
      title: frontmatter.title ?? entry.segments.at(-1) ?? "Artykuł",
      description,
      path: entry.path,
      hero: {
        src: heroSrc,
        alt:
          frontmatter.hero?.image?.alt ??
          frontmatter.meta?.heroImageAlt ??
          frontmatter.title,
        fallbackSrc: "/img/tools_hero_image.webp",
      },
      meta: {
        duration: frontmatter.meta?.duration,
        publishedAt: frontmatter.date,
        extra: primaryCategory ? [{ label: primaryCategory }] : [],
      },
    };
  }
}

