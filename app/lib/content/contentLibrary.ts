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

interface ContentLibraryOptions {
  excludedDirectories?: string[];
}

const DEFAULT_EXCLUDED_DIRECTORIES = ["_examples", "glossary"];

export class ContentLibrary {
  private readonly repository: ContentRepository;
  private cache: ContentRouteEntry[] | null = null;

  constructor(options: ContentLibraryOptions = {}) {
    const excludedDirectories =
      options.excludedDirectories ?? DEFAULT_EXCLUDED_DIRECTORIES;
    this.repository = new ContentRepository({ excludedDirectories });
  }

  listRoutes(): ContentRouteEntry[] {
    if (this.cache) {
      return this.cache;
    }
    this.cache = this.buildEntries();
    return this.cache;
  }

  getEntry(segments: string[] | undefined): ContentRouteEntry | undefined {
    const normalizedPath = this.normalizeSegments(segments);
    if (!normalizedPath) {
      return undefined;
    }
    return this.listRoutes().find((entry) => entry.path === normalizedPath);
  }

  refresh(): void {
    this.cache = null;
  }

  private buildEntries(): ContentRouteEntry[] {
    const documents = this.repository.listDocuments();
    const routeMap = new Map<string, ContentRouteEntry>();

    documents.forEach((document) => {
      const route = this.resolveRoute(document);
      if (!route) {
        return;
      }
      if (routeMap.has(route.path)) {
        return;
      }
      routeMap.set(route.path, {
        ...route,
        document,
      });

      const glownyAliasRoute = this.resolveGlownyAliasRoute(route, document);
      if (glownyAliasRoute && !routeMap.has(glownyAliasRoute.path)) {
        routeMap.set(glownyAliasRoute.path, {
          ...glownyAliasRoute,
          document,
        });
      }
    });

    return Array.from(routeMap.values()).sort((a, b) =>
      a.path.localeCompare(b.path, "pl"),
    );
  }

  private resolveRoute(
    document: MarkdownDocument,
  ): Pick<ContentRouteEntry, "path" | "segments"> | undefined {
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

    const pathWithTitleSlug = this.ensureTitleSlug(
      derivedPath,
      document,
      Boolean(explicitPath),
    );
    const segments = pathWithTitleSlug.split("/").filter(Boolean);
    if (!segments.length) {
      return undefined;
    }

    document.frontmatter.path = pathWithTitleSlug;

    return {
      path: pathWithTitleSlug,
      segments,
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
    skip = false,
  ): string {
    if (skip) {
      return normalizedPath;
    }

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

    const nextSegments = [...segments];
    nextSegments[nextSegments.length - 1] = slugFromTitle;

    return this.ensureWrappedSlashes(nextSegments.join("/"));
  }
}
