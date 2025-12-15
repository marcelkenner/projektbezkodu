import type { ReactNode } from "react";
import type { Root } from "mdast";
import { TocNav } from "./toc";
import type {
  MarkdownHeading,
  MarkdownHeadingLevel,
  MarkdownRendererOptions,
} from "./types";
import { MarkdownAstParser } from "./MarkdownAstParser";
import { MarkdownHeadingIndex } from "./MarkdownHeadingIndex";
import { MarkdownBlockNodeRenderer } from "./MarkdownBlockNodeRenderer";

export class MarkdownRenderer {
  private readonly tree: Root;
  private readonly headingIndex: MarkdownHeadingIndex;
  private readonly nodeRenderer: MarkdownBlockNodeRenderer;

  constructor(
    source: string,
    private readonly options: MarkdownRendererOptions = {},
  ) {
    const headingLevelsForToc = (this.options.headingLevelsForToc ??
      [2, 3]) as MarkdownHeadingLevel[];
    this.tree = MarkdownAstParser.parse(source);
    this.headingIndex = new MarkdownHeadingIndex(this.tree, headingLevelsForToc);
    this.nodeRenderer = new MarkdownBlockNodeRenderer(
      this.headingIndex,
      this.options,
    );
  }

  render(): ReactNode[] {
    return this.nodeRenderer.render(this.tree.children, "block");
  }

  renderToc(): ReactNode {
    return <TocNav headings={this.headingIndex.getHeadings()} />;
  }

  getHeadings(): MarkdownHeading[] {
    return this.headingIndex.getHeadings();
  }
}
