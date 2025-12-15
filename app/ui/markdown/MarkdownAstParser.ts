import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import type { Root } from "mdast";

export class MarkdownAstParser {
  static parse(source: string): Root {
    return unified().use(remarkParse).use(remarkGfm).parse(source) as Root;
  }
}
