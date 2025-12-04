import Link from "next/link";
import type { BreadcrumbItem } from "@/app/lib/navigation/BreadcrumbComposer";
import "./breadcrumbs.css";

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  ariaLabel?: string;
}

export function Breadcrumbs({
  items,
  ariaLabel = "Ścieżka nawigacyjna",
}: BreadcrumbsProps) {
  if (!items?.length) {
    return null;
  }

  return (
    <nav className="pbk-breadcrumbs" aria-label={ariaLabel}>
      <ol className="pbk-breadcrumbs__list">
        {items.map((item, index) => {
          const key = `${item.label}-${index}`;
          if (item.href && !item.isCurrent) {
            return (
              <li key={key} className="pbk-breadcrumbs__item">
                <Link className="pbk-breadcrumbs__link" href={item.href}>
                  {item.label}
                </Link>
              </li>
            );
          }
          return (
            <li
              key={key}
              className="pbk-breadcrumbs__item"
              aria-current={item.isCurrent ? "page" : undefined}
            >
              {item.label}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
