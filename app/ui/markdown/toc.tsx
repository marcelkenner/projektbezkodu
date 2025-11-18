import type { JSX } from "react";
import type { MarkdownHeading } from "./types";

type TocNavProps = {
  headings: MarkdownHeading[];
};

export function TocNav({ headings }: TocNavProps): JSX.Element | null {
  if (!headings.length) {
    return null;
  }

  return (
    <nav className="pbk-toc" aria-label="Table of contents">
      <ul>
        {headings.map(({ id, level, text }) => {
          const normalizedLevel = Math.min(Math.max(level, 1), 6);

          return (
            <li
              key={id}
              className={`pbk-toc__item pbk-toc__item--level-${normalizedLevel}`}
            >
              <a href={`#${id}`} className="pbk-link">
                {text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
