import Link from "next/link";
import { Fragment } from "react";
import type { JSX } from "react";
import { TextNormalizer } from "@/app/lib/text/TextNormalizer";

type BlockType =
  | "heading2"
  | "heading3"
  | "paragraph"
  | "unordered-list"
  | "ordered-list"
  | "blockquote";

interface MarkdownBlock {
  type: BlockType;
  lines: string[];
  headingId?: string;
  headingText?: string;
}

export interface MarkdownHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

export class MarkdownRenderer {
  private readonly blocks: MarkdownBlock[];
  private readonly headings: MarkdownHeading[];

  constructor(private readonly source: string) {
    this.blocks = this.parseBlocks();
    this.headings = this.blocks
      .filter((block) => Boolean(block.headingId) && Boolean(block.headingText))
      .map((block) => ({
        id: block.headingId as string,
        text: block.headingText as string,
        level: block.type === "heading3" ? 3 : 2,
      }));
  }

  render(): JSX.Element[] {
    return this.blocks.map((block, index) => this.renderBlock(block, index));
  }

  getHeadings(): MarkdownHeading[] {
    return this.headings;
  }

  private parseBlocks(): MarkdownBlock[] {
    const slugCounts = new Map<string, number>();
    return this.source
      .split(/\r?\n\s*\r?\n/)
      .map((block) => block.trim())
      .filter(Boolean)
      .map((block) => this.parseBlock(block, slugCounts));
  }

  private parseBlock(
    block: string,
    slugCounts: Map<string, number>,
  ): MarkdownBlock {
    if (block.startsWith("### ")) {
      const text = block.replace(/^###\s+/, "");
      return this.createHeadingBlock(text, "heading3", slugCounts);
    }

    if (block.startsWith("## ")) {
      const text = block.replace(/^##\s+/, "");
      return this.createHeadingBlock(text, "heading2", slugCounts);
    }

    const listLines = block.split(/\r?\n/);
    if (listLines.every((line) => /^-\s+/.test(line))) {
      return {
        type: "unordered-list",
        lines: listLines.map((line) => line.replace(/^-\s+/, "")),
      };
    }

    if (listLines.every((line) => /^\d+\.\s+/.test(line))) {
      return {
        type: "ordered-list",
        lines: listLines.map((line) => line.replace(/^\d+\.\s+/, "")),
      };
    }

    if (block.startsWith(">")) {
      return {
        type: "blockquote",
        lines: block.split(/\r?\n/).map((line) => line.replace(/^>\s?/, "")),
      };
    }

    return { type: "paragraph", lines: [block] };
  }

  private createHeadingBlock(
    text: string,
    type: "heading2" | "heading3",
    slugCounts: Map<string, number>,
  ): MarkdownBlock {
    const baseSlug = TextNormalizer.slugify(text);
    const currentCount = slugCounts.get(baseSlug) ?? 0;
    const nextCount = currentCount + 1;
    slugCounts.set(baseSlug, nextCount);

    const id = currentCount === 0 ? baseSlug : `${baseSlug}-${currentCount}`;

    return {
      type,
      lines: [text],
      headingId: id,
      headingText: text,
    };
  }

  private renderBlock(block: MarkdownBlock, key: number): JSX.Element {
    switch (block.type) {
      case "heading2":
        return (
          <h2 key={`h2-${key}`} id={block.headingId}>
            {this.renderInline(block.lines[0], key)}
          </h2>
        );
      case "heading3":
        return (
          <h3 key={`h3-${key}`} id={block.headingId}>
            {this.renderInline(block.lines[0], key)}
          </h3>
        );
      case "unordered-list":
        return (
          <ul key={`ul-${key}`} className="pbk-stack pbk-stack--tight">
            {block.lines.map((line, index) => (
              <li key={`ul-${key}-${index}`}>
                {this.renderInline(line, index)}
              </li>
            ))}
          </ul>
        );
      case "ordered-list":
        return (
          <ol key={`ol-${key}`} className="pbk-stack pbk-stack--tight">
            {block.lines.map((line, index) => (
              <li key={`ol-${key}-${index}`}>
                {this.renderInline(line, index)}
              </li>
            ))}
          </ol>
        );
      case "blockquote":
        return (
          <blockquote key={`quote-${key}`} className="pbk-card">
            {block.lines.map((line, index) => (
              <p key={`quote-${key}-${index}`}>
                {this.renderInline(line, index)}
              </p>
            ))}
          </blockquote>
        );
      default:
        return <p key={`p-${key}`}>{this.renderInline(block.lines[0], key)}</p>;
    }
  }

  private renderInline(text: string, key: number): (JSX.Element | string)[] {
    const tokens = text.split(
      /(\*\*[^*]+\*\*|_[^_]+_|`[^`]+`|\[[^\]]+\]\([^)]+\))/g,
    );
    return tokens.filter(Boolean).map((token, index) => {
      if (token.startsWith("**") && token.endsWith("**")) {
        return (
          <strong key={`strong-${key}-${index}`}>{token.slice(2, -2)}</strong>
        );
      }

      if (token.startsWith("_") && token.endsWith("_")) {
        return <em key={`em-${key}-${index}`}>{token.slice(1, -1)}</em>;
      }

      if (token.startsWith("`") && token.endsWith("`")) {
        return <code key={`code-${key}-${index}`}>{token.slice(1, -1)}</code>;
      }

      if (
        token.startsWith("[") &&
        token.includes("](") &&
        token.endsWith(")")
      ) {
        const match = token.match(/^\[(.+?)\]\((.+?)\)$/);
        if (match) {
          const [, label, href] = match;
          return (
            <Link key={`link-${key}-${index}`} href={href}>
              {label}
            </Link>
          );
        }
      }

      return <Fragment key={`text-${key}-${index}`}>{token}</Fragment>;
    });
  }
}
