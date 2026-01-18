export class SitemapDateParser {
  toTimestamp(value: string | undefined): number | null {
    if (!value) {
      return null;
    }
    const timestamp = Date.parse(value);
    return Number.isNaN(timestamp) ? null : timestamp;
  }
}

