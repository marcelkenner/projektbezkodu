import { describe, expect, it } from "vitest";

import { SearchParamParser } from "@/app/lib/url/SearchParamParser";
import { NewsletterAlertResolver } from "@/app/(marketing)/newsletter/NewsletterAlertResolver";

describe("NewsletterAlertResolver", () => {
  it("returns a danger alert for subscribe listmonk-error", () => {
    const resolver = new NewsletterAlertResolver(buildAlerts());
    const parser = new SearchParamParser({ error: "listmonk-error" });
    const alert = resolver.resolveSubscribe(parser);

    expect(alert).toEqual({
      variant: "danger",
      title: "lm",
      message: "lm",
    });
  });

  it("returns a warning alert for confirm optin-delayed", () => {
    const resolver = new NewsletterAlertResolver(buildAlerts());
    const parser = new SearchParamParser({ warning: "optin-delayed" });
    const alert = resolver.resolveConfirm(parser);

    expect(alert).toEqual({
      variant: "warning",
      title: "delay",
      message: "delay",
    });
  });

  it("returns a danger alert for confirm service-unavailable", () => {
    const resolver = new NewsletterAlertResolver(buildAlerts());
    const parser = new SearchParamParser({ error: "service-unavailable" });
    const alert = resolver.resolveConfirm(parser);

    expect(alert).toEqual({
      variant: "danger",
      title: "down",
      message: "down",
    });
  });
});

function buildAlerts() {
  return {
    subscribe: {
      success: { title: "ok", message: "ok" },
      invalidEmail: { title: "bad", message: "bad" },
      consentRequired: { title: "consent", message: "consent" },
      rateLimited: { title: "rate", message: "rate" },
      timeout: { title: "timeout", message: "timeout" },
      serviceUnavailable: { title: "down", message: "down" },
      serviceMisconfigured: { title: "mis", message: "mis" },
      listmonkError: { title: "lm", message: "lm" },
      unexpected: { title: "oops", message: "oops" },
    },
    confirm: {
      success: { title: "ok", message: "ok" },
      resent: { title: "resent", message: "resent" },
      missingContext: { title: "missing", message: "missing" },
      optinDelayed: { title: "delay", message: "delay" },
      rateLimited: { title: "rate", message: "rate" },
      timeout: { title: "timeout", message: "timeout" },
      serviceUnavailable: { title: "down", message: "down" },
      serviceMisconfigured: { title: "mis", message: "mis" },
      listmonkError: { title: "lm", message: "lm" },
      unexpected: { title: "oops", message: "oops" },
    },
    preferences: {
      preferencesSaved: { title: "saved", message: "saved" },
      missingSubscriber: { title: "missing", message: "missing" },
      topicsRequired: { title: "topics", message: "topics" },
      rateLimited: { title: "rate", message: "rate" },
      timeout: { title: "timeout", message: "timeout" },
      serviceUnavailable: { title: "down", message: "down" },
      serviceMisconfigured: { title: "mis", message: "mis" },
      listmonkError: { title: "lm", message: "lm" },
      unexpected: { title: "oops", message: "oops" },
    },
    unsubscribe: {
      unsubscribed: { title: "done", message: "done" },
      missingSubscriber: { title: "missing", message: "missing" },
      rateLimited: { title: "rate", message: "rate" },
      timeout: { title: "timeout", message: "timeout" },
      serviceUnavailable: { title: "down", message: "down" },
      serviceMisconfigured: { title: "mis", message: "mis" },
      listmonkError: { title: "lm", message: "lm" },
      unexpected: { title: "oops", message: "oops" },
    },
  };
}
