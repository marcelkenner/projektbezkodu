import Link from "next/link";
import type { TaxonomyTerm } from "@/app/lib/content/articleTaxonomy";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterCopy {
  formLabel: string;
  search: { label: string; placeholder: string };
  category: { label: string; placeholder: string };
  readingTime: { label: string; options: FilterOption[] };
  tags: { label: string; chips: string[] };
  submit: string;
}

interface SelectedFilters {
  query?: string;
  category?: string;
  readingTime?: string;
  tags: string[];
}

interface ArticlesFilterBarProps {
  copy: FilterCopy;
  categories: TaxonomyTerm[];
  tags: TaxonomyTerm[];
  selected: SelectedFilters;
}

export function ArticlesFilterBar({
  copy,
  categories,
  tags,
  selected,
}: ArticlesFilterBarProps) {
  const tagMap = new Map(tags.map((tag) => [tag.slug, tag]));
  const selectedTagSet = new Set(selected.tags);

  return (
    <aside className="articles-filter" aria-label={copy.formLabel}>
      <form className="articles-filter__form" method="get">
        <div className="articles-filter__fields">
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
            <select
              id="search-category"
              name="kategoria"
              defaultValue={selected.category ?? ""}
            >
              <option value="">{copy.category.placeholder}</option>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.label}
                </option>
              ))}
            </select>
            <label htmlFor="search-reading-time" className="sr-only">
              {copy.readingTime.label}
            </label>
            <select
              id="search-reading-time"
              name="czas"
              defaultValue={selected.readingTime ?? ""}
            >
              {copy.readingTime.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <fieldset>
          <legend className="sr-only">{copy.tags.label}</legend>
          <div className="articles-filter__chips">
            {copy.tags.chips.map((slug) => {
              const tag = tagMap.get(slug);
              const label = tag?.label ?? slug;
              const inputId = `tag-${slug}`;
              const isSelected = selectedTagSet.has(slug);
              return (
                <label
                  key={slug}
                  className="articles-filter__chip"
                  htmlFor={inputId}
                  data-selected={isSelected ? "true" : "false"}
                >
                  <input
                    id={inputId}
                    className="sr-only"
                    type="checkbox"
                    name="tag"
                    value={slug}
                    defaultChecked={isSelected}
                  />
                  {label}
                </label>
              );
            })}
          </div>
        </fieldset>
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
