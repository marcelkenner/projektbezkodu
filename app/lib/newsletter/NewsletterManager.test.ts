import { describe, expect, it } from "vitest";

import { NewsletterManager } from "@/app/lib/newsletter/NewsletterManager";
import type { ListmonkSubscriber } from "@/app/lib/newsletter/types";
import { ListmonkError } from "@/app/lib/newsletter/ListmonkClient";

function buildSubscriber(overrides: Partial<ListmonkSubscriber> = {}): ListmonkSubscriber {
  return {
    id: 1,
    uuid: "uuid",
    email: "test@example.com",
    name: "test",
    status: "enabled",
    attribs: null,
    lists: [],
    ...overrides,
  };
}

describe("NewsletterManager.subscribe", () => {
  it("returns optInSent=false when opt-in dispatch fails", async () => {
    const subscriber = buildSubscriber();
    const manager = new NewsletterManager(
      {
        baseUrl: "https://listmonk.test",
        apiToken: "token",
        listId: 1,
        listUuid: "uuid",
        timeoutMs: 5000,
        retryAttempts: 0,
        retryMinDelayMs: 0,
        retryMaxDelayMs: 0,
      },
      {
        findSubscriberByEmail: async () => null,
        findSubscriberByUuid: async () => null,
        createSubscriber: async () => subscriber,
        updateSubscriber: async () => subscriber,
        sendOptIn: async () => {
          throw new Error("down");
        },
        mutateLists: async () => undefined,
      },
    );

    const result = await manager.subscribe({
      email: "test@example.com",
      topics: ["pref-seo"],
      consentSource: "test",
    });

    expect(result.subscriber).toEqual(subscriber);
    expect(result.optInSent).toBe(false);
  });

  it("recovers when createSubscriber reports conflict", async () => {
    const subscriber = buildSubscriber({ id: 7 });
    let reads = 0;

    const manager = new NewsletterManager(
      {
        baseUrl: "https://listmonk.test",
        apiToken: "token",
        listId: 1,
        listUuid: "uuid",
        timeoutMs: 5000,
        retryAttempts: 0,
        retryMinDelayMs: 0,
        retryMaxDelayMs: 0,
      },
      {
        findSubscriberByEmail: async () => {
          reads += 1;
          return reads === 1 ? null : subscriber;
        },
        findSubscriberByUuid: async () => null,
        createSubscriber: async () => {
          throw new ListmonkError("already exists", 409);
        },
        updateSubscriber: async () => subscriber,
        sendOptIn: async () => undefined,
        mutateLists: async () => undefined,
      },
    );

    const result = await manager.subscribe({
      email: "test@example.com",
      topics: ["pref-seo"],
      consentSource: "test",
    });

    expect(result.subscriber.id).toBe(7);
    expect(result.optInSent).toBe(true);
  });
});

