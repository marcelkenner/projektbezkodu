import Link from "next/link";
import type { Metadata } from "next";
import { Button, TextField, TextareaField, CheckboxField } from "@/app/ui";
import { getCopy } from "@/app/lib/copy";
import "./contact.module.css";

const copy = getCopy("contact");

export const metadata: Metadata = {
  title: copy.seo.title,
  description: copy.seo.description,
  alternates: {
    canonical: copy.seo.canonical,
  },
};

export default function ContactPage() {
  const consentDescriptionId = copy.form.aria.consentDescriptionId;

  return (
    <section className="contact-page" id="content">
      <div className="pbk-container pbk-stack pbk-stack--tight">
        <header className="pbk-stack pbk-stack--tight">
          <h1>{copy.hero.title}</h1>
          <p className="pbk-card__meta">{copy.hero.intro}</p>
        </header>
        <form
          className="contact-page__form"
          action={copy.form.action}
          method={copy.form.method}
          aria-label={copy.form.aria.formLabel}
        >
          <TextField
            id={copy.form.fields.name.id}
            name="name"
            label={copy.form.fields.name.label}
            placeholder={copy.form.fields.name.placeholder}
            required
            autoComplete="name"
          />
          <TextField
            id={copy.form.fields.email.id}
            name="email"
            type="email"
            label={copy.form.fields.email.label}
            placeholder={copy.form.fields.email.placeholder}
            required
            autoComplete="email"
          />
          <TextField
            id={copy.form.fields.tel.id}
            name="telephone"
            type="tel"
            label={copy.form.fields.tel.label}
            placeholder={copy.form.fields.tel.placeholder}
            autoComplete="tel"
          />
          <TextareaField
            id={copy.form.fields.message.id}
            name="message"
            label={copy.form.fields.message.label}
            placeholder={copy.form.fields.message.placeholder}
            required
            className="contact-page__textarea"
          />
          <div className="contact-page__consent">
            <CheckboxField
              id={copy.form.fields.consent.id}
              name="consent"
              label={copy.form.fields.consent.label}
              required
              descriptionId={consentDescriptionId}
            />
            <p id={consentDescriptionId}>
              <Link href={copy.form.fields.consent.privacyHref}>
                {copy.form.fields.consent.privacyLabel}
              </Link>
            </p>
          </div>
          <div className="contact-page__cta">
            <Button type="submit" variant="primary">
              {copy.form.submitLabel}
            </Button>
            <span className="contact-page__info">{copy.form.info}</span>
          </div>
        </form>
      </div>
    </section>
  );
}
