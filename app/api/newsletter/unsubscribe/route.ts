import { NextResponse } from "next/server";
import { NewsletterManager } from "@/app/lib/newsletter/NewsletterManager";
import { ListmonkError } from "@/app/lib/newsletter/ListmonkClient";

const manager = new NewsletterManager();

export async function POST(request: Request) {
  const formData = await request.formData();
  const subscriberUuid = formData.get("subscriberUuid");
  const feedback = formData.get("feedback");

  if (!subscriberUuid || typeof subscriberUuid !== "string") {
    return redirectWithParams(request.url, "/newsletter/wypisz", {
      error: "missing-subscriber",
    });
  }

  try {
    await manager.unsubscribe({
      subscriberUuid,
      feedback: typeof feedback === "string" ? feedback : undefined,
    });
    return redirectWithParams(request.url, "/newsletter/wypisz", {
      status: "unsubscribed",
      subscriber: subscriberUuid,
    });
  } catch (error) {
    console.error("Newsletter unsubscribe failed", error);
    return redirectWithParams(request.url, "/newsletter/wypisz", {
      error: mapError(error),
      subscriber: subscriberUuid,
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
  if (error instanceof ListmonkError && error.status === 404) {
    return "missing-subscriber";
  }
  return "unexpected";
}
