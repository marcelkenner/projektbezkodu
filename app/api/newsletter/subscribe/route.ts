import { NextResponse } from "next/server";
import {
  NewsletterManager,
  getDefaultTopics,
} from "@/app/lib/newsletter/NewsletterManager";
import { ListmonkError } from "@/app/lib/newsletter/ListmonkClient";
import {
  buildSubscriberCookieOptions,
  serializeSubscriberCookie,
} from "@/app/lib/newsletter/cookies";

const manager = new NewsletterManager();

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = formData.get("email");
  const consent = formData.get("consent");

  if (!email || typeof email !== "string") {
    return redirectWithParams(request.url, "/newsletter", {
      error: "invalid-email",
    });
  }

  if (!consent) {
    return redirectWithParams(request.url, "/newsletter", {
      error: "consent-required",
    });
  }

  try {
    const subscriber = await manager.subscribe({
      email,
      topics: getDefaultTopics(),
      consentSource: "projektbezkodu.pl",
    });

    const response = redirectWithParams(
      request.url,
      "/newsletter/potwierdz/",
      { status: "success" },
    );

    const cookie = buildSubscriberCookieOptions();
    response.cookies.set(
      cookie.name,
      serializeSubscriberCookie({
        id: subscriber.id,
        uuid: subscriber.uuid,
        email: subscriber.email,
      }),
      cookie.attributes,
    );

    return response;
  } catch (error) {
    console.error("Newsletter subscribe failed", error);
    return redirectWithParams(request.url, "/newsletter", {
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
    if (error.status === 422) {
      return "invalid-email";
    }
    return "listmonk-error";
  }
  return "unexpected";
}
