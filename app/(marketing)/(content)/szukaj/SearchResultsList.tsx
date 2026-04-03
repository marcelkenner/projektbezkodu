import Link from "next/link";
import { Badge } from "@/app/ui";
import type { SearchResult } from "@/app/lib/search/ContentSearchEngine";
import { SearchHighlight } from "./SearchHighlight";
import styles from "./search.module.css";

interface SearchResultsListProps {
  query: string;
  results: SearchResult[];
  readMoreLabel: string;
  typeLabels: Record<string, string>;
}

export function SearchResultsList({
  query,
  results,
  readMoreLabel,
  typeLabels,
}: SearchResultsListProps) {
  return (
    <div className={styles.resultsGrid}>
      {results.map((result) => (
        <article key={result.id} className={`pbk-card ${styles.resultCard}`}>
          <div className="pbk-stack pbk-stack--tight">
            <Badge variant="accent">
              {typeLabels[result.type] ?? result.type}
            </Badge>
            <h2 className={styles.resultTitle}>
              <Link href={result.path}>
                <SearchHighlight text={result.title} query={query} />
              </Link>
            </h2>
            {result.excerpt ? (
              <p className={styles.resultExcerpt}>
                <SearchHighlight text={result.excerpt} query={query} />
              </p>
            ) : null}
            {hasMeta(result) ? (
              <p className={styles.resultMeta}>
                {result.readingTime ? <span>{result.readingTime}</span> : null}
                {result.readingTime && result.publishedAt ? (
                  <span aria-hidden="true">•</span>
                ) : null}
                {result.publishedAt ? (
                  <time dateTime={result.publishedAt}>
                    {formatDate(result.publishedAt)}
                  </time>
                ) : null}
              </p>
            ) : null}
            <div>
              <Link className="pbk-button pbk-button--tertiary" href={result.path}>
                {readMoreLabel}
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function hasMeta(result: SearchResult): boolean {
  return Boolean(result.readingTime || result.publishedAt);
}

function formatDate(value: string): string {
  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) {
    return value;
  }

  return new Intl.DateTimeFormat("pl-PL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(timestamp));
}
