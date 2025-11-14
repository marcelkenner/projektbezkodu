import Link from "next/link";
import type { Metadata } from "next";
import { getCopy } from "@/app/lib/copy";
import { FaqAccordion } from "./FaqAccordion";
import "./faq.module.css";

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
    <section className="faq-page" id="content">
      <div className="pbk-container pbk-stack pbk-stack--tight">
        <div className="pbk-readable">
          <div className="faq-page__intro">
            <h1>{copy.hero.title}</h1>
            <p>{copy.hero.intro}</p>
          </div>
        </div>
        <FaqAccordion entries={copy.entries} />
        <div className="pbk-readable">
          <p className="faq-page__summary">
            {copy.footer.prompt}{" "}
            <Link className="faq-page__cta" href={copy.footer.ctaHref}>
              {copy.footer.ctaLabel}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
