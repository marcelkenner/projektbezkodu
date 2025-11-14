import type { Metadata } from "next";
import Link from "next/link";
import { getCopy } from "@/app/lib/copy";
import {
  SitemapComposer,
  type SitemapSection,
} from "@/app/lib/navigation/SitemapComposer";
import "./sitemap.module.css";

const copy = getCopy("sitemap");
const composer = new SitemapComposer();

export const metadata: Metadata = {
  title: copy.seo.title,
  description: copy.seo.description,
  alternates: {
    canonical: copy.seo.canonical,
  },
};

export default function SitemapPage() {
  const sections = composer.buildSections();

  return (
    <section className="sitemap-page" id="content">
      <div className="pbk-container pbk-stack pbk-stack--tight">
        <div className="pbk-readable">
          <header className="sitemap-page__intro">
            <h1>{copy.hero.title}</h1>
            <p>{copy.hero.intro}</p>
          </header>
        </div>
        <div className="sitemap-page__grid">
          {sections.map((section) => (
            <SitemapSectionCard key={section.getHeading()} section={section} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SitemapSectionCard({ section }: { section: SitemapSection }) {
  const links = section.getLinks();
  if (!links.length) {
    return null;
  }
  return (
    <article className="sitemap-page__section">
      <h2>{section.getHeading()}</h2>
      <ul className="sitemap-page__list">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
