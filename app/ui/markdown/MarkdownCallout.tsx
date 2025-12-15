import type { ReactNode } from "react";
import type { Blockquote, Content, Paragraph, Text } from "mdast";
import { Info, Lightbulb, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { getCopy } from "@/app/lib/copy";

export type MarkdownCalloutKind =
  | "note"
  | "tip"
  | "important"
  | "warning"
  | "caution";

export interface ParsedMarkdownCallout {
  kind: MarkdownCalloutKind;
  children: Content[];
}

export class MarkdownCalloutParser {
  private static readonly kindMap: Record<string, MarkdownCalloutKind> = {
    NOTE: "note",
    TIP: "tip",
    IMPORTANT: "important",
    WARNING: "warning",
    CAUTION: "caution",
  };

  parse(node: Blockquote): ParsedMarkdownCallout | null {
    const [first, ...rest] = node.children;
    if (!first || first.type !== "paragraph") {
      return null;
    }

    const parsed = this.parseMarker(first);
    if (!parsed) {
      return null;
    }

    const normalizedFirst: Paragraph | null = parsed.paragraph;
    const children: Content[] = normalizedFirst ? [normalizedFirst, ...rest] : rest;
    return { kind: parsed.kind, children };
  }

  private parseMarker(
    paragraph: Paragraph,
  ): { kind: MarkdownCalloutKind; paragraph: Paragraph | null } | null {
    const [first, ...rest] = paragraph.children;
    if (!first || first.type !== "text") {
      return null;
    }

    const match = first.value.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/);
    if (!match) {
      return null;
    }

    const rawKind = match[1];
    const kind = MarkdownCalloutParser.kindMap[rawKind];
    if (!kind) {
      return null;
    }

    const trimmed = first.value.replace(match[0], "");
    const nextChildren = [...rest];
    if (trimmed.trim().length) {
      nextChildren.unshift({ ...(first as Text), value: trimmed });
    }

    if (!nextChildren.length) {
      return { kind, paragraph: null };
    }

    return { kind, paragraph: { ...paragraph, children: nextChildren } };
  }
}

function getCalloutLabel(kind: MarkdownCalloutKind): string {
  const copy = getCopy("global");
  return copy.callouts?.labels?.[kind] ?? kind.toUpperCase();
}

function CalloutIcon({ kind }: { kind: MarkdownCalloutKind }) {
  if (kind === "tip") {
    return <Lightbulb aria-hidden="true" size={18} />;
  }

  if (kind === "warning" || kind === "caution") {
    return <WarningCircle aria-hidden="true" size={18} />;
  }

  return <Info aria-hidden="true" size={18} />;
}

export function MarkdownCallout({
  kind,
  children,
}: {
  kind: MarkdownCalloutKind;
  children: ReactNode;
}) {
  const label = getCalloutLabel(kind);

  return (
    <aside className="callout" data-callout={kind} role="note">
      <div className="pbk-inline-list">
        <CalloutIcon kind={kind} />
        <strong>{label}</strong>
      </div>
      <div>{children}</div>
    </aside>
  );
}
