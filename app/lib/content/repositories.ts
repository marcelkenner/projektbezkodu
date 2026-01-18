import fs from "fs";
import path from "path";
import type {
  Frontmatter,
  ContentEntry,
  FrontmatterTaxonomy,
} from "../frontmatter";
import { readMarkdownFile } from "../frontmatter";
import {
  ContentLibrary,
  type ContentRouteEntry,
} from "@/app/lib/content/contentLibrary";

export interface MarkdownDocument extends ContentEntry {
  slug: string;
  excerpt: string;
  sourcePath: string;
}

export interface ContentSummary {
  slug: string;
  title: string;
  path: string;
  description?: string;
  hero?: Frontmatter["hero"];
  meta?: Frontmatter["meta"];
  taxonomy?: FrontmatterTaxonomy;
  draft: boolean;
  date?: string;
}

interface MarkdownRepositoryOptions {
  excludedDirectories?: string[];
}

abstract class MarkdownRepository {
  private readonly absoluteBasePath: string;
  private readonly excludedDirectories: Set<string>;

  protected constructor(
    private readonly relativeBasePath: string,
    options: MarkdownRepositoryOptions = {},
  ) {
    this.absoluteBasePath = path.join(process.cwd(), relativeBasePath);
    this.excludedDirectories = new Set(options.excludedDirectories ?? []);
  }

  listSummaries(): ContentSummary[] {
    const documents = this.getVisibleDocuments();
    return documents.map((document) => this.createSummary(document));
  }

  listSlugs(): string[] {
    return this.getVisibleDocuments()
      .map((document) => document.slug)
      .filter(Boolean);
  }

  findBySlug(slug: string): MarkdownDocument | undefined {
    return this.getVisibleDocuments().find(
      (document) => document.slug === slug,
    );
  }

  protected getVisibleDocuments(): MarkdownDocument[] {
    const documents = this.loadDocuments();
    const published = documents.filter(
      (document) => !document.frontmatter.draft,
    );
    return published.length ? published : documents;
  }

  protected createSummary(document: MarkdownDocument): ContentSummary {
    const { frontmatter, excerpt } = document;
    return {
      slug: document.slug,
      title: frontmatter.title,
      path: frontmatter.path,
      description: frontmatter.hero?.subheading ?? excerpt,
      hero: frontmatter.hero,
      meta: frontmatter.meta,
      taxonomy: frontmatter.taxonomy,
      draft: Boolean(frontmatter.draft),
      date: frontmatter.date,
    };
  }

  private loadDocuments(): MarkdownDocument[] {
    return this.collectEntryPaths().map((entryPath) =>
      this.readDocument(entryPath),
    );
  }

  private collectEntryPaths(): string[] {
    if (!fs.existsSync(this.absoluteBasePath)) {
      return [];
    }
    return this.collectFromDirectory(this.absoluteBasePath);
  }

  private collectFromDirectory(currentPath: string): string[] {
    const resolved: string[] = [];
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    entries.forEach((entry) => {
      const entryPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        if (this.shouldExcludeDirectory(entry.name)) {
          return;
        }

        const indexPath = path.join(entryPath, "index.md");
        if (fs.existsSync(indexPath)) {
          resolved.push(this.toRelativePath(indexPath));
        }

        resolved.push(...this.collectFromDirectory(entryPath));
        return;
      }

      if (
        entry.isFile() &&
        entry.name.endsWith(".md") &&
        entry.name !== "index.md" &&
        entry.name.toLowerCase() !== "agents.md"
      ) {
        resolved.push(this.toRelativePath(entryPath));
      }
    });

