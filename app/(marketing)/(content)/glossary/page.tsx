import { getCopy } from "../../../lib/copy";

const placeholderTerms = [
  {
    term: "CMS",
    description: "System zarządzania treścią umożliwiający edycję bez kodu.",
  },
  {
    term: "CWV",
    description:
      "Core Web Vitals – zestaw metryk oceniających wydajność stron.",
  },
  {
    term: "LP",
    description: "Landing page – strona nastawiona na konwersję.",
  },
];

export default function GlossaryIndex() {
  const copy = getCopy("glossary");

  return (
    <section className="section section--surface">
      <div className="pbk-container pbk-stack">
        <div className="section__header">
          <h1>{copy.title}</h1>
          <p>{copy.intro}</p>
        </div>
        <div className="pbk-stack">
          {placeholderTerms.map((item) => (
            <div key={item.term} className="pbk-card">
              <h2>{item.term}</h2>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
        <p className="pbk-input__description">{copy.emptyState}</p>
      </div>
    </section>
  );
}
