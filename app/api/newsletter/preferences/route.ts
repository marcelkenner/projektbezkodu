import { NextResponse } from "next/server";
import { NewsletterManager } from "@/app/lib/newsletter/NewsletterManager";
import { ListmonkError } from "@/app/lib/newsletter/ListmonkClient";

const manager = new NewsletterManager();

export async function POST(request: Request) {
  const formData = await request.formData();
  const subscriberUuid = formData.get("subscriberUuid");
  const topics = formData
    .getAll("topics")
    .flatMap((topic) =>
      typeof topic === "string" && topic.length > 0 ? [topic] : [],
    );

  if (!subscriberUuid || typeof subscriberUuid !== "string") {
    return redirectWithParams(request.url, "/newsletter/preferencje", {
      error: "missing-subscriber",
    });
  }

  if (topics.length === 0) {
    return redirectWithParams(request.url, "/newsletter/preferencje", {
      error: "topics-required",
      subscriber: subscriberUuid,
    });
  }

  try {
    await manager.updatePreferences({
      subscriberUuid,
      topics,
    });
    return redirectWithParams(request.url, "/newsletter/preferencje", {
      status: "preferences-saved",
      subscriber: subscriberUuid,
    });
  } catch (error) {
    console.error("Newsletter preferences failed", error);
    return redirectWithParams(request.url, "/newsletter/preferencje", {
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
