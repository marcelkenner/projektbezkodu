import Link from "next/link";
import type { MarkdownHeading } from "@/app/ui/MarkdownRenderer";
import "./ui.css";

interface TableOfContentsProps {
  title?: string;
  items: MarkdownHeading[];
}

export function TableOfContents({
  title = "Spis treści",
  items,
}: TableOfContentsProps) {
  if (!items.length) {
    return null;
  }

  return (
    <nav className="pbk-card pbk-stack" aria-label={title}>
      <h2 className="pbk-table-of-contents__title">{title}</h2>
      <ol className="pbk-table-of-contents__list">
        {items.map((item, index) => (
          <li
            key={item.id}
            className={
              item.level === 3
                ? "pbk-table-of-contents__item pbk-table-of-contents__item--nested"
                : "pbk-table-of-contents__item"
            }
          >
            {index > 0 ? (
              <span className="pbk-table-of-contents__divider" />
            ) : null}
            <Link href={`#${item.id}`}>{item.text}</Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
