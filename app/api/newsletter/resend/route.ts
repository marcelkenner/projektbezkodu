import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { NewsletterManager } from "@/app/lib/newsletter/NewsletterManager";
import { ListmonkError } from "@/app/lib/newsletter/ListmonkClient";
import {
  buildResendCookieOptions,
  buildSubscriberCookieOptions,
  parseSubscriberCookie,
  serializeResendCookie,
} from "@/app/lib/newsletter/cookies";

const manager = new NewsletterManager();

export async function POST(request: Request) {
  const store = await cookies();
  const subscriberCookie = buildSubscriberCookieOptions();
  const subscriber = parseSubscriberCookie(
    store.get(subscriberCookie.name)?.value,
  );

  if (!subscriber) {
    return redirectWithParams(request.url, "/newsletter/potwierdz/", {
      error: "missing-context",
    });
  }

  try {
    await manager.resendOptIn(subscriber.id);
    const response = redirectWithParams(request.url, "/newsletter/potwierdz/", {
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
    return redirectWithParams(request.url, "/newsletter/potwierdz/", {
      error: mapError(error),
    });
  }
}

function redirectWithParams(
  origin: string,
  pathname: string,
  params: Record<string, string>,
) {
  const target = new URL(pathname, origin);
  Object.entries(params).forEach(([key, value]) =>
    target.searchParams.set(key, value),
  );
  return NextResponse.redirect(target);
}

function mapError(error: unknown): string {
  if (error instanceof ListmonkError) {
    return error.status === 404 ? "missing-context" : "listmonk-error";
  }
  return "unexpected";
}
