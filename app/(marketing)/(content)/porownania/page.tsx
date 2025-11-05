import Link from "next/link";
import { getCopy } from "../../../lib/copy";

export default function ComparisonsIndex() {
  const copy = getCopy("comparisons");

  return (
    <section className="section section--surface">
      <div className="pbk-container pbk-stack">
        <div className="section__header">
          <h1>{copy.title}</h1>
          <p>{copy.intro}</p>
        </div>
        <div className="section__grid">
          {(copy.items ?? []).map((comparison) => (
            <div key={comparison.title} className="pbk-card">
              <h2>{comparison.title}</h2>
              <p>{comparison.summary}</p>
              <Link
                className="pbk-button pbk-button--tertiary"
                href={comparison.href}
              >
                {comparison.ctaLabel ?? "Zobacz porównanie"}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
