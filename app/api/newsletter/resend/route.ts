import { cookies } from "next/headers";
import { NewsletterManager } from "@/app/lib/newsletter/NewsletterManager";
import {
  buildResendCookieOptions,
  buildSubscriberCookieOptions,
  parseSubscriberCookie,
  serializeResendCookie,
} from "@/app/lib/newsletter/cookies";
import { NewsletterRedirector } from "@/app/api/newsletter/NewsletterRedirector";
import { NewsletterErrorMapper } from "@/app/api/newsletter/NewsletterErrorMapper";

const redirector = new NewsletterRedirector();
const errorMapper = new NewsletterErrorMapper();

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

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
      error: errorMapper.mapResend(error),
    });
  }
}
