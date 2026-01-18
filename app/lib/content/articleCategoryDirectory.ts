import fs from "fs";
import path from "path";

import { readMarkdownFile } from "@/app/lib/frontmatter";

export type ArticleCategory = {
  slug: string;
  label: string;
  description?: string;
};

export class ArticleCategoryDirectory {
  private readonly basePath: string;

  constructor(basePath = path.join(process.cwd(), "content", "artykuly")) {
    this.basePath = basePath;
  }

  listCategories(): ArticleCategory[] {
    if (!fs.existsSync(this.basePath)) {
      return [];
    }

    const directories = fs
      .readdirSync(this.basePath, { withFileTypes: true })
      .filter(
        (entry) =>
          entry.isDirectory() &&
          !entry.name.startsWith(".") &&
          !entry.name.startsWith("_"),
      );

    const categories = directories
      .map((entry) => this.toCategory(entry.name))
      .filter((category): category is ArticleCategory => Boolean(category));

    return categories.sort((a, b) => a.label.localeCompare(b.label, "pl"));
  }

  private toCategory(dirName: string): ArticleCategory | null {
    const indexPath = path.join(this.basePath, dirName, "index.md");
    if (!fs.existsSync(indexPath)) {
      return null;
    }

    const relativeIndexPath = path.relative(process.cwd(), indexPath);
    let entry: ReturnType<typeof readMarkdownFile> | null = null;
    try {
      entry = readMarkdownFile(relativeIndexPath);
    } catch {
      return null;
    }
    const { frontmatter, content } = entry;
    if (frontmatter.draft) {
      return null;
    }
    if (!this.isHubType(frontmatter.type)) {
      return null;
    }

    const slug = dirName;
    const label =
      frontmatter.hero?.heading ?? frontmatter.title ?? this.humanize(slug);
    const description =
      frontmatter.hero?.subheading ?? this.createExcerpt(content);

    return { slug, label, description };
  }

  private isHubType(type: unknown): boolean {
    if (typeof type !== "string") {
      return false;
    }
    return type.trim().toLowerCase() === "hub";
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
