import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getCopy } from "@/app/lib/copy";
import styles from "./../newsletter.module.css";
import { ResendButton } from "../ResendButton";
import { Alert } from "@/app/ui";
import {
  buildResendCookieOptions,
  buildSubscriberCookieOptions,
  parseResendCookie,
  parseSubscriberCookie,
} from "@/app/lib/newsletter/cookies";
import { getResendCooldownSeconds } from "@/app/lib/newsletter/NewsletterManager";
import { SearchParamParser } from "@/app/lib/url/SearchParamParser";
import { NewsletterAlertResolver } from "@/app/(marketing)/newsletter/NewsletterAlertResolver";

const copy = getCopy("newsletter");

export const metadata: Metadata = {
  title: copy.confirm.seo.title,
  description: copy.confirm.seo.description,
  alternates: {
    canonical: copy.confirm.seo.canonical,
  },
  robots: {
    index: false,
    follow: true,
  },
};

type ConfirmSearchParams = Record<string, string | string[] | undefined>;

export default async function NewsletterConfirmPage({
  searchParams,
}: {
  searchParams?: Promise<ConfirmSearchParams>;
}) {
  const cookieStore = await cookies();
  const subscriberCookie = buildSubscriberCookieOptions();
  const subscriber = parseSubscriberCookie(
    cookieStore.get(subscriberCookie.name)?.value,
  );
  const resendCookie = buildResendCookieOptions();
  const resend = parseResendCookie(cookieStore.get(resendCookie.name)?.value);
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const parser = new SearchParamParser(resolvedSearchParams);
  const resolver = new NewsletterAlertResolver({
    subscribe: copy.base.alerts,
    confirm: copy.confirm.alerts,
    preferences: copy.preferences.alerts,
    unsubscribe: copy.unsubscribe.alerts,
  });
  const alert = resolver.resolveConfirm(parser);

  return (
    <section className={styles.newsletterPage} id="content">
      <div className={`pbk-container ${styles.newsletterPage__card}`}>
        <header className="pbk-stack pbk-stack--tight">
          <h1>{copy.confirm.hero.title}</h1>
          <p>{copy.confirm.hero.intro}</p>
        </header>
        {alert ? (
          <Alert variant={alert.variant} title={alert.title}>
            {alert.message}
          </Alert>
        ) : null}
        <div className={styles.newsletterPage__actions}>
          <ResendButton
            label={copy.confirm.resend.label}
            waitingLabel={copy.confirm.resend.waitingLabel}
            cooldownSeconds={getResendCooldownSeconds()}
            subscriberId={subscriber?.id}
            initialSeconds={resend?.remainingSeconds ?? 0}
          />
          <span className={styles.newsletterPage__info}>
            {copy.confirm.resend.description}
          </span>
        </div>
      </div>
    </section>
  );
}
