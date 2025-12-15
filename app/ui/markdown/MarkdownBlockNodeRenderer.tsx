import type { JSX, ReactNode } from "react";
import type {
  Code,
  Content,
  FootnoteDefinition,
  FootnoteReference,
  Heading,
  List,
  ListItem,
  PhrasingContent,
  Table,
  TableCell,
  TableRow,
} from "mdast";
import { getCopy } from "@/app/lib/copy";
import { MarkdownCallout, MarkdownCalloutParser } from "./MarkdownCallout";
import type { MarkdownHeadingIndex } from "./MarkdownHeadingIndex";
import { MarkdownInlineNodeRenderer } from "./MarkdownInlineNodeRenderer";
import type { Align, MarkdownRendererOptions } from "./types";

export class MarkdownBlockNodeRenderer {
  private readonly calloutParser = new MarkdownCalloutParser();
  private readonly inlineRenderer: MarkdownInlineNodeRenderer;

  constructor(
    private readonly headingIndex: MarkdownHeadingIndex,
    private readonly options: MarkdownRendererOptions,
  ) {
    this.inlineRenderer = new MarkdownInlineNodeRenderer(options);
  }

  render(nodes: Content[], keyPrefix: string): ReactNode[] {
    return nodes
      .map((node, index) => this.renderNode(node, `${keyPrefix}-${index}`))
      .filter((node): node is ReactNode => node !== null);
  }

  private renderNode(node: Content, key: string): ReactNode {
    switch (node.type) {
      case "heading":
        return this.renderHeading(node as Heading, key);
      case "paragraph":
        return this.renderParagraph(node as Extract<Content, { type: "paragraph" }>, key);
      case "list":
        return this.renderList(node as List, key);
      case "listItem":
        return this.renderListItem(node as ListItem, key);
      case "blockquote":
        return this.renderBlockquote(node as Extract<Content, { type: "blockquote" }>, key);
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
        return this.inlineRenderer.renderFootnoteReference(
          node as FootnoteReference,
          key,
        );
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
              {this.inlineRenderer.render(
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
    const id = this.headingIndex.getHeadingId(node);
    const children = this.inlineRenderer.render(node.children, `${key}-heading`);
    const Tag =
      `h${Math.min(Math.max(node.depth, 1), 6)}` as keyof JSX.IntrinsicElements;
    const className = `pbk-heading pbk-heading-h${Tag.replace("h", "")}`;
    return (
      <Tag key={key} id={id}>
        <span className={className}>{children}</span>
      </Tag>
    );
  }

  private renderBlockquote(
    node: Extract<Content, { type: "blockquote" }>,
    key: string,
  ): ReactNode {
    const parsed = this.calloutParser.parse(node);
    if (parsed) {
      return (
        <MarkdownCallout key={key} kind={parsed.kind}>
          {this.render(parsed.children, `${key}-callout`)}
        </MarkdownCallout>
      );
    }

    return (
      <blockquote key={key} className="pbk-blockquote">
        {this.render(node.children as Content[], `${key}-blockquote`)}
      </blockquote>
    );
  }

  private renderParagraph(
    node: Extract<Content, { type: "paragraph" }>,
    key: string,
  ): ReactNode {
    const onlyImage = node.children.length === 1 && node.children[0].type === "image";
    if (onlyImage) {
      return this.inlineRenderer.renderImage(node.children[0], key, true);
    }

    return (
      <p key={key} className="pbk-paragraph">
        {this.inlineRenderer.render(node.children, `${key}-paragraph`)}
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
        className={`pbk-list pbk-list-${node.ordered ? "ordered" : "unordered"}`}
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
          {this.render(node.children as Content[], `${key}-content`)}
        </div>
      </li>
    );
  }

  private renderCodeBlock(node: Code, key: string): ReactNode {
    const language = node.lang ? `language-${node.lang}` : undefined;
    const CustomCode = this.options.components?.CodeBlock;
    if (CustomCode) {
      return (
        <CustomCode key={key} language={node.lang ?? undefined} value={node.value} />
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
                this.renderTableRow(row, `${key}-body-${index}`, false, node.align),
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
        {this.inlineRenderer.render(
          cell.children as PhrasingContent[],
          `${key}-cell`,
        )}
      </Tag>
    );
  }

  private renderFootnoteDefinition(node: FootnoteDefinition, key: string): ReactNode {
    const copy = getCopy("global");
    const backLabel = copy.callouts?.footnoteBacklinkLabel ?? "Powrót do treści";

    return (
      <section key={key} id={`fn-${node.identifier}`} className="pbk-footnote">
        {this.render(node.children as Content[], `${key}-footnote`)}
        <a
          href={`#fnref-${node.identifier}`}
          aria-label={backLabel}
          className="pbk-link pbk-footnote__backlink"
        >
          ↩
        </a>
      </section>
    );
  }
}
