import type { Metadata } from "next";
import { getCopy } from "@/app/lib/copy";
import { TextField, TextareaField, Button } from "@/app/ui";
import "./accessibility.module.css";

const copy = getCopy("accessibility");

export const metadata: Metadata = {
  title: copy.seo.title,
  description: copy.seo.description,
  alternates: {
    canonical: copy.seo.canonical,
  },
};

class AccessibilityViewModel {
  getHero() {
    return copy.hero;
  }

  getMeasures() {
    return copy.sections.measures;
  }

  getLimitations() {
    return copy.sections.limitations;
  }

  getFeedbackSection() {
    return copy.sections.feedback;
  }

  getForm() {
    return copy.sections.form;
  }

  getMeta() {
    return copy.sections.meta;
  }
}

export default function AccessibilityStatementPage() {
  const viewModel = new AccessibilityViewModel();

  return (
    <section
      className="accessibility-page section section--surface"
      id="content"
    >
      <div className="pbk-container pbk-stack">
        <header className="accessibility-page__hero pbk-stack pbk-stack--tight">
          <h1>{viewModel.getHero().title}</h1>
          <p>{viewModel.getHero().intro}</p>
        </header>
        <div className="accessibility-page__grid">
          <article className="accessibility-page__card">
            <h2>{viewModel.getMeasures().heading}</h2>
            <ul>
              {viewModel.getMeasures().items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="accessibility-page__card accessibility-page__card--muted">
            <h2>{viewModel.getLimitations().heading}</h2>
            <ul>
              {viewModel.getLimitations().items.map((item) => (
                <li key={item.label}>
                  <strong>{item.label}:</strong> {item.description}
                </li>
              ))}
            </ul>
          </article>
          <article className="accessibility-page__card">
            <h2>{viewModel.getFeedbackSection().heading}</h2>
            <p>{viewModel.getFeedbackSection().intro}</p>
            <dl className="accessibility-page__contact">
              <div>
                <dt>E-mail</dt>
                <dd>
                  <a
                    href={`mailto:${viewModel.getFeedbackSection().contact.email}`}
                  >
                    {viewModel.getFeedbackSection().contact.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt>Telefon</dt>
                <dd>
                  <a
                    href={`tel:${viewModel.getFeedbackSection().contact.phone}`}
                  >
                    {viewModel.getFeedbackSection().contact.phone}
                  </a>
                </dd>
              </div>
            </dl>
          </article>
        </div>

        <section
          className="accessibility-page__formSection pbk-card pbk-stack"
          aria-labelledby="accessibility-feedback-form"
        >
          <h2 id="accessibility-feedback-form">
            {viewModel.getForm().heading}
          </h2>
          <form
            className="accessibility-page__form"
            aria-live="polite"
            noValidate
          >
            <TextField
              id="accessibility-name"
              name="name"
              label={viewModel.getForm().labels.name}
              autoComplete="name"
              required
            />
            <TextField
              id="accessibility-email"
              name="email"
              label={viewModel.getForm().labels.email}
              type="email"
              autoComplete="email"
              required
            />
            <TextareaField
              id="accessibility-message"
              name="message"
              label={viewModel.getForm().labels.message}
              rows={4}
              required
            />
            <p className="accessibility-page__disclaimer">
              {viewModel.getForm().privacyDisclaimer}
            </p>
            <Button type="submit" variant="primary">
              {viewModel.getForm().labels.submit}
            </Button>
          </form>
        </section>

        <section className="accessibility-page__meta pbk-card pbk-stack pbk-stack--tight">
          <h2>{viewModel.getMeta().heading}</h2>
          <p>{viewModel.getMeta().publication}</p>
          <p>{viewModel.getMeta().update}</p>
          <p>{viewModel.getMeta().owner}</p>
        </section>
      </div>
    </section>
  );
}
