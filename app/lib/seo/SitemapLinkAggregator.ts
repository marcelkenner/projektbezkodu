import type { SitemapLink } from "@/app/lib/navigation/SitemapComposer";
import type { SitemapLinkProvider } from "@/app/lib/seo/SitemapGenerator";
import { SitemapPathNormalizer } from "@/app/lib/seo/SitemapPathNormalizer";

export class SitemapLinkAggregator implements SitemapLinkProvider {
  private readonly pathNormalizer = new SitemapPathNormalizer();

  constructor(private readonly providers: SitemapLinkProvider[]) {}

  buildLinks(): SitemapLink[] {
    const links: SitemapLink[] = [];
    const seen = new Set<string>();

    this.providers.forEach((provider) => {
      provider.buildLinks().forEach((link) => {
        const key = this.resolveKey(link.href);
        if (!key || seen.has(key)) {
          return;
        }
        seen.add(key);
        links.push(link);
      });
    });

    return links;
  }

  private resolveKey(href: string): string | null {
    if (!href) {
      return null;
    }
    const trimmed = href.trim();
    if (!trimmed) {
      return null;
    }
    if (this.pathNormalizer.isAbsoluteUrl(trimmed)) {
      try {
        const url = new URL(trimmed);
        const normalizedPath = this.pathNormalizer.normalizeSitePath(
          url.pathname,
        );
        return `${url.origin}${normalizedPath ?? url.pathname}`;
      } catch {
        return trimmed;
      }
    }
    return this.pathNormalizer.normalizeSitePath(trimmed) ?? trimmed;
  }
}
