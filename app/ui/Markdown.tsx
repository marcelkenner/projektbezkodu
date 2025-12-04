import type { MarkdownRendererOptions } from "./MarkdownRenderer";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface MarkdownProps {
  source: string;
  options?: MarkdownRendererOptions;
}

export function Markdown({ source, options }: MarkdownProps) {
  const renderer = new MarkdownRenderer(source, options);

  return <>{renderer.render()}</>;
}
