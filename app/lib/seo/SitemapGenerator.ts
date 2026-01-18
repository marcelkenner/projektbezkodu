import type { MetadataRoute } from "next";

import { SitemapComposer, type SitemapLink } from "@/app/lib/navigation/SitemapComposer";
import type { SiteUrlFactory } from "@/app/lib/url/SiteUrlFactory";
import { defaultSiteUrlFactory } from "@/app/lib/url/SiteUrlFactory";

import { SitemapLastModifiedIndex } from "./SitemapLastModifiedIndex";
import { SitemapPathNormalizer } from "./SitemapPathNormalizer";

export interface SitemapLinkProvider {
  buildLinks(): SitemapLink[];
}

export class SitemapGenerator {
  private readonly pathNormalizer = new SitemapPathNormalizer();

  constructor(
    private readonly linkProvider: SitemapLinkProvider = new SitemapComposer(),
    private readonly urlFactory: SiteUrlFactory = defaultSiteUrlFactory,
    private readonly lastModifiedIndex: SitemapLastModifiedIndex = new SitemapLastModifiedIndex(),
  ) {}

  build(): MetadataRoute.Sitemap {
    this.lastModifiedIndex.build();
    const origin = new URL(this.urlFactory.build("/")).origin;

    return this.linkProvider
      .buildLinks()
      .filter((link) => this.shouldInclude(link, origin))
      .map((link) => this.toSitemapEntry(link));
  }

  private shouldInclude(link: SitemapLink, origin: string): boolean {
    if (!link?.href) {
      return false;
    }
    if (!this.pathNormalizer.isAbsoluteUrl(link.href)) {
      return true;
    }
    try {
      return new URL(link.href).origin === origin;
    } catch {
      return false;
    }
  }

  private toSitemapEntry(link: SitemapLink): MetadataRoute.Sitemap[number] {
    const normalizedPath = this.pathNormalizer.normalizeSitePath(link.href);
    const lastModified =
      normalizedPath
        ? this.lastModifiedIndex.resolve(normalizedPath) ??
          this.resolveListingLastModified(normalizedPath)
        : undefined;

    return {
      url: this.urlFactory.build(link.href),
      lastModified,
    };
  }

  private resolveListingLastModified(pathname: string): string | undefined {
    const resolved = this.pathNormalizer.normalizeSitePath(pathname);
    if (!resolved) {
      return undefined;
    }

    const listingPrefixes: Record<string, string> = {
      "/artykuly/": "/artykuly/",
      "/poradniki/": "/poradniki/",
      "/porownania/": "/porownania/",
      "/narzedzia/": "/narzedzia/",
      "/szablony/": "/szablony/",
      "/zasoby/": "/zasoby/",
      "/przypadki-uzycia/": "/przypadki-uzycia/",
      "/glossary/": "/glossary/",
    };

    const prefix = listingPrefixes[resolved];
    if (!prefix) {
      return undefined;
    }
    return this.lastModifiedIndex.resolveLatestUnderPrefix(prefix);
  }
}

