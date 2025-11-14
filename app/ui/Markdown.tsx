import { useMemo } from "react";
import type { MarkdownRendererOptions } from "./MarkdownRenderer";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface MarkdownProps {
  source: string;
  options?: MarkdownRendererOptions;
}

export function Markdown({ source, options }: MarkdownProps) {
  const renderer = useMemo(
    () => new MarkdownRenderer(source, options),
    [source, options],
  );

  return <>{renderer.render()}</>;
}
