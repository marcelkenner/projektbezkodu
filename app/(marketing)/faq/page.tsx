import Link from "next/link";
import type { Metadata } from "next";
import { getCopy } from "@/app/lib/copy";
import { FaqAccordion } from "./FaqAccordion";
import styles from "./faq.module.css";

const copy = getCopy("faq");

export const metadata: Metadata = {
  title: copy.seo.title,
  description: copy.seo.description,
  alternates: {
    canonical: copy.seo.canonical,
  },
};

export default function FaqPage() {
  return (
    <section className={styles.faqPage} id="content">
      <div className="pbk-container pbk-stack pbk-stack--tight">
        <div className="pbk-readable">
          <div className={styles.faqPage__intro}>
            <h1>{copy.hero.title}</h1>
            <p>{copy.hero.intro}</p>
          </div>
        </div>
        <FaqAccordion entries={copy.entries} />
        <div className="pbk-readable">
          <p className={styles.faqPage__summary}>
            {copy.footer.prompt}{" "}
            <Link className={styles.faqPage__cta} href={copy.footer.ctaHref}>
              {copy.footer.ctaLabel}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
