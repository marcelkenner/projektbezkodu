import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArticleRepository,
  type ContentSummary,
} from "@/app/lib/content/repositories";
import { articleTaxonomyCatalog } from "@/app/lib/content/articleTaxonomy";
import { LeadMagnetCatalog } from "@/app/lib/content/leadMagnetCatalog";
import { defaultHeroImageForPath } from "@/app/lib/content/heroImageResolver";
import { ArticleCard, ArticleGrid } from "@/app/ui";
import styles from "./../../lead-magnet.module.css";

const catalog = new LeadMagnetCatalog();
const repository = new ArticleRepository();

export function generateStaticParams() {
  return catalog.listSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const leadMagnet = catalog.get(resolvedParams.slug);
  const thankYou = leadMagnet?.thankYou;
  if (!thankYou) {
    return {};
  }
  return {
    title: thankYou.seo.title,
    description: thankYou.seo.description,
    alternates: {
      canonical: thankYou.seo.canonical,
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function LeadMagnetThankYouPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const leadMagnet = catalog.get(resolvedParams.slug);
  const thankYou = leadMagnet?.thankYou;
  if (!leadMagnet || !thankYou) {
    notFound();
  }

  const articles = thankYou.nextSteps?.articleSlugs
    ? selectArticles(thankYou.nextSteps.articleSlugs)
    : [];

  return (
    <section className={`${styles.scope} lead-page`} id="content">
      <div className="pbk-container lead-page__thankyou">
        <header className="pbk-stack pbk-stack--tight">
          <h1>{thankYou.hero.title}</h1>
          <p className="pbk-card__meta">{thankYou.hero.intro}</p>
        </header>
        {thankYou.directDownload ? (
          <Link
            className="pbk-button pbk-button--primary"
            href={thankYou.directDownload.href}
          >
            {thankYou.directDownload.label}
          </Link>
        ) : null}
        {articles.length ? (
          <div className="lead-page__next">
            {thankYou.nextSteps?.heading ? (
              <h2>{thankYou.nextSteps.heading}</h2>
            ) : null}
            <ArticleGrid className="lead-page__articles">
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
                    key={article.path ?? article.slug}
                    title={article.title}
                    href={article.path}
                    description={
                      article.hero?.subheading ?? article.description
                    }
                    hero={{
                      src:
                        article.hero?.image?.src ?? article.meta?.heroImageSrc,
                      alt:
                        article.hero?.image?.alt ?? article.meta?.heroImageAlt,
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
        ) : null}
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
