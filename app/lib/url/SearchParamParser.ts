export type SearchParamValue = string | string[] | undefined;

export type SearchParams = Record<string, SearchParamValue> | undefined;

export class SearchParamParser {
  constructor(private readonly params: SearchParams) {}

  getSingle(key: string): string | undefined {
    if (!this.params) {
      return undefined;
    }
    const value = this.params[key];
    if (Array.isArray(value)) {
      return value.at(-1) ?? undefined;
    }
    return value || undefined;
  }
}
