import { describe, expect, it } from "vitest";

import { NewsletterErrorMapper } from "@/app/api/newsletter/NewsletterErrorMapper";
import { ListmonkError } from "@/app/lib/newsletter/ListmonkClient";
import { NewsletterConfigError } from "@/app/lib/newsletter/NewsletterConfigError";

describe("NewsletterErrorMapper", () => {
  it("maps config errors to service-misconfigured", () => {
    const mapper = new NewsletterErrorMapper();
    expect(mapper.mapSubscribe(new NewsletterConfigError("LISTMONK_BASE_URL"))).toBe(
      "service-misconfigured",
    );
  });

  it("maps 5xx to service-unavailable", () => {
    const mapper = new NewsletterErrorMapper();
    expect(mapper.mapSubscribe(new ListmonkError("boom", 503))).toBe(
      "service-unavailable",
    );
  });

  it("maps subscribe 422 to invalid-email", () => {
    const mapper = new NewsletterErrorMapper();
    expect(mapper.mapSubscribe(new ListmonkError("bad", 422))).toBe(
      "invalid-email",
    );
  });

  it("maps resend 404 to missing-context", () => {
    const mapper = new NewsletterErrorMapper();
    expect(mapper.mapResend(new ListmonkError("missing", 404))).toBe(
      "missing-context",
    );
  });

  it("maps preferences missing subscriber sentinel to missing-subscriber", () => {
    const mapper = new NewsletterErrorMapper();
    expect(
      mapper.mapPreferences(new ListmonkError("Subscriber not found", 404)),
    ).toBe("missing-subscriber");
  });
});

