import type { Metadata } from "next";
import { getCopy } from "@/app/lib/copy";
import styles from "./../newsletter.module.css";
import { NewsletterUnsubscribeForm } from "../NewsletterUnsubscribeForm";
import { SearchParamParser } from "@/app/lib/url/SearchParamParser";
import { NewsletterAlertResolver } from "@/app/(marketing)/newsletter/NewsletterAlertResolver";

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
  const resolver = new NewsletterAlertResolver({
    subscribe: copy.base.alerts,
    confirm: copy.confirm.alerts,
    preferences: copy.preferences.alerts,
    unsubscribe: copy.unsubscribe.alerts,
  });
  const alert = resolver.resolveUnsubscribe(parser);

  return (
    <section className={styles.newsletterPage} id="content">
      <div className={`pbk-container ${styles.newsletterPage__card}`}>
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
          alert={alert}
        />
      </div>
    </section>
  );
}
