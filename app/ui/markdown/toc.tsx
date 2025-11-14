import type { ReactNode } from "react";
import type { MarkdownHeading } from "./types";

export function renderTocNav(headings: MarkdownHeading[]): ReactNode {
  if (!headings.length) {
    return null;
  }
  return (
    <nav className="pbk-toc" aria-label="Table of contents">
      <ul>
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={`pbk-toc__item pbk-toc__item--level-${heading.level}`}
          >
            <a href={`#${heading.id}`} className="pbk-link">
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
