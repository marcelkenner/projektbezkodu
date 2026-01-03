import { afterEach, describe, expect, it, vi } from "vitest";

import { ListmonkClient } from "@/app/lib/newsletter/ListmonkClient";
import { AsyncSleeper } from "@/app/lib/newsletter/AsyncSleeper";
import { ListmonkRetryPolicy } from "@/app/lib/newsletter/ListmonkRetryPolicy";

class ImmediateSleeper extends AsyncSleeper {
  override sleep(): Promise<void> {
    return Promise.resolve();
  }
}

describe("ListmonkClient retries", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("retries once on 500 and succeeds", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ message: "temporary" }), {
          status: 500,
          headers: { "content-type": "application/json" },
        }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: {
              results: [],
              total: 0,
              page: 1,
              per_page: 1,
            },
          }),
          {
          status: 200,
          headers: { "content-type": "application/json" },
          },
        ),
      );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = fetchMock;

    const client = new ListmonkClient(
      {
        baseUrl: "https://listmonk.test",
        apiToken: "token",
        listId: 1,
        listUuid: "uuid",
        timeoutMs: 5000,
        retryAttempts: 1,
        retryMinDelayMs: 0,
        retryMaxDelayMs: 0,
      },
      new ListmonkRetryPolicy(),
      new ImmediateSleeper(),
    );

    const result = await client.findSubscriberByEmail("test@example.com");

    expect(result).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
