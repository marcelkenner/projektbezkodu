import { TemplateCatalog } from "@/app/lib/content/templateCatalog";
import type { SitemapLink } from "@/app/lib/navigation/SitemapComposer";
import type { SitemapLinkProvider } from "@/app/lib/seo/SitemapGenerator";

export class SitemapTemplateLinkProvider implements SitemapLinkProvider {
  constructor(
    private readonly catalog: TemplateCatalog = new TemplateCatalog(),
  ) {}

  buildLinks(): SitemapLink[] {
    return this.catalog.list().map((template) => ({
      label: template.name ?? template.slug,
      href: `/szablony/${template.slug}/`,
    }));
  }
}
