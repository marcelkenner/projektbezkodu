import type { Metadata } from "next";
import { getCopy } from "@/app/lib/copy";
import "./../newsletter.module.css";
import { NewsletterUnsubscribeForm } from "../NewsletterUnsubscribeForm";
import { SearchParamParser } from "@/app/lib/url/SearchParamParser";

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

type UnsubscribeSearchParams = Record<string, string | string[] | undefined>;

export default async function NewsletterUnsubscribePage({
  searchParams,
}: {
  searchParams?: Promise<UnsubscribeSearchParams>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const parser = new SearchParamParser(resolvedSearchParams);
  const subscriberUuid = parser.getSingle("subscriber");
  const alert = resolveAlert(parser);

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

function resolveAlert(parser: SearchParamParser): string | null {
  const status = parser.getSingle("status");
  const error = parser.getSingle("error");

  if (!status && !error) {
    return null;
  }

  if (status === "unsubscribed") {
    return "Wypisaliśmy Cię z newslettera.";
  }
  switch (error) {
    case "missing-subscriber":
      return "Ten link wygasł. Użyj ostatniego e-maila, aby się wypisać.";
    case "unexpected":
      return "Nie udało się wypisać. Spróbuj ponownie.";
    default:
      return null;
  }
}
