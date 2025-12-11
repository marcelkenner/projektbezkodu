import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articleTaxonomyCatalog } from "@/app/lib/content/articleTaxonomy";
import { TagDirectory } from "@/app/lib/content/tagDirectory";
import { getCopy } from "@/app/lib/copy";
import { defaultHeroImageForPath } from "@/app/lib/content/heroImageResolver";
import { ArticleCard, ArticleGrid } from "@/app/ui";
import "./../tag.module.css";

const tagDirectory = new TagDirectory();
const articlesCopy = getCopy("articles");

export function generateStaticParams() {
  return tagDirectory.list().map((tag) => ({ slug: tag.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const tag = tagDirectory.get(resolvedParams.slug);
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

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const tag = tagDirectory.get(resolvedParams.slug);
  if (!tag) {
    notFound();
  }

  const articles = tagDirectory.listArticles(resolvedParams.slug);

  return (
    <section className="tag-page" id="content">
      <div className="pbk-container pbk-stack pbk-stack--tight">
        <div className="tag-page__intro">
          <h1>Tag: {tag.label}</h1>
          {tag.description ? <p>{tag.description}</p> : null}
        </div>
        {articles.length ? (
          <ArticleGrid className="tag-page__grid">
            {articles.map((article) => {
              const categorySlug = article.taxonomy?.categories?.[0];
              const category = categorySlug
                ? articleTaxonomyCatalog.getCategory(categorySlug)
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
                  ctaLabel={articlesCopy.listing.articleCta}
                />
              );
            })}
          </ArticleGrid>
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
