import type { Metadata } from "next";
import { Alert, Button, TextField, CheckboxField } from "@/app/ui";
import { getCopy } from "@/app/lib/copy";
import { SearchParamParser } from "@/app/lib/url/SearchParamParser";
import styles from "./newsletter.module.css";
import { NewsletterAlertResolver } from "@/app/(marketing)/newsletter/NewsletterAlertResolver";

const copy = getCopy("newsletter");

export const metadata: Metadata = {
  title: copy.base.seo.title,
  description: copy.base.seo.description,
  alternates: {
    canonical: copy.base.seo.canonical,
  },
};

type NewsletterPageSearchParams = Record<string, string | string[] | undefined>;

export default async function NewsletterLandingPage({
  searchParams,
}: {
  searchParams?: Promise<NewsletterPageSearchParams>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const parser = new SearchParamParser(resolvedSearchParams);
  const resolver = new NewsletterAlertResolver({
    subscribe: copy.base.alerts,
    confirm: copy.confirm.alerts,
    preferences: copy.preferences.alerts,
    unsubscribe: copy.unsubscribe.alerts,
  });
  const alert = resolver.resolveSubscribe(parser);

  return (
    <section className={styles.newsletterPage} id="content">
      <div className={`pbk-container ${styles.newsletterPage__card}`}>
        <header className="pbk-stack pbk-stack--tight">
          <h1>{copy.base.hero.title}</h1>
          <p>{copy.base.hero.intro}</p>
        </header>
        {alert ? (
          <Alert variant={alert.variant} title={alert.title}>
            {alert.message}
          </Alert>
        ) : null}
        <form
          className={styles.newsletterPage__form}
          action="/api/newsletter/subscribe"
          method="post"
        >
          <TextField
            id="newsletter-email"
            name="email"
            type="email"
            label={copy.base.form.emailLabel}
            placeholder={copy.base.form.emailPlaceholder}
            required
            autoComplete="email"
          />
          <CheckboxField
            id="newsletter-consent"
            name="consent"
            label={copy.base.form.consentLabel}
            required
          />
          <Button type="submit">{copy.base.hero.formCta}</Button>
          <p className={styles.newsletterPage__info}>{copy.base.form.helper}</p>
        </form>
      </div>
    </section>
  );
}
