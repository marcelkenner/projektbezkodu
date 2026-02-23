import type { NextRequest } from "next/server";

const DEFAULT_CANONICAL_ORIGIN = "https://projektbezkodu.pl";

type ParsedHost = {
  host: string;
  hostname: string;
};

export class CanonicalHostRedirectManager {
  private readonly canonicalHost: string;
  private readonly canonicalHostname: string;
  private readonly alternateHostname: string | null;

  constructor(canonicalOrigin: string = getCanonicalOrigin()) {
    const canonicalUrl =
      this.parseUrl(canonicalOrigin) ??
      this.parseUrl(DEFAULT_CANONICAL_ORIGIN) ??
      new URL(DEFAULT_CANONICAL_ORIGIN);

    this.canonicalHost = canonicalUrl.host.toLowerCase();
    this.canonicalHostname = canonicalUrl.hostname.toLowerCase();
    this.alternateHostname = this.resolveAlternateHostname(
      this.canonicalHostname,
    );
  }

  buildRedirectUrl(
    request: NextRequest,
    pathname: string,
    search: string,
  ): URL | null {
    if (!this.alternateHostname || this.isLocalHostname(this.canonicalHostname)) {
      return null;
    }

    const requestHost = this.resolveRequestHost(request);
    if (!requestHost || this.isLocalHostname(requestHost.hostname)) {
      return null;
    }

    if (requestHost.hostname !== this.alternateHostname) {
      return null;
    }

    const url = request.nextUrl.clone();
    url.host = this.canonicalHost;
    url.pathname = pathname;
    url.search = search;
    return url;
  }

  private resolveRequestHost(request: NextRequest): ParsedHost | null {
    const forwardedHost = this.firstHeaderValue(
      request.headers.get("x-forwarded-host"),
    );
    const hostHeader = this.firstHeaderValue(request.headers.get("host"));
    const host = forwardedHost ?? hostHeader ?? request.nextUrl.host;
    return host ? this.parseHost(host) : null;
  }

  private parseHost(value: string): ParsedHost | null {
    const parsed = this.parseUrl(value);
    if (!parsed) {
      return null;
    }

    return {
      host: parsed.host.toLowerCase(),
      hostname: parsed.hostname.toLowerCase(),
    };
  }

  private parseUrl(value: string): URL | null {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }

    try {
      return /^https?:\/\//i.test(trimmed)
        ? new URL(trimmed)
        : new URL(`https://${trimmed}`);
    } catch {
      return null;
    }
  }

  private firstHeaderValue(value: string | null): string | null {
    if (!value) {
      return null;
    }
    const [first] = value.split(",");
    const trimmed = first?.trim();
    return trimmed ? trimmed : null;
  }

  private resolveAlternateHostname(hostname: string): string | null {
    if (!hostname) {
      return null;
    }

    if (hostname.startsWith("www.")) {
      const withoutPrefix = hostname.slice(4);
      return withoutPrefix || null;
    }

    return `www.${hostname}`;
  }

  private isLocalHostname(hostname: string): boolean {
    return (
      hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]"
    );
  }
}

function getCanonicalOrigin(): string {
  const explicitHost = process.env.CANONICAL_HOST?.trim();
  if (explicitHost) {
    return explicitHost;
  }

  const publicOrigin = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (publicOrigin) {
    return publicOrigin;
  }

  return DEFAULT_CANONICAL_ORIGIN;
}
