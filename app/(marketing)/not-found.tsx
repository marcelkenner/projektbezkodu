import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  MagnifyingGlass,
  Warning,
} from "@phosphor-icons/react/dist/ssr";
import { getCopy } from "@/app/lib/copy";
import { ArticleRepository } from "@/app/lib/content/repositories";
import styles from "./not-found.module.css";

const notFoundCopy = getCopy("not-found");

export const metadata: Metadata = {
  title: notFoundCopy.seo?.title ?? notFoundCopy.title,
  description: notFoundCopy.seo?.description ?? notFoundCopy.body,
  robots: {
    index: false,
    follow: false,
  },
};

interface ShortcutLink {
  label: string;
  href: string;
}

interface SearchConfig {
  label: string;
  placeholder: string;
  buttonLabel: string;
  action: string;
}

interface ArticleSuggestion {
  slug: string;
  title: string;
  description?: string;
  href: string;
}

interface SuggestionEmptyState {
  message: string;
  ctaLabel: string;
  ctaHref: string;
}

class NotFoundPageViewModel {
  private readonly copy = notFoundCopy;
  private readonly suggestionLimit = 3;
  private readonly suggestions: ArticleSuggestion[];

  constructor(private readonly articleRepository = new ArticleRepository()) {
    this.suggestions = this.loadArticleSuggestions();
  }

  getTitle() {
    return this.copy.title;
  }

  getBody() {
    return this.copy.body;
  }

  getPrimaryCta() {
    return this.copy.primaryCta;
  }

  getSecondaryCta() {
    return this.copy.secondaryCta;
  }

  getSearchConfig(): SearchConfig {
    return this.copy.search;
  }

  getShortcuts(): ShortcutLink[] {
    return this.copy.shortcuts ?? [];
  }

  hasShortcuts() {
    return this.getShortcuts().length > 0;
  }

  getSuggestionHeading() {
    return this.copy.suggestions?.heading ?? "Najnowsze artykuły";
  }

  getSuggestionDescription() {
    return this.copy.suggestions?.description ?? null;
  }

  getSuggestionCtaLabel() {
    return this.copy.suggestions?.ctaLabel ?? "Czytaj więcej";
  }

  getSuggestionEmptyState(): SuggestionEmptyState | null {
    return this.copy.suggestions?.emptyState ?? null;
  }

  getArticleSuggestions() {
    return this.suggestions.slice(0, this.suggestionLimit);
  }

  private loadArticleSuggestions(): ArticleSuggestion[] {
    const summaries = this.articleRepository.listSummaries();
    return summaries
      .sort((a, b) => {
        const dateDiff = this.compareDates(b.date, a.date);
        if (dateDiff !== 0) {
          return dateDiff;
        }
        return a.title.localeCompare(b.title, "pl");
      })
      .map((article) => ({
        slug: article.slug,
        title: article.title,
        description: article.description,
        href: article.path ?? `/artykuly/${article.slug}/`,
      }));
  }

  private compareDates(first?: string, second?: string) {
    const firstValue = first ? Date.parse(first) : 0;
    const secondValue = second ? Date.parse(second) : 0;
    return firstValue - secondValue;
  }
}

export default function NotFoundPage() {
  const viewModel = new NotFoundPageViewModel();
  const shortcuts = viewModel.getShortcuts();
  const suggestions = viewModel.getArticleSuggestions();

  return (
    <section className={styles["not-found"]} id="content">
      <div className={`pbk-container ${styles["not-found__inner"]}`}>
        <Warning
          aria-hidden="true"
          className={styles["not-found__icon"]}
          weight="bold"
        />
        <h1>{viewModel.getTitle()}</h1>
        <p>{viewModel.getBody()}</p>
        <div className={styles["not-found__cta"]}>
          <Link
            className="pbk-button pbk-button--primary"
            href={viewModel.getPrimaryCta().href}
          >
            {viewModel.getPrimaryCta().label}
          </Link>
          <Link
            className="pbk-button pbk-button--secondary"
            href={viewModel.getSecondaryCta().href}
          >
            {viewModel.getSecondaryCta().label}
          </Link>
        </div>
        <SearchForm config={viewModel.getSearchConfig()} />
        {viewModel.hasShortcuts() ? <ShortcutLinks links={shortcuts} /> : null}
      </div>
      <div className="pbk-container">
        <ArticleSuggestionsSection
          heading={viewModel.getSuggestionHeading()}
          description={viewModel.getSuggestionDescription()}
          ctaLabel={viewModel.getSuggestionCtaLabel()}
          suggestions={suggestions}
          emptyState={viewModel.getSuggestionEmptyState()}
        />
      </div>
    </section>
  );
}

function SearchForm({ config }: { config: SearchConfig }) {
  return (
    <form
      className={styles["not-found__search"]}
      method="get"
      role="search"
      aria-label={config.label}
      action={config.action}
    >
      <label className="sr-only" htmlFor="not-found-query">
        {config.label}
      </label>
      <input
        id="not-found-query"
        name="q"
        type="search"
        placeholder={config.placeholder}
        minLength={2}
      />
      <button type="submit" aria-label={config.buttonLabel}>
        <MagnifyingGlass aria-hidden="true" size={20} weight="bold" />
      </button>
    </form>
  );
}

function ShortcutLinks({ links }: { links: ShortcutLink[] }) {
  return (
    <nav
      className={styles["not-found__shortcuts"]}
      aria-label="Skróty do popularnych treści"
    >
      <ul className={styles["not-found__links"]}>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function ArticleSuggestionsSection({
  heading,
  description,
  suggestions,
  ctaLabel,
  emptyState,
}: {
  heading: string;
  description: string | null;
  suggestions: ArticleSuggestion[];
  ctaLabel: string;
  emptyState: SuggestionEmptyState | null;
}) {
  if (!suggestions.length && !emptyState) {
    return null;
  }

  return (
    <section
      className={styles["not-found__suggestions"]}
      aria-labelledby="not-found-suggestions-heading"
    >
      <header className={styles["not-found__suggestionsHeader"]}>
        <h2 id="not-found-suggestions-heading">{heading}</h2>
        {description ? <p>{description}</p> : null}
      </header>
      {suggestions.length ? (
        <ul className={styles["not-found__suggestionsList"]}>
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.slug}
              className={styles["not-found__suggestionsCard"]}
            >
              <h3>{suggestion.title}</h3>
              {suggestion.description ? <p>{suggestion.description}</p> : null}
              <Link
                className={styles["not-found__suggestionsLink"]}
                href={suggestion.href}
                aria-label={`${ctaLabel}: ${suggestion.title}`}
              >
                {ctaLabel}
                <ArrowRight aria-hidden="true" size={18} weight="bold" />
              </Link>
            </li>
          ))}
        </ul>
      ) : emptyState ? (
        <div className={styles["not-found__suggestionsEmpty"]}>
          <p>{emptyState.message}</p>
          <Link
            className="pbk-button pbk-button--secondary"
            href={emptyState.ctaHref}
          >
            {emptyState.ctaLabel}
          </Link>
        </div>
      ) : null}
    </section>
  );
}
