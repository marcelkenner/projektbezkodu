import { NewsletterManager } from "@/app/lib/newsletter/NewsletterManager";
import { NewsletterRedirector } from "@/app/api/newsletter/NewsletterRedirector";
import { NewsletterErrorMapper } from "@/app/api/newsletter/NewsletterErrorMapper";

const redirector = new NewsletterRedirector();
const errorMapper = new NewsletterErrorMapper();

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function POST(request: Request) {
  // instantiate lazily inside the handler to avoid env validation at import time
  const manager = new NewsletterManager();
  const formData = await request.formData();
  const subscriberUuid = formData.get("subscriberUuid");
  const feedback = formData.get("feedback");

  if (!subscriberUuid || typeof subscriberUuid !== "string") {
    return redirector.redirect(request, "/newsletter/wypisz", {
      error: "missing-subscriber",
    });
  }

  try {
    await manager.unsubscribe({
      subscriberUuid,
      feedback: typeof feedback === "string" ? feedback : undefined,
    });
    return redirector.redirect(request, "/newsletter/wypisz", {
      status: "unsubscribed",
      subscriber: subscriberUuid,
    });
  } catch (error) {
    console.error("Newsletter unsubscribe failed", error);
    return redirector.redirect(request, "/newsletter/wypisz", {
      error: errorMapper.mapUnsubscribe(error),
      subscriber: subscriberUuid,
    });
  }
}
