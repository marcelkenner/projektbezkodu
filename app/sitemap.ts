import type { MetadataRoute } from "next";
import {
  ArticleRepository,
  GlossaryRepository,
} from "@/app/lib/content/repositories";
import { MarkdownPageLoader } from "@/app/lib/content/pageLoader";
import { SitemapComposer } from "@/app/lib/navigation/SitemapComposer";

const BASE_URL = "https://projektbezkodu.pl";

class SitemapGenerator {
  private readonly composer = new SitemapComposer();
  private readonly articles = new ArticleRepository();
  private readonly glossary = new GlossaryRepository();
  private readonly privacyPage = new MarkdownPageLoader(
    "content/artykuly/polityka-prywatnosci/index.md",
  );
  private readonly termsPage = new MarkdownPageLoader(
    "content/artykuly/regulamin/index.md",
  );

  build(): MetadataRoute.Sitemap {
    const entries = this.composer.buildLinks().map((link) => ({
      url: this.toAbsoluteUrl(link.href),
      lastModified: this.getLastModified(link.href),
    }));

    return entries;
  }

  private toAbsoluteUrl(path: string): string {
    if (path.startsWith("http")) {
      return path;
    }
    return new URL(path, BASE_URL).toString();
  }

  private getLastModified(path: string): string | undefined {
    if (path.startsWith("/artykuly/") && path !== "/artykuly/") {
      const slug = this.extractSlug(path, "/artykuly/");
      const article = this.articles.getArticle(slug);
      return (
        article?.frontmatter.meta?.updatedAt ??
        article?.frontmatter.date ??
        undefined
      );
    }

    if (path === "/artykuly/") {
      const latest = this.articles
        .listSummaries()
        .map((summary) => summary.meta?.updatedAt ?? summary.date)
        .find(Boolean);
      return latest ?? undefined;
    }

    if (path.startsWith("/glossary/") && path !== "/glossary/") {
      const slug = this.extractSlug(path, "/glossary/");
      const entry = this.glossary.getTerm(slug);
      return (
        entry?.frontmatter.meta?.updatedAt ??
        entry?.frontmatter.date ??
        undefined
      );
    }

    if (path === "/polityka-prywatnosci/") {
      const page = this.privacyPage.load();
      return page.frontmatter.date ?? undefined;
    }

    if (path === "/regulamin/") {
      const page = this.termsPage.load();
      return page.frontmatter.date ?? undefined;
    }

    return undefined;
  }

  private extractSlug(path: string, prefix: string): string {
    return (
      path
        .replace(prefix, "")
        .replace(/^\/|\/$/g, "")
        .split("/")
        .filter(Boolean)
        .shift() ?? ""
    );
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const generator = new SitemapGenerator();
  return generator.build();
}
