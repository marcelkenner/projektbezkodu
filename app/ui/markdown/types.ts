import type { ReactNode } from "react";

export type Align = "left" | "center" | "right" | null;
export type MarkdownHeadingLevel = 2 | 3 | 4 | 5 | 6;

export type MarkdownRendererComponents = {
  CodeBlock?: (props: { language?: string; value: string }) => ReactNode;
  Image?: (props: { src: string; alt?: string; title?: string }) => ReactNode;
  Link?: (props: { href: string; children: ReactNode }) => ReactNode;
};

export interface MarkdownRendererOptions {
  components?: MarkdownRendererComponents;
  headingLevelsForToc?: MarkdownHeadingLevel[];
}

export interface MarkdownHeading {
  id: string;
  text: string;
  level: MarkdownHeadingLevel;
}
