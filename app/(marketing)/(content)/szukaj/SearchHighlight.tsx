import type { ReactNode } from "react";

interface SearchHighlightProps {
  text: string;
  query: string;
}

export function SearchHighlight({ text, query }: SearchHighlightProps) {
  const parts = splitHighlightedText(text, query);

  return (
    <>
      {parts.map((part, index) =>
        part.highlight ? <mark key={index}>{part.value}</mark> : <Text key={index}>{part.value}</Text>,
      )}
    </>
  );
}

function Text({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

function splitHighlightedText(text: string, query: string) {
  const candidate = resolveCandidate(text, query);
  if (!candidate) {
    return [{ value: text, highlight: false }];
  }

  const expression = new RegExp(`(${escapeRegExp(candidate)})`, "ig");
  return text
    .split(expression)
    .map((value, index) => ({
      value,
      highlight: index % 2 === 1,
    }))
    .filter((part) => Boolean(part.value));
}

function resolveCandidate(text: string, query: string): string | null {
  const trimmed = query.trim();
  if (!trimmed) {
    return null;
  }

  const candidates = [trimmed, ...trimmed.split(/\s+/)].filter(Boolean);
  return candidates.find((candidate) =>
    new RegExp(escapeRegExp(candidate), "i").test(text),
  ) ?? null;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