    return resolved;
  }

  private shouldExcludeDirectory(name: string): boolean {
    if (name.startsWith(".")) {
      return true;
    }
    return this.excludedDirectories.has(name);
  }

  private readDocument(relativePath: string): MarkdownDocument {
    const { frontmatter, content } = readMarkdownFile(relativePath);
    const slug = frontmatter.slug ?? this.deriveSlug(relativePath);
    return {
      frontmatter,
      content,
      slug,
      excerpt: this.createExcerpt(content),
      sourcePath: relativePath,
    };
  }

  private deriveSlug(relativePath: string): string {
    const parsed = path.parse(relativePath);
    if (parsed.name === "index") {
      return path.basename(parsed.dir);
    }
    return parsed.name;
  }

  private createExcerpt(content: string, limit = 180): string {
    const firstParagraph = content
      .split(/\r?\n\s*\r?\n/)
      .map((paragraph) =>
        paragraph
          .replace(/[#>*`]/g, "")
          .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
          .trim(),
      )
      .filter(Boolean)
      .shift();

    if (!firstParagraph) {
      return "";
    }

    return firstParagraph.length > limit
      ? `${firstParagraph.slice(0, limit).trim()}…`
      : firstParagraph;
  }

  private toRelativePath(absolutePath: string): string {
    return path.relative(process.cwd(), absolutePath);
  }
}

interface ArticleEntry {
  route: ContentRouteEntry;
  summary: ContentSummary;
}

export class ArticleRepository {
  private readonly library: ContentLibrary;
  private cache: ArticleEntry[] | null = null;

  constructor(library = new ContentLibrary()) {
    this.library = library;
  }

  listSummaries(): ContentSummary[] {
    return this.getEntries().map((entry) => entry.summary);
  }

  listSlugs(): string[] {
    return this.getEntries().map((entry) => entry.route.document.slug);
  }

  getArticle(slug: string): MarkdownDocument | undefined {
    return this.getEntries().find((entry) => entry.route.document.slug === slug)
      ?.route.document;
  }

  getRelatedArticles(slug: string, limit = 3): ContentSummary[] {
    const target = this.getEntries().find(
      (entry) => entry.route.document.slug === slug,
    );
    if (!target) {
      return [];
    }

    const categories = new Set(
      target.route.document.frontmatter.taxonomy?.categories ?? [],
    );
    const tags = new Set(
      target.route.document.frontmatter.taxonomy?.tags ?? [],
    );

    const related = this.getEntries()
      .filter((entry) => entry.route.document.slug !== slug)
      .map((entry) => {
        const summary = entry.summary;
        const summaryCategories = summary.taxonomy?.categories ?? [];
        const summaryTags = summary.taxonomy?.tags ?? [];

        let score = 0;

        summaryCategories.forEach((category) => {
          if (categories.has(category)) {
            score += 3;
          }
        });

        summaryTags.forEach((tag) => {
          if (tags.has(tag)) {
            score += 1;
          }
        });

        return { summary, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return this.compareByDate(a.summary, b.summary);
      })
      .slice(0, limit)
      .map(({ summary }) => summary);

    return related;
  }

  refresh(): void {
    this.cache = null;
    this.library.refresh();
  }

  private getEntries(): ArticleEntry[] {
    if (this.cache) {
      return this.cache;
    }

    const entries = this.library
      .listRoutes()
      .filter((route) => this.isArticleRoute(route))
      .map((route) => ({
        route,
        summary: this.createSummary(route),
      }))
      .sort((a, b) => a.summary.title.localeCompare(b.summary.title, "pl"));

    this.cache = entries;
    return entries;
  }

  private isArticleRoute(route: ContentRouteEntry): boolean {
    if (!route.path.startsWith("/artykuly/")) {
      return false;
    }
    const { frontmatter } = route.document;
    if (frontmatter.draft) {
      return false;
    }
    if (frontmatter.template === "legal") {
      return false;
    }
    return !this.isHubType(frontmatter.type);
  }

  private isHubType(type: unknown): boolean {
    if (typeof type !== "string") {
      return false;
    }
    return type.trim().toLowerCase() === "hub";
  }

  private createSummary(route: ContentRouteEntry): ContentSummary {
    const { document } = route;
    const { frontmatter, excerpt, slug } = document;
    return {
      slug,
      title: frontmatter.title,
      path: frontmatter.path ?? route.path,
      description: frontmatter.hero?.subheading ?? excerpt,
      hero: frontmatter.hero,
      meta: frontmatter.meta,
      taxonomy: frontmatter.taxonomy,
      draft: Boolean(frontmatter.draft),
      date: frontmatter.date,
    };
  }

  private compareByDate(a: ContentSummary, b: ContentSummary): number {
    const dateA = a.date ? Date.parse(a.date) : 0;
    const dateB = b.date ? Date.parse(b.date) : 0;

    if (dateA === dateB) {
      return a.title.localeCompare(b.title, "pl");
    }

    return dateB - dateA;
  }
}

export class ComparisonRepository extends MarkdownRepository {
  constructor() {
    super("content/porownania");
  }

  override listSummaries(): ContentSummary[] {
    return super
      .listSummaries()
      .sort((a, b) => a.title.localeCompare(b.title, "pl"));
  }

  getComparison(slug: string): MarkdownDocument | undefined {
    return this.findBySlug(slug);
  }
}

export class TutorialRepository extends MarkdownRepository {
  constructor() {
    super("content/poradniki");
  }

  override listSummaries(): ContentSummary[] {
    return super
      .listSummaries()
      .sort((a, b) => a.title.localeCompare(b.title, "pl"));
  }

  getTutorial(slug: string): MarkdownDocument | undefined {
    return this.findBySlug(slug);
  }
}

export class GlossaryRepository extends MarkdownRepository {
  constructor() {
    super("content/glossary");
  }

  override listSummaries(): ContentSummary[] {
    return super
      .listSummaries()
      .sort((a, b) => a.title.localeCompare(b.title, "pl"));
  }

  getTerm(slug: string): MarkdownDocument | undefined {
    return this.findBySlug(slug);
  }
}

export class ResourceRepository extends MarkdownRepository {
  constructor() {
    super("content/zasoby");
  }

  override listSummaries(): ContentSummary[] {
    return super
      .listSummaries()
      .sort((a, b) => a.title.localeCompare(b.title, "pl"));
  }

  getResource(slug: string): MarkdownDocument | undefined {
    return this.findBySlug(slug);
  }
}

interface ContentRepositoryOptions {
  excludedDirectories?: string[];
}

export class ContentRepository extends MarkdownRepository {
  constructor(options: ContentRepositoryOptions = {}) {
    super("content", {
      excludedDirectories: options.excludedDirectories,
    });
  }

  listDocuments(): MarkdownDocument[] {
    return this.getVisibleDocuments();
  }
}

export class CaseStudyRepository extends MarkdownRepository {
  constructor() {
    super("content/przypadki-uzycia");
  }

  override listSummaries(): ContentSummary[] {
    return super
      .listSummaries()
      .sort((a, b) => a.title.localeCompare(b.title, "pl"));
  }

  getCaseStudy(slug: string): MarkdownDocument | undefined {
    return this.findBySlug(slug);
  }
}
