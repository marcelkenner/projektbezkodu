export class SitemapPathNormalizer {
  normalizeSitePath(input: string): string | null {
    if (typeof input !== "string") {
      return null;
    }
    const trimmed = input.trim();
    if (!trimmed) {
      return null;
    }
    const withoutDomain = trimmed.replace(/^https?:\/\/[^/]+/i, "");
    const match = withoutDomain.match(/^([^?#]*)([?#].*)?$/);
    const pathPart = match?.[1] ?? withoutDomain;
    const collapsed = pathPart.replace(/\/{2,}/g, "/");

    const withLeading = collapsed.startsWith("/") ? collapsed : `/${collapsed}`;
    if (withLeading === "/") {
      return "/";
    }
    return withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
  }

  isAbsoluteUrl(value: string): boolean {
    return /^https?:\/\//i.test(value);
  }
}

