import "server-only";

export class NewsletterConfigError extends Error {
  constructor(
    public readonly variableName: string,
    message?: string,
  ) {
    super(message ?? `Newsletter misconfigured: ${variableName}`);
    this.name = "NewsletterConfigError";
  }
}

