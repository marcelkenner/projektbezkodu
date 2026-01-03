import {
  NewsletterManager,
  getDefaultTopics,
} from "@/app/lib/newsletter/NewsletterManager";
import { ListmonkError } from "@/app/lib/newsletter/ListmonkClient";
import {
  buildSubscriberCookieOptions,
  serializeSubscriberCookie,
} from "@/app/lib/newsletter/cookies";
import { NewsletterRedirector } from "@/app/api/newsletter/NewsletterRedirector";

const redirector = new NewsletterRedirector();

export async function POST(request: Request) {
  // instantiate manager lazily inside the handler to avoid importing
  // and validating env at module initialization time (which breaks
  // Next.js build / page-data collection when env isn't set)
  const manager = new NewsletterManager();

  const formData = await request.formData();
  const email = formData.get("email");
  const consent = formData.get("consent");

  if (!email || typeof email !== "string") {
    return redirector.redirect(request, "/newsletter", {
      error: "invalid-email",
    });
  }

  if (!consent) {
    return redirector.redirect(request, "/newsletter", {
      error: "consent-required",
    });
  }

  try {
    const subscriber = await manager.subscribe({
      email,
      topics: getDefaultTopics(),
      consentSource: "projektbezkodu.pl",
    });

    const response = redirector.redirect(request, "/newsletter/potwierdz/", {
      status: "success",
    });

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
    return redirector.redirect(request, "/newsletter", {
      error: mapError(error),
    });
  }
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
