import { cookies } from "next/headers";
import { NewsletterManager } from "@/app/lib/newsletter/NewsletterManager";
import { ListmonkError } from "@/app/lib/newsletter/ListmonkClient";
import {
  buildResendCookieOptions,
  buildSubscriberCookieOptions,
  parseSubscriberCookie,
  serializeResendCookie,
} from "@/app/lib/newsletter/cookies";
import { NewsletterRedirector } from "@/app/api/newsletter/NewsletterRedirector";

const redirector = new NewsletterRedirector();

export async function POST(request: Request) {
  // instantiate lazily to avoid evaluating env at module import time
  const manager = new NewsletterManager();

  const store = await cookies();
  const subscriberCookie = buildSubscriberCookieOptions();
  const subscriber = parseSubscriberCookie(
    store.get(subscriberCookie.name)?.value,
  );

  if (!subscriber) {
    return redirector.redirect(request, "/newsletter/potwierdz/", {
      error: "missing-context",
    });
  }

  try {
    await manager.resendOptIn(subscriber.id);
    const response = redirector.redirect(request, "/newsletter/potwierdz/", {
      status: "resent",
    });
    const resendCookie = buildResendCookieOptions();
    response.cookies.set(
      resendCookie.name,
      serializeResendCookie(new Date().toISOString()),
      resendCookie.attributes,
    );
    return response;
  } catch (error) {
    console.error("Newsletter resend failed", error);
    return redirector.redirect(request, "/newsletter/potwierdz/", {
      error: mapError(error),
    });
  }
}

function mapError(error: unknown): string {
  if (error instanceof ListmonkError) {
    return error.status === 404 ? "missing-context" : "listmonk-error";
  }
  return "unexpected";
}
