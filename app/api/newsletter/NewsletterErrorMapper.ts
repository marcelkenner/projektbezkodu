import { ListmonkError } from "@/app/lib/newsletter/ListmonkClient";
import { NewsletterConfigError } from "@/app/lib/newsletter/NewsletterConfigError";

export class NewsletterErrorMapper {
  mapSubscribe(error: unknown): string {
    if (error instanceof NewsletterConfigError) {
      return "service-misconfigured";
    }
    if (error instanceof ListmonkError) {
      if (error.status === 422) {
        return "invalid-email";
      }
      return this.mapSharedListmonk(error);
    }
    return "unexpected";
  }

  mapResend(error: unknown): string {
    if (error instanceof NewsletterConfigError) {
      return "service-misconfigured";
    }
    if (error instanceof ListmonkError) {
      if (error.status === 404) {
        return "missing-context";
      }
      return this.mapSharedListmonk(error);
    }
    return "unexpected";
  }

  mapPreferences(error: unknown): string {
    if (error instanceof NewsletterConfigError) {
      return "service-misconfigured";
    }
    if (error instanceof ListmonkError) {
      if (error.status === 404 && error.message === "Subscriber not found") {
        return "missing-subscriber";
      }
      return this.mapSharedListmonk(error);
    }
    return "unexpected";
  }

  mapUnsubscribe(error: unknown): string {
    if (error instanceof NewsletterConfigError) {
      return "service-misconfigured";
    }
    if (error instanceof ListmonkError) {
      if (error.status === 404 && error.message === "Subscriber not found") {
        return "missing-subscriber";
      }
      return this.mapSharedListmonk(error);
    }
    return "unexpected";
  }

  private mapSharedListmonk(error: ListmonkError): string {
    if (error.status === 429) {
      return "rate-limited";
    }
    if (error.status === 408) {
      return "timeout";
    }
    if (error.status === 401 || error.status === 403) {
      return "service-misconfigured";
    }
    if (error.status >= 500) {
      return "service-unavailable";
    }
    if (error.status === 400 || error.status === 404 || error.status === 405) {
      return "service-misconfigured";
    }
    return "listmonk-error";
  }
}
