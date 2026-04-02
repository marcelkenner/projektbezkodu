import { SearchParamParser } from "@/app/lib/url/SearchParamParser";

export const SEARCH_CONTENT_TYPES = [
  "all",
  "article",
  "tutorial",
  "comparison",
  "glossary",
  "resource",
  "tool",
  "page",
] as const;

export type SearchContentType = (typeof SEARCH_CONTENT_TYPES)[number];

export const SEARCH_SORTS = ["relevance", "newest"] as const;

export type SearchSort = (typeof SEARCH_SORTS)[number];

export type SearchRequest =
  | {
      kind: "empty";
      query: "";
      type: SearchContentType;
      sort: SearchSort;
    }
  | {
      kind: "query";
      query: string;
      type: SearchContentType;
      sort: SearchSort;
    };

export function parseSearchRequest(parser: SearchParamParser): SearchRequest {
  const query = (parser.getSingle("q") ?? "").trim();
  const type = resolveSearchContentType(parser.getSingle("typ"));
  const sort = resolveSearchSort(parser.getSingle("sort"));

  if (!query) {
    return {
      kind: "empty",
      query: "",
      type,
      sort,
    };
  }

  return {
    kind: "query",
    query,
    type,
    sort,
  };
}

export function resolveSearchContentType(
  value: string | undefined,
): SearchContentType {
  if (!value) {
    return "all";
  }
  return SEARCH_CONTENT_TYPES.includes(value as SearchContentType)
    ? (value as SearchContentType)
    : "all";
}

export function resolveSearchSort(value: string | undefined): SearchSort {
  if (!value) {
    return "relevance";
  }
  return SEARCH_SORTS.includes(value as SearchSort)
    ? (value as SearchSort)
    : "relevance";
}
