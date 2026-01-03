import { describe, expect, it } from "vitest";

import { ListmonkRetryPolicy } from "@/app/lib/newsletter/ListmonkRetryPolicy";

describe("ListmonkRetryPolicy", () => {
  it("does not retry past maxAttempts", () => {
    const policy = new ListmonkRetryPolicy();
    const decision = policy.decide({
      attempt: 2,
      maxAttempts: 2,
      status: 500,
      retryAfterSeconds: null,
      minDelayMs: 10,
      maxDelayMs: 100,
    });

    expect(decision.shouldRetry).toBe(false);
  });

  it("uses retry-after seconds for 429", () => {
    const policy = new ListmonkRetryPolicy();
    const decision = policy.decide({
      attempt: 0,
      maxAttempts: 2,
      status: 429,
      retryAfterSeconds: 2,
      minDelayMs: 10,
      maxDelayMs: 10_000,
    });

    expect(decision.shouldRetry).toBe(true);
    expect(decision.delayMs).toBe(2000);
  });
});

