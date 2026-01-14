import path from "path";

import {
  ContentRepository,
  type MarkdownDocument,
} from "@/app/lib/content/repositories";
import { TextNormalizer } from "@/app/lib/text/TextNormalizer";

export interface ContentRouteEntry {
  path: string;
  segments: string[];
  document: MarkdownDocument;
}

interface ContentLibraryIndex {
  routes: ContentRouteEntry[];
  lookup: Map<string, ContentRouteEntry>;
}

interface ContentLibraryOptions {
  excludedDirectories?: string[];
}

const DEFAULT_EXCLUDED_DIRECTORIES = ["_examples", "glossary"];

export class ContentLibrary {
  private readonly repository: ContentRepository;
  private cache: ContentLibraryIndex | null = null;

  constructor(options: ContentLibraryOptions = {}) {
    const excludedDirectories =
      options.excludedDirectories ?? DEFAULT_EXCLUDED_DIRECTORIES;
    this.repository = new ContentRepository({ excludedDirectories });
  }

  listRoutes(): ContentRouteEntry[] {
    return this.getIndex().routes;
  }

  getEntry(segments: string[] | undefined): ContentRouteEntry | undefined {
    const normalizedPath = this.normalizeSegments(segments);
    if (!normalizedPath) {
      return undefined;
    }
    return this.getIndex().lookup.get(normalizedPath);
  }

  refresh(): void {
    this.cache = null;
  }

  private getIndex(): ContentLibraryIndex {
    if (this.cache) {
      return this.cache;
    }
    this.cache = this.buildIndex();
    return this.cache;
  }

  private buildIndex(): ContentLibraryIndex {
    const documents = this.repository.listDocuments();
    const routeMap = new Map<string, ContentRouteEntry>();
    const lookup = new Map<string, ContentRouteEntry>();

    documents.forEach((document) => {
      const route = this.resolveRoute(document);
      if (!route) {
        return;
      }
      if (routeMap.has(route.path)) {
        return;
      }
      const canonicalEntry: ContentRouteEntry = {
        ...route,
        document,
      };
      routeMap.set(canonicalEntry.path, canonicalEntry);
      lookup.set(canonicalEntry.path, canonicalEntry);
      route.aliases?.forEach((aliasPath) => {
        if (!lookup.has(aliasPath)) {
          lookup.set(aliasPath, canonicalEntry);
        }
      });

      const glownyAliasRoute = this.resolveGlownyAliasRoute(route, document);
      if (!glownyAliasRoute || routeMap.has(glownyAliasRoute.path)) {
        return;
      }
      const glownyAliasEntry: ContentRouteEntry = {
        ...glownyAliasRoute,
        document,
      };
      routeMap.set(glownyAliasEntry.path, glownyAliasEntry);
      lookup.set(glownyAliasEntry.path, glownyAliasEntry);
    });

    const routes = Array.from(routeMap.values()).sort((a, b) =>
      a.path.localeCompare(b.path, "pl"),
    );
    return { routes, lookup };
  }

  private resolveRoute(
    document: MarkdownDocument,
  ):
    | (Pick<ContentRouteEntry, "path" | "segments"> & {
        aliases?: string[];
      })
    | undefined {
    if (!document.frontmatter.title && !document.frontmatter.path) {
      return undefined;
    }

    const explicitPath = this.normalizeFrontmatterPath(
      document.frontmatter.path,
    );
    const derivedPath = explicitPath ?? this.derivePathFromSource(document);

    if (!derivedPath) {
      return undefined;
    }

    const titleSlugPath = this.ensureTitleSlug(derivedPath, document);
    const useTitleSlug = this.shouldUseTitleSlug(derivedPath, document);
    const canonicalPath = useTitleSlug ? titleSlugPath : derivedPath;
    const segments = canonicalPath.split("/").filter(Boolean);
    if (!segments.length) {
      return undefined;
    }

    const aliases: string[] = [];
    if (useTitleSlug) {
      if (derivedPath !== canonicalPath) {
        aliases.push(derivedPath);
      }
    } else if (titleSlugPath !== canonicalPath) {
      aliases.push(titleSlugPath);
    }
    document.frontmatter.path = canonicalPath;

    return {
      path: canonicalPath,
      segments,
      aliases: aliases.length ? aliases : undefined,
    };
  }

