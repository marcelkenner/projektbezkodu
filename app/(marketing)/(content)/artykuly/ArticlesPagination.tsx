import Link from "next/link";

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

  const items = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="articles-pagination">
      <nav aria-label={copy.ariaLabel}>
        {currentPage > 1 ? (
          <PaginationLink
            href={buildHref(baseSearchParams, currentPage - 1)}
            rel="prev"
          >
            {copy.previous}
          </PaginationLink>
        ) : null}
        {items.map((page) => (
          <PaginationLink
            key={page}
            href={buildHref(baseSearchParams, page)}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </PaginationLink>
        ))}
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
