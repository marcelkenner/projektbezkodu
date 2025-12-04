import Link from "next/link";
import { GlossaryRepository } from "@/app/lib/content/repositories";
import { GlossaryDirectory } from "@/app/lib/content/glossaryDirectory";
import { SearchParamParser } from "@/app/lib/url/SearchParamParser";
import { Button, TextField } from "../../../ui";
import { getCopy } from "../../../lib/copy";
import "./glossary.module.css";
import { GlossaryPromo } from "./GlossaryPromo";

const glossaryRepository = new GlossaryRepository();

interface GlossaryIndexProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function GlossaryIndex({
  searchParams,
}: GlossaryIndexProps) {
  const copy = getCopy("glossary");
  const terms = glossaryRepository.listSummaries();
  const directory = new GlossaryDirectory(terms);
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const parser = new SearchParamParser(resolvedSearchParams);
  const query = parser.getSingle("q") ?? "";
  const filtered = directory.filter({ query });
  const groups = directory.group(filtered);
  const hasEntries = terms.length > 0;
  const hasResults = groups.length > 0;

  return (
    <section className="section section--surface">
      <div className="pbk-container pbk-stack">
        <div className="section__header">
          <h1>{copy.title}</h1>
          <p>{copy.intro}</p>
        </div>
        <GlossaryPromo promo={copy.cta} />
        {hasEntries ? (
          <div className="pbk-stack pbk-stack--tight">
            <form className="pbk-stack pbk-stack--tight" method="get">
              <TextField
                id="glossary-search"
                name="q"
                type="search"
                label={copy.search.label}
                placeholder={copy.search.placeholder}
                defaultValue={query}
              />
              <div className="pbk-inline-list">
                <Button type="submit">{copy.search.submitLabel}</Button>
                <Link
                  className="pbk-button pbk-button--tertiary"
                  href="/glossary"
                  prefetch={false}
                >
                  {copy.search.resetLabel}
                </Link>
              </div>
            </form>
            {hasResults ? (
              <nav
                className="pbk-inline-list"
                aria-label={copy.navigation.label}
              >
                {groups.map((group) => (
                  <a
                    key={group.anchor}
                    className="pbk-badge pbk-badge--neutral"
                    href={`#${group.anchor}`}
                  >
                    {group.letter}
                  </a>
                ))}
              </nav>
            ) : null}
            {hasResults ? (
              groups.map((group) => (
                <div
                  key={group.anchor}
                  className="pbk-stack pbk-stack--tight"
                  id={group.anchor}
                >
                  <h2>{group.letter}</h2>
                  <div className="section__grid">
                    {group.entries.map((term) => (
                      <div key={term.slug ?? term.path} className="pbk-card">
                        <div className="pbk-stack pbk-stack--tight">
                          <h3>{term.title}</h3>
                          {term.description ? <p>{term.description}</p> : null}
                          <Link
                            className="pbk-button pbk-button--tertiary"
                            href={term.path}
                          >
                            {copy.readMoreLabel}
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="pbk-card">
                <p>{copy.search.noResults}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="pbk-card">
            <p>{copy.emptyState}</p>
          </div>
        )}
      </div>
    </section>
  );
}