  private normalizeFrontmatterPath(rawPath?: string): string | undefined {
    if (!rawPath) {
      return undefined;
    }
    const trimmed = rawPath.trim();
    if (!trimmed) {
      return undefined;
    }
    const withoutDomain = trimmed.replace(/^https?:\/\/[^/]+/i, "");
    return this.ensureWrappedSlashes(withoutDomain);
  }

  private derivePathFromSource(document: MarkdownDocument): string | undefined {
    const normalized = document.sourcePath.replace(/\\/g, "/");
    if (!normalized.startsWith("content/")) {
      return undefined;
    }
    const relativePath = normalized.replace(/^content\//, "");
    if (!relativePath) {
      return undefined;
    }

    const parsed = path.parse(relativePath);
    const segments = parsed.dir.split("/").filter(Boolean);

    if (parsed.name === "index" && segments.at(-1) === "glowny") {
      segments.pop();
    }

    if (parsed.name !== "index") {
      segments.push(parsed.name);
    }

    if (!segments.length) {
      return undefined;
    }

    return this.ensureWrappedSlashes(segments.join("/"));
  }

  private resolveGlownyAliasRoute(
    route: Pick<ContentRouteEntry, "path" | "segments">,
    document: MarkdownDocument,
  ): Pick<ContentRouteEntry, "path" | "segments"> | undefined {
    if (!this.isGlownyIndexDocument(document)) {
      return undefined;
    }

    if (route.segments.at(-1) === "glowny") {
      return undefined;
    }

    const segments = [...route.segments, "glowny"];
    return {
      path: this.ensureWrappedSlashes(segments.join("/")),
      segments,
    };
  }

  private isGlownyIndexDocument(document: MarkdownDocument): boolean {
    const normalized = document.sourcePath.replace(/\\/g, "/");
    if (!normalized.startsWith("content/")) {
      return false;
    }

    const relativePath = normalized.replace(/^content\//, "");
    if (!relativePath) {
      return false;
    }

    const parsed = path.parse(relativePath);
    const segments = parsed.dir.split("/").filter(Boolean);

    return parsed.name === "index" && segments.at(-1) === "glowny";
  }

  private normalizeSegments(segments?: string[]): string | undefined {
    if (!segments || !segments.length) {
      return undefined;
    }
    const filtered = segments.filter(Boolean);
    if (!filtered.length) {
      return undefined;
    }
    return `/${filtered.join("/")}/`;
  }

  private ensureWrappedSlashes(value: string): string {
    const withLeading = value.startsWith("/") ? value : `/${value}`;
    return withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
  }

  private ensureTitleSlug(
    normalizedPath: string,
    document: MarkdownDocument,
  ): string {
    const title = document.frontmatter.title;
    if (!title) {
      return normalizedPath;
    }

    const slugFromTitle = TextNormalizer.slugify(title);
    if (!slugFromTitle) {
      return normalizedPath;
    }

    const segments = normalizedPath.split("/").filter(Boolean);
    if (!segments.length) {
      return this.ensureWrappedSlashes(slugFromTitle);
    }

    if (
      segments.length === 2 &&
      segments[0] === "narzedzia" &&
      document.frontmatter.type === "tool"
    ) {
      return normalizedPath;
    }

    const nextSegments = [...segments];
    nextSegments[nextSegments.length - 1] = slugFromTitle;

    return this.ensureWrappedSlashes(nextSegments.join("/"));
  }

  private shouldUseTitleSlug(
    normalizedPath: string,
    document: MarkdownDocument,
  ): boolean {
    if (document.frontmatter.template !== "article") {
      return true;
    }
    return !normalizedPath.startsWith("/artykuly/");
  }
}
