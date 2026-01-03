import "server-only";

import {
  CreateSubscriberPayload,
  ListmonkListMutationResponse,
  ListmonkQueryResponse,
  ListmonkSubscriber,
  ListmonkSubscriberResponse,
  SubscriberListMutationPayload,
  UpdateSubscriberPayload,
} from "@/app/lib/newsletter/types";
import { getNewsletterConfig } from "@/app/lib/newsletter/config";
import { AsyncSleeper } from "@/app/lib/newsletter/AsyncSleeper";
import { ListmonkRetryPolicy } from "@/app/lib/newsletter/ListmonkRetryPolicy";

export class ListmonkError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly payload?: unknown,
    public readonly retryAfterSeconds?: number,
  ) {
    super(message);
    this.name = "ListmonkError";
  }
}

export class ListmonkClient {
  private readonly baseUrl = this.config.baseUrl;
  private readonly headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `token ${this.config.apiToken}`,
  };

  constructor(
    private readonly config = getNewsletterConfig(),
    private readonly retryPolicy = new ListmonkRetryPolicy(),
    private readonly sleeper = new AsyncSleeper(),
  ) {}

  async createSubscriber(
    payload: CreateSubscriberPayload,
  ): Promise<ListmonkSubscriber> {
    const response = await this.request<ListmonkSubscriberResponse>(
      "/api/subscribers",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
    return response.data;
  }

  async updateSubscriber(
    id: number,
    payload: UpdateSubscriberPayload,
  ): Promise<ListmonkSubscriber> {
    const response = await this.request<ListmonkSubscriberResponse>(
      `/api/subscribers/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
    );
    return response.data;
  }

  async findSubscriberByEmail(
    email: string,
  ): Promise<ListmonkSubscriber | null> {
    return this.querySingle(
      `subscribers.email ILIKE '${email.replace(/'/g, "''")}'`,
    );
  }

  async findSubscriberByUuid(uuid: string): Promise<ListmonkSubscriber | null> {
    return this.querySingle(`subscribers.uuid = '${uuid.replace(/'/g, "''")}'`);
  }

  async sendOptIn(subscriberId: number): Promise<void> {
    await this.request<ListmonkListMutationResponse>(
      `/api/subscribers/${subscriberId}/optin`,
      {
        method: "POST",
        body: "{}",
      },
    );
  }

  async mutateLists(payload: SubscriberListMutationPayload): Promise<void> {
    await this.request<ListmonkListMutationResponse>("/api/subscribers/lists", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  private async querySingle(query: string): Promise<ListmonkSubscriber | null> {
    const response = await this.request<ListmonkQueryResponse>(
      `/api/subscribers?per_page=1&page=1&query=${encodeURIComponent(query)}`,
    );
    return response.data.results.at(0) ?? null;
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const attempts = Math.max(0, this.config.retryAttempts);
    let attempt = 0;

    while (true) {
      try {
        return await this.requestOnce<T>(path, init);
      } catch (error) {
        const normalized =
          error instanceof ListmonkError
            ? error
            : new ListmonkError(
                error instanceof Error ? error.message : "Unknown Listmonk error",
                503,
              );
        const retryAfterSeconds = this.readRetryAfterSeconds(
          normalized.retryAfterSeconds,
        );
        const { shouldRetry, delayMs } = this.retryPolicy.decide({
          attempt,
          maxAttempts: attempts,
          status: normalized.status,
          retryAfterSeconds,
          minDelayMs: this.config.retryMinDelayMs,
          maxDelayMs: this.config.retryMaxDelayMs,
        });
        if (!shouldRetry) {
          throw normalized;
        }
        await this.sleeper.sleep(delayMs);
        attempt += 1;
      }
    }
  }

  private async requestOnce<T>(path: string, init?: RequestInit): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        ...init,
        headers: {
          ...this.headers,
          ...(init?.headers ?? {}),
        },
        cache: "no-store",
        signal: controller.signal,
      });

      const payload = await this.readResponsePayload(response);
      const retryAfterSeconds = this.readRetryAfterHeaderSeconds(response);
      if (!response.ok) {
        throw new ListmonkError(
          this.extractMessage(payload, response.status),
          response.status,
          payload ?? undefined,
          retryAfterSeconds,
        );
      }

      if (!payload) {
        throw new ListmonkError(
          "Listmonk returned an unexpected response",
          502,
          payload ?? undefined,
        );
      }

      return payload as T;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new ListmonkError("Listmonk request timed out", 408);
      }
      if (error instanceof ListmonkError) {
        throw error;
      }
      throw new ListmonkError(
        error instanceof Error ? error.message : "Unknown Listmonk error",
        503,
      );
    } finally {
      clearTimeout(timeout);
    }
  }

  private async readResponsePayload(response: Response): Promise<unknown | null> {
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return null;
    }
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  private extractMessage(payload: unknown, status: number): string {
    const candidate = this.readPayloadMessage(payload);
    if (candidate) {
      return candidate;
    }
    return `Listmonk request failed: ${status}`;
  }

  private readPayloadMessage(payload: unknown): string | null {
    if (!payload || typeof payload !== "object") {
      return null;
    }
    const value = payload as Record<string, unknown>;
    const direct = value.message ?? value.error;
    if (typeof direct === "string" && direct.trim().length) {
      return direct.trim();
    }
    if (typeof value.data === "object" && value.data !== null) {
      const nested = (value.data as Record<string, unknown>).message;
      if (typeof nested === "string" && nested.trim().length) {
        return nested.trim();
      }
    }
    return null;
  }

  private readRetryAfterSeconds(value: number | undefined): number | null {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      return null;
    }
    return value;
  }

  private readRetryAfterHeaderSeconds(response: Response): number | undefined {
    const header = response.headers.get("retry-after");
    if (!header) {
      return undefined;
    }
    const parsed = Number(header);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
}
