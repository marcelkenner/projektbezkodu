import Link from "next/link";

export interface NewsletterCopy {
  heading: string;
  body: string;
  form: {
    emailLabel: string;
    emailPlaceholder: string;
    consentLabel: string;
    submitLabel: string;
    privacyLabel: string;
    privacyHref: string;
  };
}

export function NewsletterSection({ copy }: { copy: NewsletterCopy }) {
  const form = copy.form;

  return (
    <section
      className="homepage-section homepage-section--newsletter"
      aria-labelledby="newsletter-heading"
    >
      <div className="pbk-container homepage-newsletter__wrapper">
        <div className="homepage-newsletter__content">
          <h2 id="newsletter-heading">{copy.heading}</h2>
          <p>{copy.body}</p>
          <form
            className="homepage-newsletter__form"
            action="/api/newsletter/subscribe"
            method="post"
          >
            <label htmlFor="newsletter-email">{form.emailLabel}</label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              required
              placeholder={form.emailPlaceholder}
              minLength={3}
            />
            <label className="homepage-newsletter__consent">
              <input type="checkbox" name="consent" required />{" "}
              {form.consentLabel}
            </label>
            <button type="submit" className="pbk-button pbk-button--primary">
              {form.submitLabel}
            </button>
            <small>
              <Link href={form.privacyHref}>{form.privacyLabel}</Link>
            </small>
          </form>
        </div>
      </div>
    </section>
  );
}
