export interface ParsedPrice {
  amount: string;
  currency: string;
}

export class StructuredDataPriceParser {
  parse(raw?: string): ParsedPrice | null {
    if (!raw) {
      return null;
    }

    const normalized = raw.trim();
    if (!normalized) {
      return null;
    }

    if (
      normalized.toLowerCase().includes("free") ||
      normalized.includes("0 zł") ||
      normalized.includes("0zl")
    ) {
      return { amount: "0", currency: "PLN" };
    }

    const match = normalized.match(/[\d.,]+/);
    if (!match) {
      return null;
    }

    const amount = match[0].replace(",", ".").replace(/\s+/g, "");
    return {
      amount,
      currency: this.resolveCurrency(normalized),
    };
  }

  private resolveCurrency(source: string): string {
    if (source.includes("$")) {
      return "USD";
    }
    if (source.includes("€")) {
      return "EUR";
    }
    if (source.includes("£")) {
      return "GBP";
    }
    if (source.toLowerCase().includes("pln") || source.includes("zł")) {
      return "PLN";
    }
    return "PLN";
  }
}
