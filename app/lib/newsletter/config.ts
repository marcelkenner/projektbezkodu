import "server-only";

export interface NewsletterConfig {
  baseUrl: string;
  apiToken: string;
  listId: number;
  listUuid: string;
  timeoutMs: number;
}

// Build the config lazily to avoid throwing during module import / static build
let _cachedNewsletterConfig: NewsletterConfig | null = null;

function buildNewsletterConfig(): NewsletterConfig {
  const baseUrl = process.env.LISTMONK_BASE_URL;
  const apiToken = process.env.LISTMONK_API_TOKEN;
  const listId = Number(process.env.LISTMONK_LIST_ID);
  const listUuid = process.env.LISTMONK_LIST_UUID;
  const timeoutMs = Number(process.env.LISTMONK_TIMEOUT_MS ?? 10000);

  if (!baseUrl) {
    throw new Error("Missing LISTMONK_BASE_URL");
  }
  if (!apiToken) {
    throw new Error("Missing LISTMONK_API_TOKEN");
  }
  if (!Number.isFinite(listId)) {
    throw new Error("Missing LISTMONK_LIST_ID");
  }
  if (!listUuid) {
    throw new Error("Missing LISTMONK_LIST_UUID");
  }

  return {
    baseUrl: baseUrl.replace(/\/+$/, ""),
    apiToken,
    listId,
    listUuid,
    timeoutMs,
  };
}

export function getNewsletterConfig(): NewsletterConfig {
  if (!_cachedNewsletterConfig) {
    _cachedNewsletterConfig = buildNewsletterConfig();
  }
  return _cachedNewsletterConfig;
}

export const NEWSLETTER_SUBSCRIBER_COOKIE = "pbk-newsletter-subscriber";
export const NEWSLETTER_RESEND_COOKIE = "pbk-newsletter-resend";
export const NEWSLETTER_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
export const NEWSLETTER_RESEND_COOLDOWN_SECONDS = 15;
