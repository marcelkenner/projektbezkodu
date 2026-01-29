import type { SitemapLink } from "@/app/lib/navigation/SitemapComposer";
import type { SitemapLinkProvider } from "@/app/lib/seo/SitemapGenerator";
import { AppRouteFileIndex } from "@/app/lib/seo/AppRouteFileIndex";
import { AppRoutePathResolver } from "@/app/lib/seo/AppRoutePathResolver";

export class SitemapStaticRouteProvider implements SitemapLinkProvider {
  constructor(
    private readonly fileIndex: AppRouteFileIndex = new AppRouteFileIndex(),
    private readonly pathResolver: AppRoutePathResolver = new AppRoutePathResolver(),
  ) {}

  buildLinks(): SitemapLink[] {
    return this.fileIndex
      .listPageFiles()
      .map((filePath) => this.pathResolver.resolve(filePath))
      .filter((route): route is string => Boolean(route))
      .map((route) => ({
        label: route === "/" ? "Strona główna" : route,
        href: route,
      }));
  }
}
