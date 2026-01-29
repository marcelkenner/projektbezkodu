import { GlossaryRepository } from "@/app/lib/content/repositories";
import type { SitemapLink } from "@/app/lib/navigation/SitemapComposer";
import type { SitemapLinkProvider } from "@/app/lib/seo/SitemapGenerator";

export class SitemapGlossaryLinkProvider implements SitemapLinkProvider {
  constructor(
    private readonly repository: GlossaryRepository = new GlossaryRepository(),
  ) {}

  buildLinks(): SitemapLink[] {
    return this.repository.listSummaries().map((entry) => ({
      label: entry.title ?? entry.slug ?? entry.path ?? "/glossary/",
      href: entry.path ?? `/glossary/${entry.slug}/`,
    }));
  }
}
