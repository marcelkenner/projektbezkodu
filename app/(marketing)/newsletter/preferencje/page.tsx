import type { Metadata } from "next";
import { Button, CheckboxField } from "@/app/ui";
import { getCopy } from "@/app/lib/copy";
import { SearchParamParser } from "@/app/lib/url/SearchParamParser";
import styles from "./../newsletter.module.css";

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

type PreferencesSearchParams = Record<string, string | string[] | undefined>;

export default async function NewsletterPreferencesPage({
  searchParams,
}: {
  searchParams?: Promise<PreferencesSearchParams>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const parser = new SearchParamParser(resolvedSearchParams);
  const subscriberUuid = parser.getSingle("subscriber");
  const alert = resolveAlert(parser);
  const formDisabled = !subscriberUuid;

  return (
    <section className={styles.newsletterPage} id="content">
      <div className={`pbk-container ${styles.newsletterPage__card}`}>
        <header className="pbk-stack pbk-stack--tight">
          <h1>{copy.preferences.hero.title}</h1>
          <p>{copy.preferences.hero.intro}</p>
        </header>
        <form
          className={styles.newsletterPage__form}
          action="/api/newsletter/preferences"
          method="post"
        >
          <input
            type="hidden"
            name="subscriberUuid"
            value={subscriberUuid ?? ""}
          />
          <fieldset className={styles.newsletterPage__topics}>
            <legend className="sr-only">Wybierz tematy newslettera</legend>
            {copy.preferences.topics.map((topic) => (
              <div key={topic.id} className={styles.newsletterPage__topic}>
                <CheckboxField
                  id={topic.id}
                  name="topics"
                  value={topic.id}
                  label={topic.label}
                  disabled={formDisabled}
                />
                <span className={styles.newsletterPage__info}>
                  {topic.description}
                </span>
              </div>
            ))}
          </fieldset>
          <Button type="submit" disabled={formDisabled}>
            {copy.preferences.submitLabel}
          </Button>
          <p
            role="status"
            aria-live="polite"
            className={styles.newsletterPage__info}
          >
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

function resolveAlert(parser: SearchParamParser): string | null {
  const status = parser.getSingle("status");
  const error = parser.getSingle("error");

  if (!status && !error) {
    return null;
  }

  if (status === "preferences-saved") {
    return "Twoje preferencje zostały zaktualizowane.";
  }
  switch (error) {
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
