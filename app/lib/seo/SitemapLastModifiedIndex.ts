import { ContentLibrary } from "@/app/lib/content/contentLibrary";
import { GlossaryRepository } from "@/app/lib/content/repositories";

import { SitemapDateParser } from "./SitemapDateParser";
import { SitemapPathNormalizer } from "./SitemapPathNormalizer";

export class SitemapLastModifiedIndex {
  private readonly pathNormalizer = new SitemapPathNormalizer();
  private readonly dateParser = new SitemapDateParser();
  private readonly lastModifiedByPath = new Map<string, string>();

  constructor(
    private readonly contentLibrary: ContentLibrary = new ContentLibrary(),
    private readonly glossaryRepository: GlossaryRepository = new GlossaryRepository(),
  ) {}

  build(): void {
    this.lastModifiedByPath.clear();
    this.indexContentLibrary();
    this.indexGlossary();
  }

  resolve(pathname: string): string | undefined {
    const normalized = this.pathNormalizer.normalizeSitePath(pathname);
    if (!normalized) {
      return undefined;
    }
    return this.lastModifiedByPath.get(normalized);
  }

  resolveLatestUnderPrefix(prefixPath: string): string | undefined {
    const normalizedPrefix = this.pathNormalizer.normalizeSitePath(prefixPath);
    if (!normalizedPrefix) {
      return undefined;
    }
    const candidates = Array.from(this.lastModifiedByPath.entries())
      .filter(([path]) => path.startsWith(normalizedPrefix) && path !== normalizedPrefix)
      .map(([, value]) => value)
      .filter(Boolean);

    return this.pickLatest(candidates);
  }

  private indexContentLibrary(): void {
    this.contentLibrary.listRoutes().forEach((route) => {
      const frontmatter = route.document.frontmatter;
      if (frontmatter.draft === true) {
        return;
      }
      const lastModified = frontmatter.meta?.updatedAt ?? frontmatter.date ?? undefined;
      if (typeof lastModified === "string" && lastModified.trim().length) {
        this.lastModifiedByPath.set(route.path, lastModified);
      }
    });
  }

  private indexGlossary(): void {
    this.glossaryRepository.listSummaries().forEach((entry) => {
      if (!entry.path) {
        return;
      }
      const lastModified = entry.meta?.updatedAt ?? entry.date ?? undefined;
      if (typeof lastModified === "string" && lastModified.trim().length) {
        const normalized = this.pathNormalizer.normalizeSitePath(entry.path);
        if (normalized) {
          this.lastModifiedByPath.set(normalized, lastModified);
        }
      }
    });
  }

  private pickLatest(values: string[]): string | undefined {
    const dated = values
      .map((value) => ({ value, timestamp: this.dateParser.toTimestamp(value) }))
      .filter((entry): entry is { value: string; timestamp: number } => entry.timestamp !== null)
      .sort((a, b) => b.timestamp - a.timestamp)
      .shift();
    return dated?.value;
  }
}

