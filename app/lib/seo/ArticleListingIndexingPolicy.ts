import type { Metadata } from "next";

export interface ArticleListingSearchState {
  page?: string;
  query?: string;
  category?: string;
  readingTime?: string;
  tags?: string[];
}

export class ArticleListingIndexingPolicy {
  resolveRobots(
    searchState: ArticleListingSearchState,
  ): Metadata["robots"] | undefined {
    if (this.shouldNoindex(searchState)) {
      return {
        index: false,
        follow: true,
      };
    }
    return undefined;
  }

  private shouldNoindex(searchState: ArticleListingSearchState): boolean {
    if (this.isPaginated(searchState.page)) {
      return true;
    }
    return this.hasActiveFilters(searchState);
  }

  private isPaginated(pageValue: string | undefined): boolean {
    const pageNumber = pageValue ? Number(pageValue) : 1;
    return Number.isFinite(pageNumber) && pageNumber > 1;
  }

  private hasActiveFilters(searchState: ArticleListingSearchState): boolean {
    return Boolean(
      searchState.query ||
        searchState.category ||
        searchState.readingTime ||
        (searchState.tags?.length ?? 0) > 0,
    );
  }
}
