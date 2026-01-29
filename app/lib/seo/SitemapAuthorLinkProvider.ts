import { AuthorDirectory } from "@/app/lib/content/authorDirectory";
import type { SitemapLink } from "@/app/lib/navigation/SitemapComposer";
import type { SitemapLinkProvider } from "@/app/lib/seo/SitemapGenerator";

export class SitemapAuthorLinkProvider implements SitemapLinkProvider {
  constructor(
    private readonly directory: AuthorDirectory = new AuthorDirectory(),
  ) {}

  buildLinks(): SitemapLink[] {
    return this.directory.listProfiles().map((author) => ({
      label: author.name ?? author.slug,
      href: `/autor/${author.slug}/`,
    }));
  }
}
