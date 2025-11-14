import Link from "next/link";
import { ContentSearchEngine } from "@/app/lib/search/ContentSearchEngine";
import { SearchParamParser } from "@/app/lib/url/SearchParamParser";
import { Badge, Button, TextField } from "@/app/ui";
import { getCopy } from "../../../lib/copy";

const searchEngine = new ContentSearchEngine();

interface SearchPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

function formatResultLabel(template: string, count: number): string {
  return template.replace("{count}", String(count));
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const copy = getCopy("search");
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const parser = new SearchParamParser(resolvedSearchParams);
  const query = parser.getSingle("q") ?? "";
  const hasQuery = query.trim().length > 0;
  const results = hasQuery ? searchEngine.search(query) : [];
  const hasResults = results.length > 0;

  return (
    <section className="section section--surface">
      <div className="pbk-container pbk-stack">
        <div className="section__header">
          <h1>{copy.title}</h1>
          <p>{copy.intro}</p>
        </div>
        <form className="pbk-stack pbk-stack--tight" method="get">
          <TextField
            id="search-query"
            name="q"
            type="search"
            label={copy.form.label}
            placeholder={copy.placeholder}
            defaultValue={query}
          />
          <div className="pbk-inline-list">
            <Button type="submit">{copy.form.submitLabel}</Button>
            {hasQuery ? (
              <Link
                className="pbk-button pbk-button--tertiary"
                href="/szukaj"
                prefetch={false}
              >
                {copy.form.resetLabel}
              </Link>
            ) : null}
          </div>
        </form>
        <div className="pbk-stack pbk-stack--tight">
          {!hasQuery ? (
            <p className="pbk-input__description">{copy.results.prompt}</p>
          ) : hasResults ? (
            <>
              <p className="pbk-input__description">
                {formatResultLabel(copy.results.header, results.length)}
              </p>
              <div className="section__grid">
                {results.map((result) => (
                  <div key={result.id} className="pbk-card">
                    <div className="pbk-stack pbk-stack--tight">
                      <Badge variant="accent">
                        {copy.typeLabels[result.type] ?? result.type}
                      </Badge>
                      <h2>
                        <Link href={result.path}>{result.title}</Link>
                      </h2>
                      {result.description ? <p>{result.description}</p> : null}
                      <Link
                        className="pbk-button pbk-button--tertiary"
                        href={result.path}
                      >
                        {copy.results.readMoreLabel}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="pbk-card">
              <p>{copy.results.empty}</p>
            </div>
          )}
        </div>
        {(copy.tips ?? []).length ? (
          <div className="section__grid">
            {copy.tips.map((tip: { title: string; body: string }) => (
              <div key={tip.title} className="pbk-card">
                <h3>{tip.title}</h3>
                <p>{tip.body}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
