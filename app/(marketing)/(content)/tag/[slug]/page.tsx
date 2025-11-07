import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/app/(marketing)/(content)/artykuly/ArticleCard";
import { articleTaxonomyCatalog } from "@/app/lib/content/articleTaxonomy";
import { TagDirectory } from "@/app/lib/content/tagDirectory";
import { getCopy } from "@/app/lib/copy";
import "./../tag.module.css";

const tagDirectory = new TagDirectory();
const articlesCopy = getCopy("articles");

export function generateStaticParams() {
  return tagDirectory.list().map((tag) => ({ slug: tag.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const tag = tagDirectory.get(params.slug);
  if (!tag) {
    return {};
  }

  const canonical = `/tag/${tag.slug}/`;
  return {
    title: `Tag: ${tag.label} | ProjektBezKodu`,
    description: tag.description ?? `Artykuły oznaczone tagiem ${tag.label}.`,
    alternates: { canonical },
  };
}

export default function TagPage({ params }: { params: { slug: string } }) {
  const tag = tagDirectory.get(params.slug);
  if (!tag) {
    notFound();
  }

  const articles = tagDirectory.listArticles(params.slug);

  return (
    <section className="tag-page" id="content">
      <div className="pbk-container pbk-stack pbk-stack--tight">
        <div className="tag-page__intro">
          <h1>Tag: {tag.label}</h1>
          {tag.description ? <p>{tag.description}</p> : null}
        </div>
        {articles.length ? (
          <div className="tag-page__grid">
            {articles.map((article) => {
              const categorySlug = article.taxonomy?.categories?.[0];
              const category = categorySlug
                ? articleTaxonomyCatalog.getCategory(categorySlug)
                : undefined;
              return (
                <ArticleCard
                  key={article.slug}
                  article={article}
                  ctaLabel={articlesCopy.listing.articleCta}
                  category={category}
                />
              );
            })}
          </div>
        ) : (
          <p className="pbk-card__meta">
            Nie znaleźliśmy jeszcze artykułów w tym tagu. Zajrzyj później lub{" "}
            <Link href="/kontakt/">napisz do nas</Link>.
          </p>
        )}
      </div>
    </section>
  );
}
