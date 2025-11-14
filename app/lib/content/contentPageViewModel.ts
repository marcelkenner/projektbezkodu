import type { Metadata } from "next";

import type { FrontmatterSEO } from "@/app/lib/frontmatter";

import { MarkdownRenderer } from "@/app/ui/MarkdownRenderer";

import type { ContentRouteEntry } from "./contentLibrary";

export class ContentPageViewModel {
  private readonly renderer: MarkdownRenderer;

  constructor(private readonly entry: ContentRouteEntry) {
    this.renderer = new MarkdownRenderer(entry.document.content);
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

  getPublishedDate(): string | undefined {
    return this.entry.document.frontmatter.date;
  }

  getBody() {
    return this.renderer.render();
  }

  getMetadata(): Metadata {
    const seo = (this.entry.document.frontmatter.seo ??
      {}) as Partial<FrontmatterSEO>;
    const description =
      seo.description ??
      this.entry.document.frontmatter.hero?.subheading ??
      this.entry.document.excerpt;

    const metadata: Metadata = {
      title: seo.title ?? this.getTitle(),
      description,
      alternates: {
        canonical: seo.canonical ?? this.entry.path,
      },
      openGraph: {
        title: seo.title ?? this.getTitle(),
        description,
        url: this.entry.path,
      },
    };

    return metadata;
  }

  getPath(): string {
    return this.entry.path;
  }
}
