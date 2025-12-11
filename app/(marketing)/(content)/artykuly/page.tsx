import type { Metadata } from "next";
import { ArticleRepository } from "@/app/lib/content/repositories";
import { articleTaxonomyCatalog } from "@/app/lib/content/articleTaxonomy";
import { ArticleDirectory } from "@/app/lib/content/articleDirectory";
import { defaultHeroImageForPath } from "@/app/lib/content/heroImageResolver";
import { SearchParamParser } from "@/app/lib/url/SearchParamParser";
import { getCopy } from "@/app/lib/copy";
import { listContentCategories } from "@/app/lib/content/categoryDirectory";
import { ArticleCard, ArticleGrid } from "@/app/ui";
import { ArticlesFilterBar } from "./ArticlesFilterBar";
import { ArticlesPagination } from "./ArticlesPagination";
import styles from "./articles.module.css";

const articleRepository = new ArticleRepository();
const PAGE_SIZE = 12;

type SearchParams = Record<string, string | string[] | undefined>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}): Promise<Metadata> {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const parser = new SearchParamParser(resolvedSearchParams);
  const pageValue = parser.getSingle("page");
  const pageNumber = pageValue ? Number(pageValue) : 1;
  const isPaginated = Number.isFinite(pageNumber) && pageNumber > 1;

  return {
    title: "Blog - poradniki no-code, SEO i automatyzacje | ProjektBezKodu",
    description:
      "Artykuły, które prowadzą do działania: Webflow, Framer, SEO i automatyzacje. Filtry według czasu czytania i kategorii.",
    alternates: {
      canonical: "/artykuly/",
    },
    robots: isPaginated
      ? {
          index: false,
          follow: true,
        }
      : undefined,
  };
}

interface ArticlesPageProps {
  searchParams?: Promise<SearchParams>;
}

export default async function ArticlesPage({
  searchParams,
}: ArticlesPageProps) {
  const copy = getCopy("articles");
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const parser = new SearchParamParser(resolvedSearchParams);

  const query = parser.getSingle("q");
  const category = parser.getSingle("kategoria");
  const readingTime = parser.getSingle("czas");
  const tags = parser.getAll("tag");
  const pageValue = parser.getSingle("page");
  const pageNumber = pageValue ? Number(pageValue) : 1;
  const requestedPage =
    Number.isFinite(pageNumber) && pageNumber > 0 ? pageNumber : 1;

  const allArticles = articleRepository.listSummaries();
  const directory = new ArticleDirectory(allArticles);
  const filteredArticles = directory.list({
    query,
    category,
    readingTime,
    tags,
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredArticles.length / PAGE_SIZE),
  );
  const currentPage = Math.min(requestedPage, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pagedArticles = filteredArticles.slice(start, end);

  const contentCategories = listContentCategories();

  const baseParams = new URLSearchParams();
  if (query) baseParams.set("q", query);
  if (category) baseParams.set("kategoria", category);
  if (readingTime) baseParams.set("czas", readingTime);
  tags.forEach((tag) => baseParams.append("tag", tag));

  const shouldShowEmptyState = allArticles.length === 0;
  const shouldShowNoResults =
    allArticles.length > 0 && filteredArticles.length === 0;

  const jsonLd = buildCollectionJsonLd(pagedArticles, currentPage);

  return (
    <section
      className={`articles-page ${styles["articles-page"]}`}
      id="content"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div
        className={`pbk-container articles-page__intro ${styles["articles-page__intro"]}`}
      >
        <h1>{copy.listing.heading}</h1>
        <p>{copy.listing.subheading}</p>
      </div>

      {shouldShowEmptyState ? null : (
        <div className="pbk-container">
          <ArticlesFilterBar
            copy={copy.listing.filters}
            categories={contentCategories}
            selected={{ query, category }}
          />
        </div>
      )}

      <div className="pbk-container">
        {shouldShowEmptyState ? (
          <div className="pbk-card">
            <p>{copy.emptyState}</p>
          </div>
        ) : shouldShowNoResults ? (
          <div className="pbk-card">
            <p>{copy.listing.noResults}</p>
          </div>
        ) : (
          <>
            <ArticleGrid>
              {pagedArticles.map((article) => {
                const primaryCategory =
                  article.taxonomy?.categories?.[0] ?? null;
                const categoryTerm = primaryCategory
                  ? articleTaxonomyCatalog.getCategory(primaryCategory)
                  : undefined;
                return (
                  <ArticleCard
                    key={article.path}
                    title={article.title}
                    href={article.path}
                    description={
                      article.hero?.subheading ?? article.description
                    }
                    hero={resolveArticleHero(article)}
                    meta={{
                      readingTime: article.meta?.duration,
                      publishedAt: article.date,
                      extra: categoryTerm?.label
                        ? [{ label: categoryTerm.label }]
                        : [],
                    }}
                    ctaLabel={copy.listing.articleCta}
                  />
                );
              })}
            </ArticleGrid>
            <ArticlesPagination
              copy={copy.listing.pagination}
              currentPage={currentPage}
              totalPages={totalPages}
              baseSearchParams={baseParams}
            />
          </>
        )}
      </div>
    </section>
  );
}

function buildCollectionJsonLd(
  articles: ReturnType<ArticleDirectory["list"]>,
  currentPage: number,
) {
  const items = articles.map((article, index) => ({
    "@type": "ListItem",
    position: (currentPage - 1) * PAGE_SIZE + index + 1,
    url: `https://projektbezkodu.pl${article.path}`,
    name: article.title,
  }));

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Blog ProjektBezKodu",
    itemListElement: items,
  };
}

function resolveArticleHero(article: {
  path: string;
  title: string;
  hero?: { image?: { src?: string; alt?: string } };
  meta?: {
    heroImageSrc?: string;
    heroImageAlt?: string;
    heroImageWidth?: number;
    heroImageHeight?: number;
  };
}) {
  const providedSrc = article.hero?.image?.src ?? article.meta?.heroImageSrc;
  const isBroken =
    providedSrc === "/img/article_image.jpeg" ||
    providedSrc?.endsWith(".webp.jpeg") ||
    providedSrc?.endsWith(".webp.webp");

  if (providedSrc && !isBroken) {
    return {
      src: providedSrc,
      alt: article.hero?.image?.alt ?? article.meta?.heroImageAlt,
      width: article.meta?.heroImageWidth,
      height: article.meta?.heroImageHeight,
    };
  }

  const fallback = defaultHeroImageForPath(article.path, article.title);
  return {
    src: fallback.src,
    alt: fallback.alt,
    width: fallback.width,
    height: fallback.height,
  };
}
