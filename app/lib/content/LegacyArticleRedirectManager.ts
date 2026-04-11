import { ContentLibrary } from "@/app/lib/content/contentLibrary";
import {
  listArticleCategoryAliases,
} from "@/app/lib/content/articleCategoryAliases";
import { ArticleRepository, type ContentSummary } from "@/app/lib/content/repositories";

interface ArticleSummariesProvider {
  listSummaries(): ContentSummary[];
}

interface ContentRouteProvider {
  listRoutes(): Array<{ path: string }>;
}

interface ArticlePathParts {
  canonicalPath: string;
  categorySlug: string;
}

export class LegacyArticleRedirectManager {
  private cache: Map<string, string> | null = null;

  constructor(
    private readonly repository: ArticleSummariesProvider = new ArticleRepository(),
    private readonly routeProvider: ContentRouteProvider = new ContentLibrary(),
  ) {}

  resolve(segments: string[]): string | null {
    const requestedPath = this.normalizeSegments(segments);
    if (!requestedPath) {
      return null;
    }
    return this.getIndex().get(requestedPath) ?? null;
  }

  refresh(): void {
    this.cache = null;
  }

  private getIndex(): Map<string, string> {
    if (this.cache) {
      return this.cache;
    }

    const canonicalPaths = new Set(
      this.routeProvider
        .listRoutes()
        .map((route) => this.normalizePath(route.path))
        .filter((path): path is string => Boolean(path)),
    );
    const redirects = new Map<string, string>();
    const conflicts = new Set<string>();

    this.repository.listSummaries().forEach((summary) => {
      const pathParts = this.parseArticlePath(summary);
      if (!pathParts) {
        return;
      }

      this.buildAliasCandidates(summary.slug, pathParts).forEach((aliasPath) => {
        this.claimAlias(
          redirects,
          conflicts,
          canonicalPaths,
          aliasPath,
          pathParts.canonicalPath,
        );
      });
    });

    this.cache = redirects;
    return redirects;
  }

  private parseArticlePath(summary: ContentSummary): ArticlePathParts | null {
    const canonicalPath = this.normalizePath(summary.path);
    const slug = typeof summary.slug === "string" ? summary.slug.trim() : "";
    if (!canonicalPath || !slug) {
      return null;
    }

    const segments = canonicalPath.split("/").filter(Boolean);
    if (segments.length < 3 || segments[0] !== "artykuly") {
      return null;
    }

    return {
      canonicalPath,
      categorySlug: segments[1],
    };
  }

  private buildAliasCandidates(
    slug: string,
    pathParts: ArticlePathParts,
  ): string[] {
    const normalizedSlug = slug.trim();
    if (!normalizedSlug) {
      return [];
    }

    const aliases = [
      this.normalizePath(`/${normalizedSlug}/`),
      this.normalizePath(
        `/artykuly/${pathParts.categorySlug}/${normalizedSlug}/`,
      ),
      ...listArticleCategoryAliases(pathParts.categorySlug).map((categoryAlias) =>
        this.normalizePath(`/${categoryAlias}/${normalizedSlug}/`),
      ),
    ].filter((path): path is string => Boolean(path));

    return Array.from(new Set(aliases));
  }

  private claimAlias(
    redirects: Map<string, string>,
    conflicts: Set<string>,
    canonicalPaths: Set<string>,
    aliasPath: string,
    canonicalPath: string,
  ): void {
    if (aliasPath === canonicalPath) {
      return;
    }
    if (canonicalPaths.has(aliasPath)) {
      return;
    }
    if (conflicts.has(aliasPath)) {
      return;
    }

    const existing = redirects.get(aliasPath);
    if (!existing) {
      redirects.set(aliasPath, canonicalPath);
      return;
    }

    if (existing !== canonicalPath) {
      redirects.delete(aliasPath);
      conflicts.add(aliasPath);
    }
  }

  private normalizeSegments(segments: string[]): string | null {
    const filtered = segments
      .map((segment) => segment.trim())
      .filter(Boolean);
    if (!filtered.length) {
      return null;
    }

    return this.normalizePath(`/${filtered.join("/")}/`);
  }

  private normalizePath(pathname: string | undefined): string | null {
    if (typeof pathname !== "string") {
      return null;
    }
    const trimmed = pathname.trim();
    if (!trimmed) {
      return null;
    }

    const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    return withLeadingSlash.endsWith("/")
      ? withLeadingSlash
      : `${withLeadingSlash}/`;
  }
}
