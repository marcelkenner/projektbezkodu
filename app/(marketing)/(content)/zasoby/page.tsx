import Link from "next/link";
import type { Metadata } from "next";
import { getCopy } from "@/app/lib/copy";
import styles from "./resources.module.css";

const copy = getCopy("resources");

export const metadata: Metadata = {
  title: copy.seo.title,
  description: copy.seo.description,
  alternates: {
    canonical: copy.seo.canonical,
  },
};

export default function ResourcesPage() {
  return (
    <section
      className={`${styles.resourcesPage} section section--surface`}
      id="content"
    >
      <div className="pbk-container pbk-stack">
        <header
          className={`${styles.resourcesPage__header} pbk-stack pbk-stack--tight`}
        >
          <div className="pbk-stack pbk-stack--tight">
            <h1>{copy.hero.title}</h1>
            <p>{copy.hero.intro}</p>
            <p className="pbk-card__meta">
              Pracujemy nad nową bazą zasobów. Wróć wkrótce – w międzyczasie
              sprawdź nasze artykuły i poradniki.
            </p>
          </div>
        </header>
        <div className={`${styles.resourcesPage__empty} pbk-card`}>
          <p>{copy.emptyState.noResources}</p>
          <div className={styles.resourcesCard__actions}>
            <Link className="pbk-button pbk-button--primary" href="/artykuly/">
              Przeglądaj artykuły
            </Link>
            <Link
              className="pbk-button pbk-button--secondary"
              href="/poradniki/"
            >
              Zobacz poradniki
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
