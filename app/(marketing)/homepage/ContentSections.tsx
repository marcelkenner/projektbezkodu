import {
  Alert,
  Card,
  ComparisonTable,
  Stepper,
  TextField,
  Button,
} from "../../ui";
import type { Frontmatter } from "../../lib/frontmatter";
import { getToolLabel } from "../../lib/tools";
import { getCopy } from "../../lib/copy";

interface ContentSectionsProps {
  frontmatter?: Frontmatter;
}

const COMPARISON_HEADERS = ["Webflow", "Framer", "WordPress (No-code)"];
const COMPARISON_FEATURES = [
  {
    label: "Czas startu",
    values: ["1 dzień", "1 dzień", "3+ dni"],
  },
  {
    label: "Wydajność",
    values: ["90/100", "92/100", "70/100"],
  },
  {
    label: "Obsługa SEO",
    values: ["Zaawansowana", "Podstawowa", "Wtyczki"],
  },
];

export function ContentSections({ frontmatter }: ContentSectionsProps) {
  const homepageCopy = getCopy("homepage");
  const globalCopy = getCopy("global");
  const sections = homepageCopy.sections;
  const tools = frontmatter?.meta?.tools ?? [];
  const newsletterForm = sections.newsletter.form ?? {
    emailLabel: "Adres e-mail",
    emailPlaceholder: "",
    description: "",
  };

  return (
    <>
      <section className="section section--surface">
        <div className="pbk-container pbk-stack">
          <div className="section__header">
            <h2>{sections.content.heading}</h2>
            <p>{sections.content.body}</p>
          </div>
          <div className="section__grid">
            {(sections.content.cards ?? []).map((category) => (
              <Card
                key={category.title}
                title={category.title}
                meta={category.meta}
                actions={
                  <a
                    className="pbk-button pbk-button--tertiary"
                    href={category.href}
                  >
                    {category.ctaLabel}
                  </a>
                }
              >
                <p>{category.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="pbk-container pbk-stack">
          <div className="section__header">
            <h2>{sections.steps.heading}</h2>
            <p>{sections.steps.body}</p>
          </div>
          <Stepper
            steps={(sections.steps.items ?? []).map((item) => ({
              title: item.title,
              description: item.description,
            }))}
          />
        </div>
      </section>

      <section className="section section--surface">
        <div className="pbk-container pbk-stack">
          <div className="section__header">
            <h2>{sections.comparison.heading}</h2>
            <p>{sections.comparison.body}</p>
          </div>
          <ComparisonTable
            caption="Porównanie narzędzi no-code"
            headers={COMPARISON_HEADERS}
            features={COMPARISON_FEATURES}
          />
        </div>
      </section>

      {tools.length ? (
        <section className="section section--surface">
          <div className="pbk-container pbk-stack">
            <div className="section__header">
              <h2>{sections.tools.heading}</h2>
              <p>
                {sections.tools.intro ? `${sections.tools.intro} ` : ""}
                {tools.map(getToolLabel).join(", ")}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="section section--surface">
        <div className="pbk-container pbk-stack">
          <div className="section__header">
            <h2>{sections.newsletter.heading}</h2>
            <p>{sections.newsletter.body}</p>
          </div>
          <form className="pbk-grid">
            <TextField
              id="newsletter-email"
              type="email"
              label={newsletterForm.emailLabel}
              placeholder={newsletterForm.emailPlaceholder}
              required
              description={newsletterForm.description}
            />
            <div className="pbk-stack pbk-stack--tight">
              <Button type="submit">{globalCopy.newsletter.submitLabel}</Button>
              <p className="pbk-input__description">
                {globalCopy.newsletter.privacyNote}{" "}
                <a href="/polityka-prywatnosci">politykę prywatności</a>.
              </p>
            </div>
          </form>
        </div>
      </section>

      <section className="section">
        <div className="pbk-container pbk-stack">
          <div className="section__header">
            <h2>{sections.faq.heading}</h2>
            <p>{sections.faq.intro}</p>
          </div>
          <div className="faq">
            {(sections.faq.items ?? []).map((item) => (
              <div key={item.question} className="faq__item">
                <p className="faq__question">{item.question}</p>
                <p className="faq__answer">{item.answer}</p>
              </div>
            ))}
          </div>
          <Alert variant="info">
            <p>{sections.faq.cta}</p>
          </Alert>
        </div>
      </section>
    </>
  );
}
