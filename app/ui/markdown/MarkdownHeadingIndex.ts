import { visit } from "unist-util-visit";
import type { Content, Heading, PhrasingContent, Root } from "mdast";
import { TextNormalizer } from "@/app/lib/text/TextNormalizer";
import type { MarkdownHeading, MarkdownHeadingLevel } from "./types";

class MarkdownTextExtractor {
  extract(node: Content | PhrasingContent): string {
    if ("value" in node && typeof node.value === "string") {
      return node.value;
    }

    if ("children" in node && Array.isArray(node.children)) {
      return node.children.map((child) => this.extract(child)).join(" ");
    }

    return "";
  }
}

class MarkdownSlugger {
  private readonly slugCounts = new Map<string, number>();

  create(text: string): string {
    const base = TextNormalizer.slugify(text);
    const current = this.slugCounts.get(base) ?? 0;
    const next = current + 1;
    this.slugCounts.set(base, next);
    return current === 0 ? base : `${base}-${current}`;
  }
}

export class MarkdownHeadingIndex {
  private readonly headings: MarkdownHeading[] = [];
  private readonly headingIdMap = new WeakMap<Heading, string>();
  private readonly headingLevels: Set<MarkdownHeadingLevel>;
  private readonly textExtractor = new MarkdownTextExtractor();
  private readonly slugger = new MarkdownSlugger();

  constructor(
    private readonly tree: Root,
    headingLevelsForToc: MarkdownHeadingLevel[] = [2, 3],
  ) {
    this.headingLevels = new Set(headingLevelsForToc);
    this.collect();
  }

  getHeadings(): MarkdownHeading[] {
    return [...this.headings];
  }

  getHeadingId(node: Heading): string | undefined {
    const existing = this.headingIdMap.get(node);
    if (existing) {
      return existing;
    }

    const text = this.textExtractor.extract(node);
    if (!text) {
      return undefined;
    }

    const id = this.slugger.create(text);
    this.headingIdMap.set(node, id);
    return id;
  }

  private collect(): void {
    visit(this.tree, "heading", (node: Heading) => {
      if (!this.headingLevels.has(node.depth as MarkdownHeadingLevel)) {
        return;
      }

      const text = this.textExtractor.extract(node).trim();
      if (!text) {
        return;
      }

      const id = this.slugger.create(text);
      this.headingIdMap.set(node, id);
      this.headings.push({
        id,
        text,
        level: node.depth as MarkdownHeadingLevel,
      });
    });
  }
}
