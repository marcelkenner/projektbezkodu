import type { Metadata } from "next";
import { getCopy } from "@/app/lib/copy";
import "./../newsletter.module.css";
import { NewsletterUnsubscribeForm } from "../NewsletterUnsubscribeForm";

const copy = getCopy("newsletter");

export const metadata: Metadata = {
  title: copy.unsubscribe.seo.title,
  description: copy.unsubscribe.seo.description,
  alternates: {
    canonical: copy.unsubscribe.seo.canonical,
  },
  robots: {
    index: false,
    follow: true,
  },
};

interface UnsubscribeSearchParams {
  subscriber?: string;
  status?: string;
  error?: string;
}

export default function NewsletterUnsubscribePage({
  searchParams,
}: {
  searchParams?: UnsubscribeSearchParams;
}) {
  const subscriberUuid =
    typeof searchParams?.subscriber === "string"
      ? searchParams.subscriber
      : undefined;
  const alert = resolveAlert(searchParams);

  return (
    <section className="newsletter-page" id="content">
      <div className="pbk-container newsletter-page__card">
        <header className="pbk-stack pbk-stack--tight">
          <h1>{copy.unsubscribe.hero.title}</h1>
          <p>{copy.unsubscribe.hero.intro}</p>
        </header>
        <NewsletterUnsubscribeForm
          copy={{
            feedbackField: copy.unsubscribe.feedbackField,
            submitLabel: copy.unsubscribe.submitLabel,
            confirmation: copy.unsubscribe.confirmation,
          }}
          subscriberUuid={subscriberUuid}
          alertMessage={alert}
        />
      </div>
    </section>
  );
}

function resolveAlert(searchParams?: UnsubscribeSearchParams): string | null {
  if (!searchParams) {
    return null;
  }
  if (searchParams.status === "unsubscribed") {
    return "Wypisaliśmy Cię z newslettera.";
  }
  switch (searchParams.error) {
    case "missing-subscriber":
      return "Ten link wygasł. Użyj ostatniego e-maila, aby się wypisać.";
    case "unexpected":
      return "Nie udało się wypisać. Spróbuj ponownie.";
    default:
      return null;
  }
}
