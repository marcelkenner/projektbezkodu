import Link from "next/link";
import type { Metadata } from "next";
import { ArticleCard } from "@/app/(marketing)/(content)/artykuly/ArticleCard";
import {
  ArticleRepository,
  type ContentSummary,
} from "@/app/lib/content/repositories";
import { articleTaxonomyCatalog } from "@/app/lib/content/articleTaxonomy";
import { getCopy } from "@/app/lib/copy";
import "./../newsletter.module.css";

const copy = getCopy("newsletter");
const repository = new ArticleRepository();

export const metadata: Metadata = {
  title: copy.thanks.seo.title,
  description: copy.thanks.seo.description,
  alternates: {
    canonical: copy.thanks.seo.canonical,
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function NewsletterThankYouPage() {
  const articles = selectArticles(copy.thanks.articles.slugs);

  return (
    <section className="newsletter-page" id="content">
      <div className="pbk-container newsletter-page__card">
        <header className="pbk-stack pbk-stack--tight">
          <h1>{copy.thanks.hero.title}</h1>
          <p>{copy.thanks.hero.intro}</p>
        </header>
        <Link
          className="pbk-button pbk-button--primary"
          href={copy.thanks.download.href}
        >
          {copy.thanks.download.label}
        </Link>
        <div className="pbk-stack pbk-stack--tight">
          <h2>{copy.thanks.articles.heading}</h2>
          <div className="newsletter-page__list">
            {articles.map((article) => {
              const primaryCategory = (article.taxonomy?.categories ?? [])[0];
              const category = primaryCategory
                ? articleTaxonomyCatalog.getCategory(primaryCategory)
                : undefined;
              return (
                <ArticleCard
                  key={article.slug}
                  article={article}
                  ctaLabel="Czytaj →"
                  category={category}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function selectArticles(slugs: string[]): ContentSummary[] {
  const summaries = repository.listSummaries();
  return slugs
    .map((slug) => summaries.find((summary) => summary.slug === slug))
    .filter((summary): summary is ContentSummary => Boolean(summary));
}
