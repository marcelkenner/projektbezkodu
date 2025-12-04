import type { Metadata } from "next";

import type { Frontmatter, FrontmatterSEO } from "@/app/lib/frontmatter";

import { MarkdownRenderer } from "@/app/ui/MarkdownRenderer";
import type { MarkdownHeading } from "@/app/ui/markdown/types";

import type { ContentRouteEntry } from "./contentLibrary";
import { defaultSiteUrlFactory } from "@/app/lib/url/SiteUrlFactory";
import { TextNormalizer } from "@/app/lib/text/TextNormalizer";

export class ContentPageViewModel {
  private readonly renderer: MarkdownRenderer;
  private static readonly ARTICLE_TYPES = new Set([
    "article",
    "guide",
    "playbook",
  ]);

  constructor(private readonly entry: ContentRouteEntry) {
    this.renderer = new MarkdownRenderer(entry.document.content, {
      headingLevelsForToc: [2],
    });
  }

  getTitle(): string {
    return (
      this.entry.document.frontmatter.title ??
      this.entry.segments.at(-1)?.replace(/-/g, " ") ??
      "Treść"
    );
  }

  getHeroHeading(): string {
    return this.entry.document.frontmatter.hero?.heading ?? this.getTitle();
  }

  getHeroSubheading(): string | undefined {
    return this.entry.document.frontmatter.hero?.subheading;
  }

  getHeroImage() {
    const { frontmatter } = this.entry.document;
    const heading = this.getHeroHeading();

    const heroImage = frontmatter.hero?.image;
    if (heroImage?.src) {
      return {
        src: heroImage.src,
        alt: heroImage.alt ?? heading,
        width: heroImage.width,
        height: heroImage.height,
      };
    }

    const metaImage = frontmatter.meta;
    if (metaImage?.heroImageSrc) {
      return {
        src: metaImage.heroImageSrc,
        alt: metaImage.heroImageAlt ?? heading,
        width: metaImage.heroImageWidth,
        height: metaImage.heroImageHeight,
      };
    }

    return null;
  }

  getPublishedDate(): string | undefined {
    return this.entry.document.frontmatter.date;
  }

  getBody() {
    return this.renderer.render();
  }
  getHeadings(): MarkdownHeading[] {
    return this.renderer.getHeadings();
  }

  shouldUseArticleLayout(): boolean {
    const type = this.entry.document.frontmatter?.type;
    if (typeof type !== "string") {
      return false;
    }
    return ContentPageViewModel.ARTICLE_TYPES.has(type.toLowerCase());
  }

  getMetadata(): Metadata {
    const seo = (this.entry.document.frontmatter.seo ??
      {}) as Partial<FrontmatterSEO>;
    const description =
      seo.description ??
      this.entry.document.frontmatter.hero?.subheading ??
      this.entry.document.excerpt;
    const title = seo.title ?? this.getTitle();
    const canonicalPath = seo.canonical ?? this.entry.path;
    const canonicalUrl = defaultSiteUrlFactory.build(canonicalPath);
    const shareImage = this.resolveShareImage();
    const openGraphImages = shareImage
      ? [
          {
            url: shareImage.url,
            width: shareImage.width,
            height: shareImage.height,
            alt: shareImage.alt,
          },
        ]
      : undefined;

    return {
      title,
      description,
      alternates: {
        canonical: canonicalPath,
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        images: openGraphImages,
      },
      twitter: {
        card: shareImage ? "summary_large_image" : "summary",
        title,
        description,
        images: shareImage ? [shareImage.url] : undefined,
      },
    };
  }

  getPath(): string {
    return this.entry.path;
  }

  getFrontmatter(): Frontmatter {
    return this.entry.document.frontmatter;
  }

  getCategories() {
    const categories = this.entry.document.frontmatter.taxonomy?.categories;
    if (!categories?.length) {
      return [];
    }
    return categories.map((label) => ({
      label,
      slug: TextNormalizer.slugify(label),
    }));
  }

  getTags() {
    const tags = this.entry.document.frontmatter.taxonomy?.tags;
    if (!tags?.length) {
      return [];
    }
    return tags.map((label) => ({
      label,
      slug: TextNormalizer.slugify(label),
    }));
  }

  getDifficulty(): string | undefined {
    return this.entry.document.frontmatter.meta?.difficulty ?? undefined;
  }

  getDuration(): string | undefined {
    return this.entry.document.frontmatter.meta?.duration ?? undefined;
  }

  getSummaryBullets(): string[] | undefined {
    return this.entry.document.frontmatter.meta?.summaryBullets ?? undefined;
  }

  getPrimaryCta() {
    return this.entry.document.frontmatter.meta?.primaryCta;
  }

  getSecondaryCta() {
    return this.entry.document.frontmatter.meta?.secondaryCta;
  }

  hasAffiliateLinks(): boolean {
    return Boolean(this.entry.document.frontmatter.meta?.hasAffiliateLinks);
  }

  private resolveShareImage() {
    const frontmatter = this.entry.document.frontmatter;
    const fallbackAlt = this.getHeroHeading();

    if (frontmatter.seo?.image) {
      return {
        url: defaultSiteUrlFactory.build(frontmatter.seo.image),
        alt: fallbackAlt,
      };
    }

    if (frontmatter.hero?.image?.src) {
      return {
        url: defaultSiteUrlFactory.build(frontmatter.hero.image.src),
        alt: frontmatter.hero.image.alt ?? fallbackAlt,
        width: frontmatter.hero.image.width,
        height: frontmatter.hero.image.height,
      };
    }

    if (frontmatter.meta?.heroImageSrc) {
      return {
        url: defaultSiteUrlFactory.build(frontmatter.meta.heroImageSrc),
        alt: frontmatter.meta.heroImageAlt ?? fallbackAlt,
        width: frontmatter.meta.heroImageWidth,
        height: frontmatter.meta.heroImageHeight,
      };
    }

    return null;
  }
}
