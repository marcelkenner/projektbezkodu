import type { Metadata } from "next";
import { ArticleRepository } from "@/app/lib/content/repositories";
import { articleTaxonomyCatalog } from "@/app/lib/content/articleTaxonomy";
import { ArticleDirectory } from "@/app/lib/content/articleDirectory";
import { SearchParamParser } from "@/app/lib/url/SearchParamParser";
import { getCopy } from "@/app/lib/copy";
import { listContentCategories } from "@/app/lib/content/categoryDirectory";
import { ArticlesFilterBar } from "./ArticlesFilterBar";
import { ArticleCard } from "./ArticleCard";
import { ArticlesPagination } from "./ArticlesPagination";
import "./articles.module.css";

const articleRepository = new ArticleRepository();
const PAGE_SIZE = 9;

type SearchParams = Record<string, string | string[] | undefined>;

export function generateMetadata({
  searchParams,
}: {
  searchParams?: SearchParams;
}): Metadata {
  const parser = new SearchParamParser(searchParams);
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
  searchParams?: SearchParams;
}

export default function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const copy = getCopy("articles");
  const parser = new SearchParamParser(searchParams);

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
    <section className="articles-page" id="content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="pbk-container articles-page__intro">
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
            <div className="articles-grid">
              {pagedArticles.map((article) => {
                const primaryCategory =
                  article.taxonomy?.categories?.[0] ?? null;
                const categoryTerm = primaryCategory
                  ? articleTaxonomyCatalog.getCategory(primaryCategory)
                  : undefined;
                return (
                  <ArticleCard
                    key={article.path}
                    article={article}
                    ctaLabel={copy.listing.articleCta}
                    category={categoryTerm}
                  />
                );
              })}
            </div>
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
