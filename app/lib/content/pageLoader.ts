import type { ContentEntry } from "../frontmatter";
import { readMarkdownFile } from "../frontmatter";

export class MarkdownPageLoader {
  constructor(private readonly relativePath: string) {}

  load(): ContentEntry {
    return readMarkdownFile(this.relativePath);
  }
}
