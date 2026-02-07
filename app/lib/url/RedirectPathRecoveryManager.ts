export class RedirectPathRecoveryManager {
  recover(pathname: string): string {
    if (!pathname) {
      return pathname;
    }

    const trimmed = pathname.trim();
    if (!trimmed) {
      return pathname;
    }

    const { pathPart, suffix } = this.splitSuffix(trimmed);
    if (!this.hasMergedPathPattern(pathPart)) {
      return trimmed;
    }

    const firstPath = pathPart.split(",")[0]?.trim();
    if (!firstPath) {
      return trimmed;
    }

    return `${this.ensureWrappedSlashes(firstPath)}${suffix}`;
  }

  private hasMergedPathPattern(pathPart: string): boolean {
    return /,\s*\/|,%20\//i.test(pathPart);
  }

  private splitSuffix(value: string): { pathPart: string; suffix: string } {
    const match = value.match(/^([^?#]*)([?#].*)?$/);
    return {
      pathPart: match?.[1] ?? value,
      suffix: match?.[2] ?? "",
    };
  }

  private ensureWrappedSlashes(pathPart: string): string {
    const withLeading = pathPart.startsWith("/") ? pathPart : `/${pathPart}`;
    return withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
  }
}
