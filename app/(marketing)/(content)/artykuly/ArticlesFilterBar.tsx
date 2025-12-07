import Link from "next/link";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/app/ui/Button";
import { ContentFilterBar } from "@/app/ui";
import styles from "./articles.module.css";

interface FilterCopy {
  formLabel: string;
  search: { label: string; placeholder: string };
  category: { label: string; placeholder: string };
  submit: string;
}

interface SelectedFilters {
  query?: string;
  category?: string;
}

interface ArticlesFilterBarProps {
  copy: FilterCopy;
  categories: string[];
  selected: SelectedFilters;
}

export function ArticlesFilterBar({
  copy,
  categories,
  selected,
}: ArticlesFilterBarProps) {
  return (
    <aside
      className={`articles-filter ${styles["articles-filter"]}`}
      aria-label={copy.formLabel}
    >
      <ContentFilterBar
        variant="articles"
        method="get"
        legend={copy.formLabel}
        className={`articles-filter__form ${styles["articles-filter__form"] ?? ""}`}
        actions={
          <>
            <Button type="submit" variant="primary" size="compact">
              {copy.submit}
            </Button>
            <Link
              className="pbk-button pbk-button--secondary pbk-button--compact"
              href="/artykuly"
            >
              Wyczyść
            </Link>
          </>
        }
      >
        <div
          className={`articles-filter__row ${styles["articles-filter__row"]}`}
        >
          <label htmlFor="search-query" className="sr-only">
            {copy.search.label}
          </label>
          <input
            id="search-query"
            type="search"
            name="q"
            placeholder={copy.search.placeholder}
            defaultValue={selected.query}
            minLength={2}
          />
          <label htmlFor="search-category" className="sr-only">
            {copy.category.label}
          </label>
          <div
            className={`articles-filter__select ${styles["articles-filter__select"]}`}
          >
            <select
              id="search-category"
              name="kategoria"
              defaultValue={selected.category ?? ""}
            >
              <option value="">{copy.category.placeholder}</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <CaretDown aria-hidden="true" weight="bold" />
          </div>
        </div>
      </ContentFilterBar>
    </aside>
  );
}
