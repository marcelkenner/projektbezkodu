import type { Metadata } from "next";
import Link from "next/link";
import { getCopy } from "@/app/lib/copy";
import styles from "./contact.module.css";

const copy = getCopy("contact");

export const metadata: Metadata = {
  title: copy.seo.title,
  description: copy.seo.description,
  alternates: {
    canonical: copy.seo.canonical,
  },
};

export default function ContactPage() {
  return (
    <section className={styles.page} id="content">
      <div className="pbk-container pbk-stack pbk-stack--tight">
        <header className="pbk-stack pbk-stack--tight">
          <h1>{copy.hero.title}</h1>
          <p className="pbk-card__meta">{copy.hero.intro}</p>
        </header>
        <article className={`pbk-card ${styles.notice} pbk-stack`}>
          <p>{copy.notice.body}</p>
          <div className="pbk-stack pbk-stack--tight">
            <Link
              className="pbk-button pbk-button--primary"
              href={`mailto:${copy.notice.email}`}
            >
              {copy.notice.buttonLabel}
            </Link>
            <p className="pbk-card__meta">{copy.notice.footer}</p>
          </div>
        </article>
      </div>
    </section>
  );
}
