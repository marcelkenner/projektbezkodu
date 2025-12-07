import Link from "next/link";
import styles from "./articles.module.css";

interface PaginationCopy {
  ariaLabel: string;
  previous: string;
  next: string;
}

interface ArticlesPaginationProps {
  copy: PaginationCopy;
  currentPage: number;
  totalPages: number;
  baseSearchParams: URLSearchParams;
}

export function ArticlesPagination({
  copy,
  currentPage,
  totalPages,
  baseSearchParams,
}: ArticlesPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const items = buildPageItems(currentPage, totalPages);

  return (
    <div className={`articles-pagination ${styles["articles-pagination"]}`}>
      <nav aria-label={copy.ariaLabel}>
        {currentPage > 1 ? (
          <PaginationLink
            href={buildHref(baseSearchParams, currentPage - 1)}
            rel="prev"
          >
            {copy.previous}
          </PaginationLink>
        ) : null}
        {items.map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className={`articles-pagination__ellipsis ${styles["articles-pagination__ellipsis"]}`}
            >
              …
            </span>
          ) : (
            <PaginationLink
              key={item}
              href={buildHref(baseSearchParams, item)}
              aria-current={item === currentPage ? "page" : undefined}
            >
              {item}
            </PaginationLink>
          ),
        )}
        {currentPage < totalPages ? (
          <PaginationLink
            href={buildHref(baseSearchParams, currentPage + 1)}
            rel="next"
          >
            {copy.next}
          </PaginationLink>
        ) : null}
      </nav>
    </div>
  );
}

interface PaginationLinkProps {
  href: string;
  children: React.ReactNode;
  rel?: string;
  "aria-current"?: "page";
}

function PaginationLink({
  href,
  children,
  rel,
  "aria-current": ariaCurrent,
}: PaginationLinkProps) {
  return (
    <Link href={href} rel={rel} aria-current={ariaCurrent}>
      {children}
    </Link>
  );
}

function buildHref(params: URLSearchParams, page: number): string {
  const nextParams = new URLSearchParams(params);
  if (page <= 1) {
    nextParams.delete("page");
  } else {
    nextParams.set("page", String(page));
  }
  const query = nextParams.toString();
  return query ? `/artykuly?${query}` : "/artykuly";
}

function buildPageItems(
  current: number,
  total: number,
): Array<number | "ellipsis"> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages: Array<number | "ellipsis"> = [];
  const siblings = 1;

  const addPage = (page: number) => {
    if (!pages.includes(page)) {
      pages.push(page);
    }
  };

  addPage(1);

  let start = Math.max(2, current - siblings);
  const end = Math.min(total - 1, current + siblings);

  if (start > 2) {
    pages.push("ellipsis");
  } else {
    start = 2;
  }

  for (let page = start; page <= end; page += 1) {
    addPage(page);
  }

  if (end < total - 1) {
    pages.push("ellipsis");
  }

  addPage(total);

  return pages;
}
