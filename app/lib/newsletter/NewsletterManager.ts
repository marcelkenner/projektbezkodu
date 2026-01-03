import "server-only";

import {
  NEWSLETTER_RESEND_COOLDOWN_SECONDS,
  getNewsletterConfig,
} from "@/app/lib/newsletter/config";
import {
  ListmonkClient,
  ListmonkError,
} from "@/app/lib/newsletter/ListmonkClient";
import {
  ListmonkSubscriber,
  NewsletterAttributes,
} from "@/app/lib/newsletter/types";

interface SubscribeInput {
  email: string;
  topics: string[];
  consentSource?: string;
}

export interface SubscribeResult {
  subscriber: ListmonkSubscriber;
  optInSent: boolean;
}

interface PreferencesInput {
  subscriberUuid: string;
  topics: string[];
}

interface UnsubscribeInput {
  subscriberUuid: string;
  feedback?: string;
}

export interface NewsletterListmonkClient {
  findSubscriberByEmail(email: string): Promise<ListmonkSubscriber | null>;
  findSubscriberByUuid(uuid: string): Promise<ListmonkSubscriber | null>;
  createSubscriber(input: {
    email: string;
    name: string;
    status: "enabled" | "blocklisted";
    lists: number[];
    attribs?: Record<string, unknown>;
  }): Promise<ListmonkSubscriber>;
  updateSubscriber(
    id: number,
    input: {
      email: string;
      name: string;
      status: "enabled" | "blocklisted";
      lists: number[];
      attribs?: Record<string, unknown>;
    },
  ): Promise<ListmonkSubscriber>;
  sendOptIn(subscriberId: number): Promise<void>;
  mutateLists(input: {
    ids: number[];
    action: "add" | "remove" | "unsubscribe";
    target_list_ids: number[];
    status?: "confirmed" | "unconfirmed" | "unsubscribed";
  }): Promise<void>;
}

export class NewsletterManager {
  constructor(
    private readonly config = getNewsletterConfig(),
    private readonly client: NewsletterListmonkClient = new ListmonkClient(
      config,
    ),
  ) {}

  async subscribe(input: SubscribeInput): Promise<SubscribeResult> {
    const email = this.normalizeEmail(input.email);
    const name = email.split("@")[0];
    const consentTimestamp = new Date().toISOString();
    const topics = input.topics;

    let subscriber = await this.safeFindSubscriberByEmail(email);

    if (!subscriber) {
      subscriber = await this.createOrRecoverSubscriber({
        email,
        name,
        consentTimestamp,
        topics,
        consentSource: input.consentSource ?? "website",
      });
    } else {
      await this.ensureListSubscription(subscriber);
      const updatedAttribs = this.mergeAttributes(
        subscriber.attribs,
        this.buildNewsletterAttributes({
          topics,
          lastConsentAt: consentTimestamp,
          lastConsentSource: input.consentSource ?? "website",
        }),
      );

      subscriber = await this.client.updateSubscriber(subscriber.id, {
        email: subscriber.email,
        name: subscriber.name ?? subscriber.email,
        status: subscriber.status,
        lists: this.collectListIds(subscriber, true),
        attribs: updatedAttribs,
      });
    }

    const optInSent = await this.safeSendOptIn(subscriber.id);
    return { subscriber, optInSent };
  }

  async resendOptIn(subscriberId: number): Promise<void> {
    await this.client.sendOptIn(subscriberId);
  }

  async updatePreferences(input: PreferencesInput): Promise<void> {
    const subscriber = await this.requireSubscriber(input.subscriberUuid);
    const attributes = this.mergeAttributes(
      subscriber.attribs,
      this.buildNewsletterAttributes({
        topics: input.topics,
        lastPreferencesUpdateAt: new Date().toISOString(),
      }),
    );

    await this.client.updateSubscriber(subscriber.id, {
      email: subscriber.email,
      name: subscriber.name ?? subscriber.email,
      status: subscriber.status,
      lists: this.collectListIds(subscriber, true),
      attribs: attributes,
    });
  }

