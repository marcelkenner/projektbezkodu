import {
  NewsletterManager,
  getDefaultTopics,
} from "@/app/lib/newsletter/NewsletterManager";
import {
  buildSubscriberCookieOptions,
  serializeSubscriberCookie,
} from "@/app/lib/newsletter/cookies";
import { NewsletterRedirector } from "@/app/api/newsletter/NewsletterRedirector";
import { NewsletterErrorMapper } from "@/app/api/newsletter/NewsletterErrorMapper";

const redirector = new NewsletterRedirector();
const errorMapper = new NewsletterErrorMapper();

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

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
    const result = await manager.subscribe({
      email,
      topics: getDefaultTopics(),
      consentSource: "projektbezkodu.pl",
    });

    const response = redirector.redirect(
      request,
      "/newsletter/potwierdz/",
      result.optInSent
        ? { status: "success" }
        : { status: "success", warning: "optin-delayed" },
    );

    const cookie = buildSubscriberCookieOptions();
    response.cookies.set(
      cookie.name,
      serializeSubscriberCookie({
        id: result.subscriber.id,
        uuid: result.subscriber.uuid,
        email: result.subscriber.email,
      }),
      cookie.attributes,
    );

    return response;
  } catch (error) {
    console.error("Newsletter subscribe failed", error);
    return redirector.redirect(request, "/newsletter", {
      error: errorMapper.mapSubscribe(error),
    });
  }
}
