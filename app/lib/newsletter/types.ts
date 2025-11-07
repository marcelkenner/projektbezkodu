export type SubscriberStatus = "enabled" | "blocklisted";

export interface ListmonkListSummary {
  id: number;
  uuid: string;
  name: string;
  subscription_status: "confirmed" | "unconfirmed" | "unsubscribed";
}

export interface ListmonkSubscriber {
  id: number;
  uuid: string;
  email: string;
  name: string | null;
  status: SubscriberStatus;
  attribs: Record<string, unknown> | null;
  lists: ListmonkListSummary[];
}

export interface ListmonkSubscriberResponse {
  data: ListmonkSubscriber;
}

export interface ListmonkListMutationResponse {
  data: boolean;
}

export interface ListmonkQueryResponse {
  data: {
    results: ListmonkSubscriber[];
    total: number;
    page: number;
    per_page: number;
  };
}

export interface CreateSubscriberPayload {
  email: string;
  name: string;
  status: SubscriberStatus;
  lists: number[];
  attribs?: Record<string, unknown>;
  preconfirm_subscriptions?: boolean;
}

export interface UpdateSubscriberPayload {
  email: string;
  name: string;
  status: SubscriberStatus;
  lists: number[];
  attribs?: Record<string, unknown>;
}

export interface SubscriberListMutationPayload {
  ids: number[];
  action: "add" | "remove" | "unsubscribe";
  target_list_ids: number[];
  status?: "confirmed" | "unconfirmed" | "unsubscribed";
}

export interface NewsletterSubscriberSnapshot {
  id: number;
  uuid: string;
  email: string;
}

export interface NewsletterAttributes {
  topics?: string[];
  lastConsentAt?: string;
  lastConsentSource?: string;
  lastPreferencesUpdateAt?: string;
  lastFeedback?: {
    comment: string;
    recordedAt: string;
  };
}
