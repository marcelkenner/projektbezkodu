import fs from "fs";
import path from "path";

import { readMarkdownFile } from "@/app/lib/frontmatter";
import { articleTaxonomyCatalog } from "@/app/lib/content/articleTaxonomy";
import { ArticleRepository, type ContentSummary } from "@/app/lib/content/repositories";

export interface ArticleHubDescriptor {
  segments: string[];
  label: string;
  description?: string;
  href: string;
}

export interface ArticleHubPayload {
  hub: ArticleHubDescriptor;
  subcategories: ArticleHubDescriptor[];
  articles: ContentSummary[];
}

const DEFAULT_BASE_PATH = path.join(process.cwd(), "content", "artykuly");

const SLUG_ALIASES: Record<string, string> = {
  cms: "cms-bez-kodu",
};

export class ArticleHubManager {
  constructor(
    private readonly repository = new ArticleRepository(),
    private readonly basePath = DEFAULT_BASE_PATH,
  ) {}

  listHubs(maxDepth = 2): ArticleHubDescriptor[] {
    return this.listHubDescriptors(maxDepth);
  }

  resolveSegments(segments: string[]): string[] {
    if (!segments.length) {
      return [];
    }
    const [first, ...rest] = segments;
    const resolvedFirst = SLUG_ALIASES[first] ?? first;
    return [resolvedFirst, ...rest];
  }

  listHubParams(maxDepth = 2): Array<{ segments: string[] }> {
    return this.listHubDescriptors(maxDepth).map((hub) => ({
      segments: hub.segments,
    }));
  }

  getHub(segments: string[]): ArticleHubPayload | null {
    const resolvedSegments = this.resolveSegments(segments);
    const descriptor = this.getHubDescriptor(resolvedSegments);
    if (!descriptor) {
      return null;
    }
    const subcategories = this.listChildHubs(resolvedSegments);
    const articles = this.listArticles(descriptor.href);
    return { hub: descriptor, subcategories, articles };
  }

  findArticleByPath(pathname: string): ContentSummary | null {
    const normalized = this.normalizeHref(pathname);
    if (!normalized) {
      return null;
    }
    const summaries = this.repository.listSummaries();
    return summaries.find((summary) => summary.path === normalized) ?? null;
  }

  private listHubDescriptors(maxDepth: number): ArticleHubDescriptor[] {
    if (!fs.existsSync(this.basePath)) {
      return [];
    }
    return this.collectHubs(this.basePath, [], maxDepth);
  }

  private collectHubs(
    currentPath: string,
    currentSegments: string[],
    maxDepth: number,
  ): ArticleHubDescriptor[] {
    if (currentSegments.length >= maxDepth) {
      return [];
    }
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory() && this.isBrowsableDirectory(entry.name))
      .flatMap((entry) => {
        const nextSegments = [...currentSegments, entry.name];
        const nextPath = path.join(currentPath, entry.name);
        const descriptor = this.getHubDescriptor(nextSegments);
        const nested = this.collectHubs(nextPath, nextSegments, maxDepth);
        return descriptor ? [descriptor, ...nested] : nested;
      });
  }

  private listChildHubs(parentSegments: string[]): ArticleHubDescriptor[] {
    const directory = path.join(this.basePath, ...parentSegments);
    if (!fs.existsSync(directory)) {
      return [];
    }
    const entries = fs.readdirSync(directory, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory() && this.isBrowsableDirectory(entry.name))
      .map((entry) => this.getHubDescriptor([...parentSegments, entry.name]))
      .filter((hub): hub is ArticleHubDescriptor => Boolean(hub));
  }

  private getHubDescriptor(segments: string[]): ArticleHubDescriptor | null {
    const directory = path.join(this.basePath, ...segments);
    const indexPath = path.join(directory, "index.md");
    if (!fs.existsSync(indexPath)) {
      return null;
    }
    const relativeIndexPath = path.relative(process.cwd(), indexPath);
    const { frontmatter, content } = readMarkdownFile(relativeIndexPath);
    const template = frontmatter.template;
    if (template === "article" || template === "legal") {
      return null;
    }

    const href = this.normalizeHref(`/artykuly/${segments.join("/")}/`);
    const titleFromCategory =
      segments.length === 1 ? articleTaxonomyCatalog.getCategory(segments[0]) : undefined;
    const labelFromIndex = frontmatter.hero?.heading ?? frontmatter.title;
    const label =
      labelFromIndex ??
      titleFromCategory?.label ??
      this.humanize(segments.at(-1) ?? "Artykuły");
    const description =
      frontmatter.hero?.subheading ??
      titleFromCategory?.description ??
      this.createExcerpt(content);

    return {
      segments,
      label,
      description,
      href,
    };
  }

  private listArticles(prefixHref: string): ContentSummary[] {
    const prefix = this.normalizeHref(prefixHref);
    if (!prefix) {
      return [];
    }
    return this.repository
      .listSummaries()
      .filter((summary) => summary.path.startsWith(prefix) && summary.path !== prefix)
      .sort((a, b) => {
        const dateA = a.date ? Date.parse(a.date) : 0;
        const dateB = b.date ? Date.parse(b.date) : 0;
        if (dateA === dateB) {
          return a.title.localeCompare(b.title, "pl");
        }
        return dateB - dateA;
      });
  }

  private isBrowsableDirectory(name: string): boolean {
    return !name.startsWith(".") && !name.startsWith("_");
  }

  private normalizeHref(value: string): string {
    const trimmed = value.trim();
    if (!trimmed) {
      return "";
    }
    const withoutDomain = trimmed.replace(/^https?:\/\/[^/]+/i, "");
    const withLeading = withoutDomain.startsWith("/")
      ? withoutDomain
      : `/${withoutDomain}`;
    return withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
  }

  private humanize(value: string): string {
    return value
      .split("-")
      .map((part) =>
        part ? `${part.charAt(0).toUpperCase()}${part.slice(1)}` : "",
      )
      .filter(Boolean)
      .join(" ");
  }

  private createExcerpt(content: string, limit = 140): string | undefined {
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
      return undefined;
    }

    return firstParagraph.length > limit
      ? `${firstParagraph.slice(0, limit).trim()}…`
      : firstParagraph;
  }
}
