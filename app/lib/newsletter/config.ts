import "server-only";

import { NewsletterConfigError } from "@/app/lib/newsletter/NewsletterConfigError";

export interface NewsletterConfig {
  baseUrl: string;
  apiToken: string;
  listId: number;
  listUuid: string;
  timeoutMs: number;
  retryAttempts: number;
  retryMinDelayMs: number;
  retryMaxDelayMs: number;
}

// Build the config lazily to avoid throwing during module import / static build
let _cachedNewsletterConfig: NewsletterConfig | null = null;

function buildNewsletterConfig(): NewsletterConfig {
  const baseUrl = process.env.LISTMONK_BASE_URL;
  const apiToken = process.env.LISTMONK_API_TOKEN;
  const listId = Number(process.env.LISTMONK_LIST_ID);
  const listUuid = process.env.LISTMONK_LIST_UUID;
  const timeoutMs = Number(process.env.LISTMONK_TIMEOUT_MS ?? 10000);
  const retryAttempts = Number(process.env.LISTMONK_RETRY_ATTEMPTS ?? 2);
  const retryMinDelayMs = Number(process.env.LISTMONK_RETRY_MIN_DELAY_MS ?? 250);
  const retryMaxDelayMs = Number(process.env.LISTMONK_RETRY_MAX_DELAY_MS ?? 2000);

  if (!baseUrl) {
    throw new NewsletterConfigError(
      "LISTMONK_BASE_URL",
      "Missing LISTMONK_BASE_URL",
    );
  }
  if (!apiToken) {
    throw new NewsletterConfigError(
      "LISTMONK_API_TOKEN",
      "Missing LISTMONK_API_TOKEN",
    );
  }
  if (!Number.isFinite(listId) || listId <= 0) {
    throw new NewsletterConfigError("LISTMONK_LIST_ID", "Invalid LISTMONK_LIST_ID");
  }
  if (!listUuid) {
    throw new NewsletterConfigError(
      "LISTMONK_LIST_UUID",
      "Missing LISTMONK_LIST_UUID",
    );
  }

  const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
  try {
    const parsed = new URL(normalizedBaseUrl);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error("Invalid protocol");
    }
  } catch {
    throw new NewsletterConfigError("LISTMONK_BASE_URL", "Invalid LISTMONK_BASE_URL");
  }

  return {
    baseUrl: normalizedBaseUrl,
    apiToken,
    listId,
    listUuid,
    timeoutMs,
    retryAttempts: Number.isFinite(retryAttempts) ? retryAttempts : 2,
    retryMinDelayMs: Number.isFinite(retryMinDelayMs) ? retryMinDelayMs : 250,
    retryMaxDelayMs: Number.isFinite(retryMaxDelayMs) ? retryMaxDelayMs : 2000,
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
