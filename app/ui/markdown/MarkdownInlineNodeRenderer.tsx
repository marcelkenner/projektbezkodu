/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { ReactNode } from "react";
import type { FootnoteReference, PhrasingContent } from "mdast";
import {
  isAnchorUrl,
  isExternalUrl,
  isMailOrTel,
  isSafeUrl,
} from "@/app/ui/markdown/safety";
import type { MarkdownRendererOptions } from "./types";

export class MarkdownInlineNodeRenderer {
  constructor(private readonly options: MarkdownRendererOptions) {}

  render(nodes: PhrasingContent[], keyPrefix: string): ReactNode[] {
    return nodes
      .map((child, index) => this.renderNode(child, `${keyPrefix}-${index}`))
      .filter((node): node is ReactNode => node !== null);
  }

  renderFootnoteReference(node: FootnoteReference, key: string): ReactNode {
    const id = node.identifier;
    return (
      <sup key={key} id={`fnref-${id}`}>
        <a href={`#fn-${id}`}>[{id}]</a>
      </sup>
    );
  }

  renderImage(node: PhrasingContent, key: string, wrapFigure = false): ReactNode {
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

    const caption = node.title ?? node.alt;
    return (
      <figure key={key} className="pbk-figure">
        {imageContent}
        {caption ? (
          <figcaption className="pbk-figure__caption">{caption}</figcaption>
        ) : null}
      </figure>
    );
  }

  private renderNode(node: PhrasingContent, key: string): ReactNode {
    switch (node.type) {
      case "text":
        return node.value;
      case "strong":
        return (
          <strong key={key}>{this.render(node.children, `${key}-strong`)}</strong>
        );
      case "emphasis":
        return <em key={key}>{this.render(node.children, `${key}-em`)}</em>;
      case "inlineCode":
        return <code key={key}>{node.value}</code>;
      case "link":
        return this.renderLink(node, key);
      case "delete":
        return <del key={key}>{this.render(node.children, `${key}-del`)}</del>;
      case "image":
        return this.renderImage(node, key, false);
      case "break":
        return <br key={key} />;
      case "footnoteReference":
        return this.renderFootnoteReference(node as FootnoteReference, key);
      default:
        if ("children" in node && Array.isArray(node.children)) {
          return (
            <span key={key} className="pbk-inline">
              {this.render(node.children as PhrasingContent[], `${key}-span`)}
            </span>
          );
        }
        if ("value" in node && typeof node.value === "string") {
          return node.value;
        }
        return null;
    }
  }

  private renderLink(
    node: Extract<PhrasingContent, { type: "link" }>,
    key: string,
  ): ReactNode {
    const href = node.url ?? "";
    const children = this.render(node.children, `${key}-link`);

    if (!isSafeUrl(href)) {
      return <span key={key}>{this.render(node.children, `${key}-unsafe-link`)}</span>;
    }

    const CustomLink = this.options.components?.Link;
    if (CustomLink) {
      return (
        <span key={key} className="pbk-link">
          <CustomLink href={href}>{children}</CustomLink>
        </span>
      );
    }

    if (isAnchorUrl(href) || isMailOrTel(href)) {
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

  // Note: image + footnote rendering is public so the block renderer can reuse it
  // for special cases (figure-only paragraphs and block-level footnotes).
}
