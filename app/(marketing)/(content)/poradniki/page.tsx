import Link from "next/link";
import { getCopy } from "../../../lib/copy";

export default function TutorialsIndex() {
  const copy = getCopy("tutorials");

  return (
    <section className="section section--surface">
      <div className="pbk-container pbk-stack">
        <div className="section__header">
          <h1>{copy.title}</h1>
          <p>{copy.intro}</p>
        </div>
        <div className="section__grid">
          {(copy.items ?? []).map((tutorial) => (
            <div key={tutorial.title} className="pbk-card">
              {tutorial.difficulty ? (
                <span className="pbk-badge pbk-badge--accent">
                  {tutorial.difficulty}
                </span>
              ) : null}
              <h2>{tutorial.title}</h2>
              <Link
                className="pbk-button pbk-button--tertiary"
                href={tutorial.href}
              >
                {tutorial.ctaLabel ?? "Czytaj tutorial"}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
