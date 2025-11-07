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

export class ListmonkError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly payload?: unknown,
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

  constructor(private readonly config = getNewsletterConfig()) {}

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

      const contentType = response.headers.get("content-type") ?? "";
      const payload = contentType.includes("application/json")
        ? await response.json()
        : null;

      if (!response.ok) {
        const message =
          (payload && typeof payload === "object" && "message" in payload
            ? String(payload.message)
            : `Listmonk request failed: ${response.status}`) ??
          "Request failed";
        throw new ListmonkError(message, response.status, payload ?? undefined);
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
        500,
      );
    } finally {
      clearTimeout(timeout);
    }
  }
}
