import { describe, expect, it } from "vitest";

import { NewsletterRedirector } from "@/app/api/newsletter/NewsletterRedirector";

describe("NewsletterRedirector", () => {
  it("uses forwarded proto/host when present", () => {
    const redirector = new NewsletterRedirector();
    const request = new Request("http://localhost:8080/api/newsletter/subscribe", {
      headers: {
        "x-forwarded-proto": "https",
        "x-forwarded-host": "projektbezkodu.pl",
      },
    });
    const response = redirector.redirect(request, "/newsletter", {
      error: "listmonk-error",
    });

    expect(response.headers.get("Location")).toBe(
      "https://projektbezkodu.pl/newsletter?error=listmonk-error",
    );
  });

  it("falls back to request.url origin without forwarded headers", () => {
    const redirector = new NewsletterRedirector();
    const request = new Request("https://localhost:8080/api/newsletter/subscribe");
    const response = redirector.redirect(request, "/newsletter/potwierdz/", {
      status: "success",
    });

    expect(response.headers.get("Location")).toBe(
      "https://localhost:8080/newsletter/potwierdz/?status=success",
    );
  });
});

