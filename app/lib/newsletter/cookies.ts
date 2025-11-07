import {
  NEWSLETTER_COOKIE_MAX_AGE,
  NEWSLETTER_RESEND_COOLDOWN_SECONDS,
  NEWSLETTER_RESEND_COOKIE,
  NEWSLETTER_SUBSCRIBER_COOKIE,
} from "@/app/lib/newsletter/config";
import { NewsletterSubscriberSnapshot } from "@/app/lib/newsletter/types";

export function serializeSubscriberCookie(
  snapshot: NewsletterSubscriberSnapshot,
): string {
  return JSON.stringify(snapshot);
}

export function parseSubscriberCookie(
  value: string | undefined | null,
): NewsletterSubscriberSnapshot | null {
  if (!value) {
    return null;
  }
  try {
    const parsed = JSON.parse(value) as NewsletterSubscriberSnapshot;
    if (
      typeof parsed?.id === "number" &&
      typeof parsed?.uuid === "string" &&
      typeof parsed?.email === "string"
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function buildSubscriberCookieOptions() {
  const secure = process.env.NODE_ENV !== "development";
  return {
    name: NEWSLETTER_SUBSCRIBER_COOKIE,
    attributes: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure,
      path: "/",
      maxAge: NEWSLETTER_COOKIE_MAX_AGE,
    },
  };
}

export function buildResendCookieOptions() {
  const secure = process.env.NODE_ENV !== "development";
  return {
    name: NEWSLETTER_RESEND_COOKIE,
    attributes: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure,
      path: "/",
      maxAge: NEWSLETTER_COOKIE_MAX_AGE,
    },
  };
}

export function serializeResendCookie(timestamp: string): string {
  return timestamp;
}

export function parseResendCookie(value: string | undefined | null): {
  timestamp: string;
  remainingSeconds: number;
} | null {
  if (!value) {
    return null;
  }
  const recordedAt = Date.parse(value);
  if (Number.isNaN(recordedAt)) {
    return null;
  }
  const elapsedSeconds = Math.floor((Date.now() - recordedAt) / 1000);
  const remainingSeconds = Math.max(
    NEWSLETTER_RESEND_COOLDOWN_SECONDS - elapsedSeconds,
    0,
  );
  return {
    timestamp: value,
    remainingSeconds,
  };
}
