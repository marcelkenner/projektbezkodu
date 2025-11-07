import type { Metadata } from "next";
import { Button, CheckboxField } from "@/app/ui";
import { getCopy } from "@/app/lib/copy";
import "./../newsletter.module.css";

const copy = getCopy("newsletter");

export const metadata: Metadata = {
  title: copy.preferences.seo.title,
  description: copy.preferences.seo.description,
  alternates: {
    canonical: copy.preferences.seo.canonical,
  },
  robots: {
    index: false,
    follow: true,
  },
};

interface PreferencesSearchParams {
  subscriber?: string;
  status?: string;
  error?: string;
}

export default function NewsletterPreferencesPage({
  searchParams,
}: {
  searchParams?: PreferencesSearchParams;
}) {
  const subscriberUuid =
    typeof searchParams?.subscriber === "string"
      ? searchParams.subscriber
      : undefined;
  const alert = resolveAlert(searchParams);
  const formDisabled = !subscriberUuid;

  return (
    <section className="newsletter-page" id="content">
      <div className="pbk-container newsletter-page__card">
        <header className="pbk-stack pbk-stack--tight">
          <h1>{copy.preferences.hero.title}</h1>
          <p>{copy.preferences.hero.intro}</p>
        </header>
        <form
          className="newsletter-page__form"
          action="/api/newsletter/preferences"
          method="post"
        >
          <input
            type="hidden"
            name="subscriberUuid"
            value={subscriberUuid ?? ""}
          />
          <fieldset className="newsletter-page__topics">
            <legend className="sr-only">Wybierz tematy newslettera</legend>
            {copy.preferences.topics.map((topic) => (
              <div key={topic.id} className="newsletter-page__topic">
                <CheckboxField
                  id={topic.id}
                  name="topics"
                  value={topic.id}
                  label={topic.label}
                  disabled={formDisabled}
                />
                <span className="newsletter-page__info">
                  {topic.description}
                </span>
              </div>
            ))}
          </fieldset>
          <Button type="submit" disabled={formDisabled}>
            {copy.preferences.submitLabel}
          </Button>
          <p role="status" aria-live="polite" className="newsletter-page__info">
            {alert ??
              (formDisabled
                ? "Link z newslettera jest potrzebny, by zapisać preferencje."
                : "\u00A0")}
          </p>
        </form>
      </div>
    </section>
  );
}

function resolveAlert(searchParams?: PreferencesSearchParams): string | null {
  if (!searchParams) {
    return null;
  }
  if (searchParams.status === "preferences-saved") {
    return "Twoje preferencje zostały zaktualizowane.";
  }
  switch (searchParams.error) {
    case "missing-subscriber":
      return "Brakuje identyfikatora subskrybenta. Użyj linku z newslettera.";
    case "topics-required":
      return "Wybierz co najmniej jedną kategorię.";
    case "unexpected":
      return "Nie udało się zapisać preferencji. Spróbuj ponownie.";
    default:
      return null;
  }
}
