/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { JSX, ReactNode } from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";
import type {
  Root,
  Content,
  PhrasingContent,
  Heading,
  List,
  ListItem,
  Table,
  TableCell,
  Code,
  TableRow,
  FootnoteReference,
  FootnoteDefinition,
} from "mdast";
import { TextNormalizer } from "@/app/lib/text/TextNormalizer";
import {
  isAnchorUrl,
  isExternalUrl,
  isMailOrTel,
  isSafeUrl,
} from "./markdown/safety";
import { TocNav } from "./markdown/toc";
import type {
  Align,
  MarkdownHeading,
  MarkdownHeadingLevel,
  MarkdownRendererOptions,
} from "./markdown/types";
export class MarkdownRenderer {
  private readonly tree: Root;
  private readonly headings: MarkdownHeading[];
  private readonly headingIdMap = new WeakMap<Heading, string>();
  private readonly slugCounts = new Map<string, number>();
  private readonly headingLevels: Set<MarkdownHeadingLevel>;
  constructor(
    private readonly source: string,
    private readonly options: MarkdownRendererOptions = {},
  ) {
    this.headingLevels = new Set(
      (this.options.headingLevelsForToc ?? [2, 3]) as MarkdownHeadingLevel[],
    );
    this.tree = unified().use(remarkParse).use(remarkGfm).parse(source) as Root;
    this.headings = [];
    this.collectHeadings();
  }
  render(): ReactNode[] {
    return this.renderNodes(this.tree.children, "block");
  }
  renderToc(): ReactNode {
    return <TocNav headings={this.headings} />;
  }
  getHeadings(): MarkdownHeading[] {
    return [...this.headings];
  }
  private collectHeadings(): void {
    visit(this.tree, "heading", (node: Heading) => {
      if (!this.headingLevels.has(node.depth as MarkdownHeadingLevel)) {
        return;
      }
      const text = this.extractText(node);
      if (!text) {
        return;
      }
      const id = this.createSlug(text);
      this.headingIdMap.set(node, id);
      this.headings.push({
        id,
        text,
        level: node.depth as MarkdownHeadingLevel,
      });
    });
  }
  private renderNodes(nodes: Content[], keyPrefix: string): ReactNode[] {
    return nodes
      .map((node, index) => this.renderNode(node, `${keyPrefix}-${index}`))
      .filter((node): node is ReactNode => node !== null);
  }
  private renderNode(node: Content, key: string): ReactNode {
    switch (node.type) {
      case "heading":
        return this.renderHeading(node, key);
      case "paragraph":
        return this.renderParagraph(node, key);
      case "list":
        return this.renderList(node, key);
      case "listItem":
        return this.renderListItem(node, key);
      case "blockquote":
        return (
          <blockquote key={key} className="pbk-blockquote">
            {this.renderNodes(node.children as Content[], `${key}-blockquote`)}
          </blockquote>
        );
      case "code":
        return this.renderCodeBlock(node as Code, key);
      case "inlineCode":
        return (
          <code key={key} className="pbk-inline-code">
            {(node as { value: string }).value}
          </code>
        );
      case "break":
        return <br key={key} />;
      case "thematicBreak":
        return <hr key={key} className="pbk-divider" />;
      case "table":
        return this.renderTable(node as Table, key);
      case "tableRow":
        return this.renderTableRow(node as TableRow, key);
      case "tableCell":
        return this.renderTableCell(node as TableCell, key, false, null);
      case "footnoteReference":
        return this.renderFootnoteReference(node as FootnoteReference, key);
      case "footnoteDefinition":
        return this.renderFootnoteDefinition(node as FootnoteDefinition, key);
      case "html":
        return null;
      default:
        if ("value" in node && typeof node.value === "string") {
          return node.value;
        }
        if ("children" in node && Array.isArray(node.children)) {
          return (
            <span key={key}>
              {this.renderInlineNodes(
                node.children as PhrasingContent[],
                `${key}-span`,
              )}
            </span>
          );
        }
        return null;
    }
  }
  private renderHeading(node: Heading, key: string): ReactNode {
    const id = this.getHeadingId(node);
    const children = this.renderInlineNodes(node.children, `${key}-heading`);
    const Tag =
      `h${Math.min(Math.max(node.depth, 1), 6)}` as keyof JSX.IntrinsicElements;
    const className = `pbk-heading pbk-heading-h${Tag.replace("h", "")}`;
    return (
      <Tag key={key} id={id}>
        <span className={className}>{children}</span>
      </Tag>
    );
  }
  private renderParagraph(
    node: Extract<Content, { type: "paragraph" }>,
    key: string,
  ): ReactNode {
    const onlyImage =
      node.children.length === 1 && node.children[0].type === "image";
    if (onlyImage) {
      return this.renderImage(node.children[0], key, true);
    }
    return (
      <p key={key} className="pbk-paragraph">
        {this.renderInlineNodes(node.children, `${key}-paragraph`)}
      </p>
    );
  }
  private renderList(node: List, key: string): ReactNode {
    const Tag = (node.ordered ? "ol" : "ul") as "ol" | "ul";
    const attrs = node.ordered && node.start ? { start: node.start } : {};
    return (
      <Tag
        key={key}
        {...attrs}
        className={`pbk-list pbk-list-${
          node.ordered ? "ordered" : "unordered"
        }`}
      >
        {node.children.map((child, index) =>
          this.renderNode(child, `${key}-item-${index}`),
        )}
      </Tag>
    );
  }
  private renderListItem(node: ListItem, key: string): ReactNode {
    const isTask = typeof node.checked === "boolean";
    return (
      <li key={key} className="pbk-list__item">
        {isTask ? (
          <span className="pbk-task" aria-hidden="true">
            <input type="checkbox" checked={node.checked ?? false} readOnly />
          </span>
        ) : null}
        <div className="pbk-list__content">
          {this.renderNodes(node.children as Content[], `${key}-content`)}
        </div>
      </li>
    );
  }
  private renderCodeBlock(node: Code, key: string): ReactNode {
    const language = node.lang ? `language-${node.lang}` : undefined;
    const CustomCode = this.options.components?.CodeBlock;
    if (CustomCode) {
      return (
        <CustomCode
          key={key}
          language={node.lang ?? undefined}
          value={node.value}
        />
      );
    }
    return (
      <pre key={key} className="pbk-code-block">
        <code className={language}>{node.value}</code>
      </pre>
    );
  }
  private renderTable(node: Table, key: string): ReactNode {
    const [headRow, ...bodyRows] = node.children;
    return (
      <div key={key} className="pbk-table">
        <table>
          {headRow ? (
            <thead>
              {this.renderTableRow(headRow, `${key}-head`, true, node.align)}
            </thead>
          ) : null}
          {bodyRows.length ? (
            <tbody>
              {bodyRows.map((row, index) =>
                this.renderTableRow(
                  row,
                  `${key}-body-${index}`,
                  false,
                  node.align,
                ),
              )}
            </tbody>
          ) : null}
        </table>
      </div>
    );
  }
  private renderTableRow(
    row: TableRow,
    key: string,
    isHeader = false,
    align?: Align[] | null,
  ): ReactNode {
    return (
      <tr key={key}>
        {row.children.map((cell, index) =>
          this.renderTableCell(
            cell,
            `${key}-cell-${index}`,
            isHeader,
            align?.[index] ?? null,
          ),
        )}
      </tr>
    );
  }
  private renderTableCell(
    cell: TableCell,
    key: string,
    isHeader: boolean,
    align: Align,
  ): ReactNode {
    const Tag = isHeader ? "th" : "td";
    const style = align ? { textAlign: align } : undefined;
    return (
      <Tag key={key} style={style}>
        {this.renderInlineNodes(
          cell.children as PhrasingContent[],
          `${key}-cell`,
        )}
      </Tag>
    );
  }
  private renderImage(
    node: PhrasingContent,
    key: string,
    wrapFigure = false,
  ): ReactNode {
    if (node.type !== "image") {
      return null;
    }
    if (!isSafeUrl(node.url)) {
      return null;
    }
    const CustomImage = this.options.components?.Image;
    const imageProps = {
      src: node.url ?? "",
      alt: node.alt ?? "",
      title: node.title ?? undefined,
    };
    const imageContent = CustomImage ? (
      <CustomImage {...imageProps} />
    ) : (
      <img
        src={imageProps.src}
        alt={imageProps.alt ?? ""}
        title={imageProps.title}
        loading="lazy"
        decoding="async"
      />
    );
    if (!wrapFigure) {
      return (
        <span key={key} className="pbk-image">
          {imageContent}
        </span>
      );
    }
    return (
      <figure key={key} className="pbk-figure">
        {imageContent}
        {node.alt ? (
          <figcaption className="pbk-figure__caption">{node.alt}</figcaption>
        ) : null}
      </figure>
    );
  }
  private renderFootnoteReference(
    node: FootnoteReference,
    key: string,
  ): ReactNode {
    const id = node.identifier;
    return (
      <sup key={key} id={`fnref-${id}`}>
        <a href={`#fn-${id}`}>[{id}]</a>
      </sup>
    );
  }
  private renderFootnoteDefinition(
    node: FootnoteDefinition,
    key: string,
  ): ReactNode {
    return (
      <section key={key} id={`fn-${node.identifier}`} className="pbk-footnote">
        {this.renderNodes(node.children as Content[], `${key}-footnote`)}
        <a
          href={`#fnref-${node.identifier}`}
          aria-label="Back to content"
          className="pbk-link pbk-footnote__backlink"
        >
          ↩
        </a>
      </section>
    );
  }
  private renderInlineNodes(
    nodes: PhrasingContent[],
    keyPrefix: string,
  ): ReactNode[] {
    return nodes
      .map((child, index) =>
        this.renderInlineNode(child, `${keyPrefix}-${index}`),
      )
      .filter((node): node is ReactNode => node !== null);
  }
  private renderInlineNode(node: PhrasingContent, key: string): ReactNode {
    switch (node.type) {
      case "text":
        return node.value;
      case "strong":
        return (
          <strong key={key}>
            {this.renderInlineNodes(node.children, `${key}-strong`)}
          </strong>
        );
      case "emphasis":
        return (
          <em key={key}>
            {this.renderInlineNodes(node.children, `${key}-em`)}
          </em>
        );
      case "inlineCode":
        return <code key={key}>{node.value}</code>;
      case "link":
        return this.renderLink(node, key);
      case "delete":
        return (
          <del key={key}>
            {this.renderInlineNodes(node.children, `${key}-del`)}
          </del>
        );
      case "image":
        return this.renderImage(node, key, false);
      case "break":
        return <br key={key} />;
      case "footnoteReference":
        return this.renderFootnoteReference(node, key);
      default:
        if ("children" in node && Array.isArray(node.children)) {
          return (
            <span key={key} className="pbk-inline">
              {this.renderInlineNodes(node.children, `${key}-span`)}
            </span>
          );
        }
        if ("value" in node && typeof node.value === "string") {
          return node.value;
        }
        return null;
    }
  }
  private getHeadingId(node: Heading): string | undefined {
    const existing = this.headingIdMap.get(node);
    if (existing) {
      return existing;
    }
    const text = this.extractText(node);
    if (!text) {
      return undefined;
    }
    const id = this.createSlug(text);
    this.headingIdMap.set(node, id);
    return id;
  }
  private createSlug(text: string): string {
    const base = TextNormalizer.slugify(text);
    const current = this.slugCounts.get(base) ?? 0;
    const next = current + 1;
    this.slugCounts.set(base, next);
    return current === 0 ? base : `${base}-${current}`;
  }
  private extractText(node: Content | PhrasingContent): string {
    if ("value" in node && typeof node.value === "string") {
      return node.value;
    }
    if ("children" in node && Array.isArray(node.children)) {
      return node.children.map((child) => this.extractText(child)).join(" ");
    }
    return "";
  }
  private renderLink(
    node: Extract<PhrasingContent, { type: "link" }>,
    key: string,
  ): ReactNode {
    const href = node.url ?? "";
    const children = this.renderInlineNodes(node.children, `${key}-link`);
    if (!isSafeUrl(href)) {
      return (
        <span key={key}>
          {this.renderInlineNodes(node.children, `${key}-unsafe-link`)}
        </span>
      );
    }
    const CustomLink = this.options.components?.Link;
    if (CustomLink) {
      return (
        <span key={key} className="pbk-link">
          <CustomLink href={href}>{children}</CustomLink>
        </span>
      );
    }
    if (isAnchorUrl(href)) {
      return (
        <a key={key} href={href} className="pbk-link">
          {children}
        </a>
      );
    }
    if (isMailOrTel(href)) {
      return (
        <a key={key} href={href} className="pbk-link">
          {children}
        </a>
      );
    }
    if (isExternalUrl(href)) {
      return (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="pbk-link"
        >
          {children}
        </a>
      );
    }
    return (
      <Link key={key} href={href} className="pbk-link">
        {children}
      </Link>
    );
  }
}
export type {
  MarkdownRendererOptions,
  MarkdownRendererComponents,
  MarkdownHeading,
} from "./markdown/types";
