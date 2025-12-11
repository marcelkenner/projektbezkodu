import Link from "next/link";
import type { Metadata } from "next";
import {
  ArticleRepository,
  type ContentSummary,
} from "@/app/lib/content/repositories";
import { articleTaxonomyCatalog } from "@/app/lib/content/articleTaxonomy";
import { getCopy } from "@/app/lib/copy";
import { defaultHeroImageForPath } from "@/app/lib/content/heroImageResolver";
import { ArticleCard, ArticleGrid } from "@/app/ui";
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
          <ArticleGrid className="newsletter-page__list">
            {articles.map((article) => {
              const primaryCategory = (article.taxonomy?.categories ?? [])[0];
              const category = primaryCategory
                ? articleTaxonomyCatalog.getCategory(primaryCategory)
                : undefined;
              const fallback = defaultHeroImageForPath(
                article.path,
                article.title,
              );
              return (
                <ArticleCard
                  key={article.slug}
                  title={article.title}
                  href={article.path}
                  description={article.hero?.subheading ?? article.description}
                  hero={{
                    src: article.hero?.image?.src ?? article.meta?.heroImageSrc,
                    alt: article.hero?.image?.alt ?? article.meta?.heroImageAlt,
                    fallbackSrc: fallback.src,
                    width: fallback.width,
                    height: fallback.height,
                  }}
                  meta={{
                    readingTime: article.meta?.duration,
                    publishedAt: article.date,
                    extra: category?.label ? [{ label: category.label }] : [],
                  }}
                  ctaLabel="Czytaj →"
                />
              );
            })}
          </ArticleGrid>
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
