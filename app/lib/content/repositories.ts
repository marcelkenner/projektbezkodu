import fs from "fs";
import path from "path";
import type {
  Frontmatter,
  ContentEntry,
  FrontmatterTaxonomy,
} from "../frontmatter";
import { readMarkdownFile } from "../frontmatter";

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

abstract class MarkdownRepository {
  private readonly absoluteBasePath: string;

  protected constructor(private readonly relativeBasePath: string) {
    this.absoluteBasePath = path.join(process.cwd(), relativeBasePath);
  }

  listSummaries(): ContentSummary[] {
    const documents = this.listVisibleDocuments();
    return documents.map((document) => this.createSummary(document));
  }

  listSlugs(): string[] {
    return this.listVisibleDocuments()
      .map((document) => document.slug)
      .filter(Boolean);
  }

  findBySlug(slug: string): MarkdownDocument | undefined {
    return this.listVisibleDocuments().find(
      (document) => document.slug === slug,
    );
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

  private listVisibleDocuments(): MarkdownDocument[] {
    const documents = this.loadDocuments();
    const published = documents.filter(
      (document) => !document.frontmatter.draft,
    );
    return published.length ? published : documents;
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
    const entries = fs.readdirSync(this.absoluteBasePath, {
      withFileTypes: true,
    });
    const resolved: string[] = [];

    entries.forEach((entry) => {
      if (entry.isDirectory()) {
        const directoryPath = path.join(
          this.absoluteBasePath,
          entry.name,
          "index.md",
        );
        if (fs.existsSync(directoryPath)) {
          resolved.push(this.toRelativePath(directoryPath));
        }
        return;
      }
      if (
        entry.isFile() &&
        entry.name.endsWith(".md") &&
        entry.name !== "index.md"
      ) {
        resolved.push(
          this.toRelativePath(path.join(this.absoluteBasePath, entry.name)),
        );
      }
    });

    return resolved;
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

export class ArticleRepository extends MarkdownRepository {
  constructor() {
    super("content/artykuly");
  }

  override listSummaries(): ContentSummary[] {
    return super
      .listSummaries()
      .sort((a, b) => a.title.localeCompare(b.title, "pl"));
  }

  getArticle(slug: string): MarkdownDocument | undefined {
    return this.findBySlug(slug);
  }

  getRelatedArticles(slug: string, limit = 3): ContentSummary[] {
    const article = this.getArticle(slug);
    if (!article) {
      return [];
    }

    const categories = new Set(article.frontmatter.taxonomy?.categories ?? []);
    const tags = new Set(article.frontmatter.taxonomy?.tags ?? []);

    const allArticles = super
      .listSummaries()
      .filter((summary) => summary.slug !== slug);

    const related = allArticles
      .map((summary) => {
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

    if (related.length > 0) {
      return related;
    }

    return allArticles.sort((a, b) => this.compareByDate(a, b)).slice(0, limit);
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
