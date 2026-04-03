import type { SearchContentType } from "@/app/lib/search/SearchRequest";

export type SearchDocumentType = Exclude<SearchContentType, "all">;

export interface SearchDocument {
  id: string;
  title: string;
  description: string;
  excerpt: string;
  path: string;
  type: SearchDocumentType;
  keywords: string[];
  publishedAt?: string;
  readingTime?: string;
}

export interface SearchDocumentRepository {
  listDocuments(): SearchDocument[];
}

export function buildSearchDocumentId(
  type: SearchDocumentType,
  path: string,
): string {
  return `${type}:${path}`;
}
