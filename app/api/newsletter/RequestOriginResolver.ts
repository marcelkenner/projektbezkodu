export class RequestOriginResolver {
  resolve(request: Request): string {
    const forwarded = request.headers.get("forwarded");
    const forwardedFromHeader = forwarded ? this.parseForwarded(forwarded) : null;
    if (forwardedFromHeader) {
      return forwardedFromHeader;
    }

    const proto = this.firstHeaderValue(request.headers.get("x-forwarded-proto"));
    const host = this.firstHeaderValue(request.headers.get("x-forwarded-host"));
    if (host) {
      return `${proto || "https"}://${host}`;
    }

    const url = new URL(request.url);
    return url.origin;
  }

  private firstHeaderValue(value: string | null): string | null {
    if (!value) {
      return null;
    }
    const [first] = value.split(",");
    const trimmed = first?.trim();
    return trimmed ? trimmed : null;
  }

  private parseForwarded(value: string): string | null {
    const first = this.firstHeaderValue(value);
    if (!first) {
      return null;
    }
    const pairs = first
      .split(";")
      .map((segment) => segment.trim())
      .filter(Boolean)
      .map((segment) => segment.split("="));
    const map = new Map(
      pairs
        .filter((pair): pair is [string, string] => pair.length === 2)
        .map(([key, raw]) => [key.toLowerCase(), raw.replace(/^\"|\"$/g, "")]),
    );

    const host = map.get("host");
    if (!host) {
      return null;
    }
    const proto = map.get("proto") || "https";
    return `${proto}://${host}`;
  }
}

