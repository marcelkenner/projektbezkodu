import type { Metadata } from "next";
import { ContentSearchEngine } from "@/app/lib/search/ContentSearchEngine";
import { getCopy } from "@/app/lib/copy";
import { SearchParamParser } from "@/app/lib/url/SearchParamParser";
import { parseSearchRequest } from "@/app/lib/search/SearchRequest";
import { SearchControls } from "./SearchControls";
import { SearchResultsList } from "./SearchResultsList";
import styles from "./search.module.css";

const searchEngine = new ContentSearchEngine();

interface SearchPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

interface SearchTip {
  title: string;
  body: string;
}

const copy = getCopy("search");

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: copy.title,
    description: copy.intro,
    alternates: {
      canonical: "/szukaj/",
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const request = parseSearchRequest(new SearchParamParser(resolvedSearchParams));
  const results = searchEngine.search(request);

  return (
    <section className="section section--surface" id="content">
      <div className="pbk-container pbk-stack">
        <header className="section__header">
          <h1>{copy.title}</h1>
          <p>{copy.intro}</p>
        </header>
        <SearchControls copy={copy} request={request} />
        <SearchResultsSection request={request} results={results} />
        {(copy.tips ?? []).length ? (
          <div className={styles.tipsGrid}>
            {copy.tips.map((tip: SearchTip) => (
              <div key={tip.title} className="pbk-card">
                <h2>{tip.title}</h2>
                <p>{tip.body}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function SearchResultsSection({
  request,
  results,
}: {
  request: ReturnType<typeof parseSearchRequest>;
  results: ReturnType<ContentSearchEngine["search"]>;
}) {
  if (request.kind === "empty") {
    return <p className="pbk-input__description">{copy.results.prompt}</p>;
  }

  if (!results.length) {
    return (
      <div className={`pbk-card ${styles.emptyState}`}>
        <h2>{formatTemplate(copy.results.emptyTitle, results.length, request.query)}</h2>
        <p>{copy.results.empty}</p>
      </div>
    );
  }

  return (
    <div className="pbk-stack pbk-stack--tight">
      <p className="pbk-input__description" aria-live="polite">
        {formatTemplate(copy.results.querySummary, results.length, request.query)}
      </p>
      <SearchResultsList
        query={request.query}
        results={results}
        readMoreLabel={copy.results.readMoreLabel}
        typeLabels={copy.typeLabels}
      />
    </div>
  );
}

function formatTemplate(
  template: string,
  count: number,
  query: string,
): string {
  return template
    .replace("{count}", String(count))
    .replace("{query}", query);
}