  async unsubscribe(input: UnsubscribeInput): Promise<void> {
    const subscriber = await this.requireSubscriber(input.subscriberUuid);
    const attributes = this.mergeAttributes(
      subscriber.attribs,
      this.buildNewsletterAttributes({
        lastFeedback: input.feedback
          ? { comment: input.feedback, recordedAt: new Date().toISOString() }
          : undefined,
      }),
    );

    await this.client.mutateLists({
      ids: [subscriber.id],
      action: "unsubscribe",
      target_list_ids: [this.config.listId],
      status: "unsubscribed",
    });

    await this.client.updateSubscriber(subscriber.id, {
      email: subscriber.email,
      name: subscriber.name ?? subscriber.email,
      status: subscriber.status,
      lists: this.collectListIds(subscriber, false),
      attribs: attributes,
    });
  }

  private mergeAttributes(
    existing: Record<string, unknown> | null,
    updates: NewsletterAttributes,
  ): Record<string, unknown> {
    const base =
      typeof existing === "object" && existing !== null ? existing : {};
    const newsletter = (base.newsletter ?? {}) as NewsletterAttributes;

    return {
      ...base,
      newsletter: {
        ...newsletter,
        ...updates,
      },
    };
  }

  private buildNewsletterAttributes(
    attrs: NewsletterAttributes,
  ): NewsletterAttributes {
    return Object.fromEntries(
      Object.entries(attrs).filter(([, value]) => value !== undefined),
    ) as NewsletterAttributes;
  }

  private collectListIds(
    subscriber: ListmonkSubscriber,
    ensurePrimary: boolean,
  ): number[] {
    const ids = new Set(subscriber.lists.map((list) => list.id));
    if (ensurePrimary) {
      ids.add(this.config.listId);
    }
    return Array.from(ids);
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private async safeFindSubscriberByEmail(
    email: string,
  ): Promise<ListmonkSubscriber | null> {
    try {
      return (await this.client.findSubscriberByEmail(email)) ?? null;
    } catch {
      return null;
    }
  }

  private async createOrRecoverSubscriber({
    email,
    name,
    consentTimestamp,
    topics,
    consentSource,
  }: {
    email: string;
    name: string;
    consentTimestamp: string;
    topics: string[];
    consentSource: string;
  }): Promise<ListmonkSubscriber> {
    try {
      return await this.client.createSubscriber({
        email,
        name,
        status: "enabled",
        lists: [this.config.listId],
        attribs: this.mergeAttributes(
          null,
          this.buildNewsletterAttributes({
            topics,
            lastConsentAt: consentTimestamp,
            lastConsentSource: consentSource,
          }),
        ),
      });
    } catch (error) {
      if (!this.isEmailConflictError(error)) {
        throw error;
      }
      const recovered = await this.client.findSubscriberByEmail(email);
      if (!recovered) {
        throw error;
      }
      return recovered;
    }
  }

  private isEmailConflictError(error: unknown): boolean {
    if (!(error instanceof ListmonkError)) {
      return false;
    }
    if (error.status === 409) {
      return true;
    }
    if (error.status !== 400) {
      return false;
    }
    const message = error.message.toLowerCase();
    return (
      message.includes("already") ||
      message.includes("exists") ||
      message.includes("duplicate") ||
      message.includes("unique")
    );
  }

  private async safeSendOptIn(subscriberId: number): Promise<boolean> {
    try {
      await this.client.sendOptIn(subscriberId);
      return true;
    } catch {
      return false;
    }
  }

  private async requireSubscriber(uuid: string): Promise<ListmonkSubscriber> {
    const subscriber = await this.client.findSubscriberByUuid(uuid);
    if (!subscriber) {
      throw new ListmonkError("Subscriber not found", 404);
    }
    return subscriber;
  }

  private async ensureListSubscription(
    subscriber: ListmonkSubscriber,
  ): Promise<void> {
    const membership = subscriber.lists.find(
      (list) => list.id === this.config.listId,
    );

    if (!membership || membership.subscription_status === "unsubscribed") {
      await this.client.mutateLists({
        ids: [subscriber.id],
        action: "add",
        target_list_ids: [this.config.listId],
        status: "unconfirmed",
      });
    }
  }
}

export const DEFAULT_NEWSLETTER_TOPICS = [
  "pref-seo",
  "pref-webflow",
  "pref-framer",
  "pref-automation",
] as const;

export type DefaultNewsletterTopic = (typeof DEFAULT_NEWSLETTER_TOPICS)[number];

export function getDefaultTopics(): string[] {
  return [...DEFAULT_NEWSLETTER_TOPICS];
}

export function getResendCooldownSeconds(): number {
  return NEWSLETTER_RESEND_COOLDOWN_SECONDS;
}
