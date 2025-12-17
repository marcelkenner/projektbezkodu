import type { Metadata } from "next";

import { ArticleRepository } from "@/app/lib/content/repositories";
import { defaultSiteUrlFactory } from "@/app/lib/url/SiteUrlFactory";

const repository = new ArticleRepository();
const summaries = repository.listSummaries();

export async function buildArticleDetailMetadata(slug: string): Promise<Metadata> {
  const article = repository.getArticle(slug);
  if (!article) {
    return {};
  }
  const { frontmatter, excerpt } = article;
  const summary = summaries.find((entry) => entry.slug === slug);
  const canonical = summary?.path ?? frontmatter.path ?? `/artykuly/${slug}/`;
  const shareUrl = defaultSiteUrlFactory.build(canonical);
  const shareTitle = frontmatter.seo?.title ?? frontmatter.title;
  const shareDescription = frontmatter.seo?.description ?? excerpt;
  const shareImage =
    frontmatter.seo?.image ??
    frontmatter.meta?.heroImageSrc ??
    frontmatter.hero?.image?.src;
  const shareImageUrl = shareImage ? defaultSiteUrlFactory.build(shareImage) : undefined;
  const shareImageAlt =
    frontmatter.hero?.image?.alt ??
    frontmatter.meta?.heroImageAlt ??
    shareTitle;
  const shareImageWidth =
    frontmatter.meta?.heroImageWidth ?? frontmatter.hero?.image?.width ?? 1200;
  const shareImageHeight =
    frontmatter.meta?.heroImageHeight ?? frontmatter.hero?.image?.height ?? 630;

  return {
    title: shareTitle,
    description: shareDescription,
    keywords: frontmatter.seo?.keywords,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: shareUrl,
      title: shareTitle,
      description: shareDescription,
      publishedTime: frontmatter.date,
      modifiedTime: frontmatter.meta?.updatedAt,
      authors: frontmatter.meta?.author ? [frontmatter.meta.author] : undefined,
      images: shareImageUrl
        ? [
            {
              url: shareImageUrl,
              width: shareImageWidth,
              height: shareImageHeight,
              alt: shareImageAlt,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description: shareDescription,
      images: shareImageUrl ? [shareImageUrl] : undefined,
    },
  };
}

