import type { Metadata } from "next";
import Link from "next/link";
import { getCopy } from "@/app/lib/copy";
import "./affiliate.module.css";

const copy = getCopy("affiliate");

export const metadata: Metadata = {
  title: copy.seo.title,
  description: copy.seo.description,
  alternates: {
    canonical: copy.seo.canonical,
  },
};

class AffiliateViewModel {
  getSections() {
    return copy.sections.map((section) => ({
      heading: section.heading,
      bullets: section.bullets,
    }));
  }

  getHero() {
    return copy.hero;
  }

  getContact() {
    return copy.contact;
  }
}

export default function AffiliatePolicyPage() {
  const viewModel = new AffiliateViewModel();

  return (
    <section className="affiliate-page section section--surface" id="content">
      <div className="pbk-container pbk-stack">
        <header className="affiliate-page__hero pbk-stack pbk-stack--tight">
          <h1>{viewModel.getHero().title}</h1>
          <p>{viewModel.getHero().intro}</p>
        </header>
        <div className="affiliate-page__grid">
          {viewModel.getSections().map((section) => (
            <article key={section.heading} className="affiliate-page__card">
              <h2>{section.heading}</h2>
              <ul>
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <footer className="affiliate-page__contact pbk-card pbk-stack pbk-stack--tight">
          <p>{viewModel.getContact().intro}</p>
          <Link
            className="pbk-button pbk-button--primary"
            href={viewModel.getContact().ctaHref}
          >
            {viewModel.getContact().ctaLabel}
          </Link>
        </footer>
      </div>
    </section>
  );
}
