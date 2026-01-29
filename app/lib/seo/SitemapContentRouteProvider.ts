import { ContentLibrary } from "@/app/lib/content/contentLibrary";
import type { SitemapLink } from "@/app/lib/navigation/SitemapComposer";
import type { SitemapLinkProvider } from "@/app/lib/seo/SitemapGenerator";

export class SitemapContentRouteProvider implements SitemapLinkProvider {
  constructor(private readonly library: ContentLibrary = new ContentLibrary()) {}

  buildLinks(): SitemapLink[] {
    return this.library.listRoutes().map((route) => ({
      label: route.document.frontmatter.title ?? route.path,
      href: route.path,
    }));
  }
}
