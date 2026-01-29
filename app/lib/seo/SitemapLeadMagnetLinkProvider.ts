import { LeadMagnetCatalog } from "@/app/lib/content/leadMagnetCatalog";
import type { SitemapLink } from "@/app/lib/navigation/SitemapComposer";
import type { SitemapLinkProvider } from "@/app/lib/seo/SitemapGenerator";

export class SitemapLeadMagnetLinkProvider implements SitemapLinkProvider {
  constructor(
    private readonly catalog: LeadMagnetCatalog = new LeadMagnetCatalog(),
  ) {}

  buildLinks(): SitemapLink[] {
    return this.catalog.listSlugs().flatMap((slug) => {
      const entry = this.catalog.get(slug);
      const label = entry?.hero.title ?? slug;
      const links: SitemapLink[] = [
        { label, href: `/do-pobrania/${slug}/` },
      ];
      if (entry?.thankYou) {
        links.push({
          label: entry.thankYou.hero?.title ?? `${label} – Dziekujemy`,
          href: `/do-pobrania/dziekujemy/${slug}/`,
        });
      }
      return links;
    });
  }
}
