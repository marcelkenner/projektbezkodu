import type { Metadata } from "next";
import { getCopy } from "@/app/lib/copy";
import styles from "./templates.module.css";

const copy = getCopy("templates");

export const metadata: Metadata = {
  title: copy.seo.title,
  description: copy.seo.description,
  alternates: {
    canonical: copy.seo.canonical,
  },
};

export default function TemplatesPage() {
  return (
    <section className={`${styles.scope} templates-page`} id="content">
      <div className="pbk-container pbk-stack pbk-stack--tight">
        <div className="pbk-readable pbk-readable--start">
          <div className="templates-page__intro">
            <h1>{copy.hero.title}</h1>
            <p>{copy.hero.intro}</p>
          </div>
        </div>
        <article className="pbk-card pbk-stack pbk-stack--tight">
          <h2>Szablony już wkrótce</h2>
          <p>
            Pracujemy nad biblioteką gotowych szablonów. Zostaw nasz newsletter
            lub wróć za kilka dni – dodamy pierwsze zestawy wraz z instrukcjami
            wdrożenia.
          </p>
          <p className="pbk-card__meta">
            Chcesz zostać powiadomiony? Zapisz się w stopce strony lub napisz na
            kontakt@projektbezkodu.pl.
          </p>
        </article>
      </div>
    </section>
  );
}
