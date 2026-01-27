export class SitemapRedirectCoordinator {
  private readonly sitemapXmlPath = "/sitemap.xml";

  resolveRedirectPath(): string {
    return this.sitemapXmlPath;
  }
}
