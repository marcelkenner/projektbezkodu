import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getCopy } from "@/app/lib/copy";
import "./../newsletter.module.css";
import { ResendButton } from "../ResendButton";
import {
  buildResendCookieOptions,
  buildSubscriberCookieOptions,
  parseResendCookie,
  parseSubscriberCookie,
} from "@/app/lib/newsletter/cookies";
import { getResendCooldownSeconds } from "@/app/lib/newsletter/NewsletterManager";
import { SearchParamParser } from "@/app/lib/url/SearchParamParser";

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
  const alert = resolveAlert(parser);

  return (
    <section className="newsletter-page" id="content">
      <div className="pbk-container newsletter-page__card">
        <header className="pbk-stack pbk-stack--tight">
          <h1>{copy.confirm.hero.title}</h1>
          <p>{copy.confirm.hero.intro}</p>
        </header>
        <div className="newsletter-page__actions">
          <ResendButton
            label={copy.confirm.resend.label}
            waitingLabel={copy.confirm.resend.waitingLabel}
            cooldownSeconds={getResendCooldownSeconds()}
            subscriberId={subscriber?.id}
            initialSeconds={resend?.remainingSeconds ?? 0}
          />
          <span className="newsletter-page__info">
            {copy.confirm.resend.description}
          </span>
          <p role="status" aria-live="polite" className="newsletter-page__info">
            {alert ?? "\u00A0"}
          </p>
        </div>
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

  if (status === "success") {
    return "Prośba o potwierdzenie została wysłana.";
  }
  if (status === "resent") {
    return "Wysłaliśmy wiadomość ponownie.";
  }
  switch (error) {
    case "missing-context":
      return "Nie odnaleźliśmy Twojego adresu. Zapisz się ponownie.";
    case "listmonk-error":
      return "Nie udało się ponownie wysłać wiadomości.";
    default:
      return null;
  }
}
