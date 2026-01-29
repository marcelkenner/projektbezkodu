import { TagDirectory } from "@/app/lib/content/tagDirectory";
import type { SitemapLink } from "@/app/lib/navigation/SitemapComposer";
import type { SitemapLinkProvider } from "@/app/lib/seo/SitemapGenerator";

export class SitemapTagLinkProvider implements SitemapLinkProvider {
  constructor(private readonly directory: TagDirectory = new TagDirectory()) {}

  buildLinks(): SitemapLink[] {
    return this.directory.list().map((tag) => ({
      label: tag.label ?? tag.slug,
      href: `/tag/${tag.slug}/`,
    }));
  }
}
