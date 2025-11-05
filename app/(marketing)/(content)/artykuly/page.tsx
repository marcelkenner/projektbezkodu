import Link from "next/link";
import { getCopy } from "../../../lib/copy";

export default function ArticlesIndex() {
  const copy = getCopy("articles");

  return (
    <section className="section section--surface">
      <div className="pbk-container pbk-stack">
        <div className="section__header">
          <h1>{copy.title}</h1>
          <p>{copy.intro}</p>
        </div>
        <div className="section__grid">
          {(copy.categories ?? []).map((category) => (
            <div key={category.title} className="pbk-card">
              <h2>{category.title}</h2>
              {category.meta ? (
                <p className="pbk-card__meta">{category.meta}</p>
              ) : null}
              <p>{category.description}</p>
              <Link
                className="pbk-button pbk-button--tertiary"
                href={category.href}
              >
                {category.ctaLabel ?? "Czytaj"}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
