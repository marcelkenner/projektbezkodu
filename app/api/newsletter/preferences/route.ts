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
  const topics = formData
    .getAll("topics")
    .flatMap((topic) =>
      typeof topic === "string" && topic.length > 0 ? [topic] : [],
    );

  if (!subscriberUuid || typeof subscriberUuid !== "string") {
    return redirector.redirect(request, "/newsletter/preferencje", {
      error: "missing-subscriber",
    });
  }

  if (topics.length === 0) {
    return redirector.redirect(request, "/newsletter/preferencje", {
      error: "topics-required",
      subscriber: subscriberUuid,
    });
  }

  try {
    await manager.updatePreferences({
      subscriberUuid,
      topics,
    });
    return redirector.redirect(request, "/newsletter/preferencje", {
      status: "preferences-saved",
      subscriber: subscriberUuid,
    });
  } catch (error) {
    console.error("Newsletter preferences failed", error);
    return redirector.redirect(request, "/newsletter/preferencje", {
      error: errorMapper.mapPreferences(error),
      subscriber: subscriberUuid,
    });
  }
}
