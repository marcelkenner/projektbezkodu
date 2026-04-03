import Link from "next/link";
import { SelectField, SiteSearchForm } from "@/app/ui";
import type { SearchRequest } from "@/app/lib/search/SearchRequest";
import styles from "./search.module.css";

interface SearchCopy {
  placeholder: string;
  form: {
    label: string;
    submitLabel: string;
    resetLabel: string;
  };
  filters: {
    typeLabel: string;
    sortLabel: string;
    typeOptions: Record<string, string>;
    sortOptions: Record<string, string>;
  };
}

interface SearchControlsProps {
  copy: SearchCopy;
  request: SearchRequest;
}

export function SearchControls({ copy, request }: SearchControlsProps) {
  return (
    <div className={styles.controls}>
      <SiteSearchForm
        config={{
          action: "/szukaj/",
          label: copy.form.label,
          placeholder: copy.placeholder,
          buttonLabel: copy.form.submitLabel,
        }}
        inputId="search-query"
        query={request.query}
        variant="panel"
        actions={hasActiveFilters(request) ? (
          <Link className="pbk-button pbk-button--tertiary" href="/szukaj/">
            {copy.form.resetLabel}
          </Link>
        ) : null}
      >
        <SelectField
          id="search-type"
          name="typ"
          label={copy.filters.typeLabel}
          defaultValue={request.type}
          options={buildOptions(copy.filters.typeOptions)}
        />
        <SelectField
          id="search-sort"
          name="sort"
          label={copy.filters.sortLabel}
          defaultValue={request.sort}
          options={buildOptions(copy.filters.sortOptions)}
        />
      </SiteSearchForm>
    </div>
  );
}

function buildOptions(options: Record<string, string>) {
  return Object.entries(options).map(([value, label]) => ({
    value,
    label,
  }));
}

function hasActiveFilters(request: SearchRequest): boolean {
  return (
    request.kind === "query" ||
    request.type !== "all" ||
    request.sort !== "relevance"
  );
}
