import type { ComponentType, ReactNode } from "react";

export type Align = "left" | "center" | "right" | null;
export type MarkdownHeadingLevel = 2 | 3 | 4 | 5 | 6;

export interface CodeBlockProps {
  language?: string;
  value: string;
}

export interface ImageProps {
  src: string;
  alt?: string;
  title?: string;
}

export interface LinkProps {
  href: string;
  children: ReactNode;
}

export type MarkdownRendererComponents = {
  CodeBlock?: ComponentType<CodeBlockProps>;
  Image?: ComponentType<ImageProps>;
  Link?: ComponentType<LinkProps>;
};

export interface MarkdownRendererOptions {
  components?: MarkdownRendererComponents;
  headingLevelsForToc?: readonly MarkdownHeadingLevel[];
}

export interface MarkdownHeading {
  readonly id: string;
  readonly text: string;
  readonly level: MarkdownHeadingLevel;
}
