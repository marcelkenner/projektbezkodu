import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FileText } from "@phosphor-icons/react/dist/ssr";
import { ArticleRepository } from "@/app/lib/content/repositories";
import { articleTaxonomyCatalog } from "@/app/lib/content/articleTaxonomy";
import { getCopy } from "@/app/lib/copy";
import "../category.module.css";

const articleRepository = new ArticleRepository();

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return articleTaxonomyCatalog
    .listCategories()
    .map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const category = articleTaxonomyCatalog.getCategory(resolvedParams.slug);
  if (!category) {
    return {};
  }
  const hubs = getCopy("categoryHubs");
  const baseConfig = hubs.default;
  const hubConfig = { ...baseConfig, ...(hubs[resolvedParams.slug] ?? {}) };
  return {
    title: `${hubConfig.heading} | ${category.label} | ProjektBezKodu`,
    description: hubConfig.subheading,
    alternates: {
      canonical: `/kategoria/${resolvedParams.slug}/`,
    },
  };
}

export default async function CategoryHubPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const category = articleTaxonomyCatalog.getCategory(resolvedParams.slug);
  if (!category) {
    notFound();
  }
  const hubs = getCopy("categoryHubs");
  const baseConfig = hubs.default;
  const hubConfig = { ...baseConfig, ...(hubs[resolvedParams.slug] ?? {}) };
  const summaries = articleRepository.listSummaries();
  const articlesInCategory = summaries.filter((article) =>
    (article.taxonomy?.categories ?? []).includes(resolvedParams.slug),
  );
  const featuredArticles = (hubConfig.featuredSlugs ?? [])
    .map((slug) => summaries.find((article) => article.slug === slug))
    .filter((article): article is NonNullable<typeof article> =>
      Boolean(article),
    );

  const jsonLd = buildCollectionJsonLd(articlesInCategory);

  return (
    <section className="category-page" id="content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="pbk-container category-page__intro">
        <h1>{hubConfig.heading}</h1>
        <p>{hubConfig.subheading}</p>
      </div>

      <div className="pbk-container category-page__quickLinks">
        <nav aria-label="Skróty">
          <ul>
            {(hubConfig.quickLinks ?? []).map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="pbk-container">
        <div className="category-page__featuredGrid">
          {featuredArticles.map((article) => (
            <div key={article.slug} className="category-page__card">
              <h3>{article.title}</h3>
              {article.description ? <p>{article.description}</p> : null}
              <Link className="pbk-inline-link" href={article.path}>
                Czytaj →
              </Link>
            </div>
          ))}
        </div>
      </div>

      {hubConfig.download ? (
        <div className="pbk-container category-page__download">
          <h3>{hubConfig.download.title}</h3>
          <p>{hubConfig.download.description}</p>
          <div>
            <Link
              className="pbk-button pbk-button--primary"
              href={hubConfig.download.ctaHref}
            >
              {hubConfig.download.ctaLabel}
            </Link>
          </div>
          <small>
            <Link href={hubConfig.download.privacyHref}>
              {hubConfig.download.privacyLabel}
            </Link>
          </small>
        </div>
      ) : null}

      <div className="pbk-container">
        <h2>{hubConfig.listHeading}</h2>
        {articlesInCategory.length ? (
          <ul className="category-page__list">
            {articlesInCategory.map((article) => (
              <li key={article.slug} className="category-page__listItem">
                <FileText
                  aria-hidden="true"
                  className="category-page__icon"
                  weight="bold"
                />
                <Link href={article.path}>{article.title}</Link>
                {article.meta?.duration ? (
                  <span aria-hidden="true">• {article.meta.duration}</span>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p>Trwają prace nad treściami w tej kategorii.</p>
        )}
      </div>
    </section>
  );
}

function buildCollectionJsonLd(
  articles: ReturnType<ArticleRepository["listSummaries"]>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Pillar - kategoria ProjektBezKodu",
    itemListElement: articles.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://projektbezkodu.pl${article.path}`,
      name: article.title,
    })),
  };
}
