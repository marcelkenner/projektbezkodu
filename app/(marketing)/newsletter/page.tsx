import type { Metadata } from "next";
import { Button, TextField, CheckboxField } from "@/app/ui";
import { getCopy } from "@/app/lib/copy";
import "./newsletter.module.css";

const copy = getCopy("newsletter");

export const metadata: Metadata = {
  title: copy.base.seo.title,
  description: copy.base.seo.description,
  alternates: {
    canonical: copy.base.seo.canonical,
  },
};

interface NewsletterPageSearchParams {
  error?: string;
  status?: string;
}

export default function NewsletterLandingPage({
  searchParams,
}: {
  searchParams?: NewsletterPageSearchParams;
}) {
  const alert = resolveAlert(searchParams);

  return (
    <section className="newsletter-page" id="content">
      <div className="pbk-container newsletter-page__card">
        <header className="pbk-stack pbk-stack--tight">
          <h1>{copy.base.hero.title}</h1>
          <p>{copy.base.hero.intro}</p>
        </header>
        <form
          className="newsletter-page__form"
          action="/api/newsletter/subscribe"
          method="post"
        >
          <TextField
            id="newsletter-email"
            name="email"
            type="email"
            label="E-mail"
            placeholder="mój@adres.pl"
            required
            autoComplete="email"
          />
          <CheckboxField
            id="newsletter-consent"
            name="consent"
            label="Wyrażam zgodę na otrzymywanie newslettera ProjektBezKodu."
            required
          />
          <Button type="submit">{copy.base.hero.formCta}</Button>
          <p className="newsletter-page__info">
            Zawsze możesz zaktualizować preferencje lub się wypisać jednym
            kliknięciem.
          </p>
          <p role="status" aria-live="polite" className="newsletter-page__info">
            {alert ?? "\u00A0"}
          </p>
        </form>
      </div>
    </section>
  );
}

function resolveAlert(
  searchParams?: NewsletterPageSearchParams,
): string | null {
  if (!searchParams) {
    return null;
  }
  if (searchParams.status === "success") {
    return "Wysłaliśmy prośbę o potwierdzenie subskrypcji.";
  }
  switch (searchParams.error) {
    case "invalid-email":
      return "Podaj poprawny adres e-mail.";
    case "consent-required":
      return "Zaznacz zgodę, aby otrzymywać newsletter.";
    case "listmonk-error":
      return "Serwer newslettera chwilowo nie działa. Spróbuj ponownie.";
    default:
      return null;
  }
}
