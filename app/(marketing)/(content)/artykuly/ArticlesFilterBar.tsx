import Link from "next/link";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";

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
    <aside className="articles-filter" aria-label={copy.formLabel}>
      <form className="articles-filter__form" method="get">
        <div className="articles-filter__row">
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
          <div className="articles-filter__select">
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
        <div className="articles-filter__actions">
          <button type="submit" className="pbk-button pbk-button--primary">
            {copy.submit}
          </button>
          <Link className="pbk-button pbk-button--secondary" href="/artykuly">
            Wyczyść
          </Link>
        </div>
      </form>
    </aside>
  );
}
