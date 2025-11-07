import Link from "next/link";
import type { Metadata } from "next";
import { ArticleCard } from "@/app/(marketing)/(content)/artykuly/ArticleCard";
import {
  ArticleRepository,
  type ContentSummary,
} from "@/app/lib/content/repositories";
import { articleTaxonomyCatalog } from "@/app/lib/content/articleTaxonomy";
import { getCopy } from "@/app/lib/copy";
import "../contact.module.css";

const copy = getCopy("contact");
const repository = new ArticleRepository();

export const metadata: Metadata = {
  title: copy.thankYou.seo.title,
  description: copy.thankYou.seo.description,
  alternates: {
    canonical: copy.thankYou.seo.canonical,
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function ContactThankYouPage() {
  const articles = selectFeaturedArticles(repository.listSummaries(), 3);

  return (
    <section className="contact-page" id="content">
      <div className="pbk-container contact-page__thankyouGrid">
        <header className="pbk-stack pbk-stack--tight">
          <h1>{copy.thankYou.hero.title}</h1>
          <p className="pbk-card__meta">{copy.thankYou.hero.intro}</p>
        </header>
        <div className="contact-page__articles">
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
        <Link
          className="pbk-button pbk-button--secondary"
          href={copy.thankYou.cta.href}
        >
          {copy.thankYou.cta.label}
        </Link>
      </div>
    </section>
  );
}

function selectFeaturedArticles(
  summaries: ContentSummary[],
  limit: number,
): ContentSummary[] {
  return summaries
    .slice()
    .sort((a, b) => {
      const dateA = a.date ? Date.parse(a.date) : 0;
      const dateB = b.date ? Date.parse(b.date) : 0;
      if (dateA === dateB) {
        return a.title.localeCompare(b.title, "pl");
      }
      return dateB - dateA;
    })
    .slice(0, limit);
}
