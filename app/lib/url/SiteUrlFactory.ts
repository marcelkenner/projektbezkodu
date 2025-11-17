const FALLBACK_ORIGIN = "https://projektbezkodu.pl";

export class SiteUrlFactory {
  constructor(private readonly origin: string = getDefaultOrigin()) {}

  build(target?: string): string {
    const sanitizedTarget = target?.trim() ?? "";
    if (!sanitizedTarget) {
      return this.origin;
    }

    if (this.isAbsoluteUrl(sanitizedTarget)) {
      return sanitizedTarget;
    }

    return new URL(this.ensureLeadingSlash(sanitizedTarget), this.origin).toString();
  }

  private isAbsoluteUrl(value: string): boolean {
    return /^https?:\/\//i.test(value);
  }

  private ensureLeadingSlash(value: string): string {
    if (value.startsWith("/")) {
      return value;
    }
    return `/${value}`;
  }
}

export const defaultSiteUrlFactory = new SiteUrlFactory();

function getDefaultOrigin(): string {
  const envValue = process.env.NEXT_PUBLIC_SITE_URL;
  if (envValue && /^https?:\/\//i.test(envValue)) {
    return envValue.replace(/\/+$/, "");
  }
  return FALLBACK_ORIGIN;
}
