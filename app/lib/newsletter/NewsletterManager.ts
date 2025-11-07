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

interface PreferencesInput {
  subscriberUuid: string;
  topics: string[];
}

interface UnsubscribeInput {
  subscriberUuid: string;
  feedback?: string;
}

export class NewsletterManager {
  private readonly config = getNewsletterConfig();
  private readonly client = new ListmonkClient(this.config);

  async subscribe(input: SubscribeInput): Promise<ListmonkSubscriber> {
    const email = this.normalizeEmail(input.email);
    const name = email.split("@")[0];
    const consentTimestamp = new Date().toISOString();
    const topics = input.topics;

    let subscriber = (await this.client.findSubscriberByEmail(email)) ?? null;

    if (!subscriber) {
      subscriber = await this.client.createSubscriber({
        email,
        name,
        status: "enabled",
        lists: [this.config.listId],
        attribs: this.mergeAttributes(
          null,
          this.buildNewsletterAttributes({
            topics,
            lastConsentAt: consentTimestamp,
            lastConsentSource: input.consentSource ?? "website",
          }),
        ),
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

    await this.client.sendOptIn(subscriber.id);
    return subscriber;
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
