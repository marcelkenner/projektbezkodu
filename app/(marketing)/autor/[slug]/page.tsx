/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookOpen, Clock, Rss } from "@phosphor-icons/react/dist/ssr";
import { getCopy } from "@/app/lib/copy";
import { AuthorDirectory } from "@/app/lib/content/authorDirectory";
import { articleTaxonomyCatalog } from "@/app/lib/content/articleTaxonomy";
import type { ContentSummary } from "@/app/lib/content/repositories";
import { defaultHeroImageForPath } from "@/app/lib/content/heroImageResolver";
import { ArticleCard, ArticleGrid } from "@/app/ui";
import "./../author.module.css";

const authorDirectory = new AuthorDirectory();
const articlesCopy = getCopy("articles");

export function generateStaticParams() {
  return authorDirectory.listProfiles().map((profile) => ({
    slug: profile.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const profile = authorDirectory.getProfile(resolvedParams.slug);
  if (!profile) {
    return {};
  }

  const canonical = `/autor/${profile.slug}/`;

  return {
    title: `${profile.name} | Autor ProjektBezKodu`,
    description: profile.bio,
    alternates: { canonical },
  };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const profile = authorDirectory.getProfile(resolvedParams.slug);
  if (!profile) {
    notFound();
  }

  const stats = authorDirectory.getStats(resolvedParams.slug);
  const articles = authorDirectory.listArticles(resolvedParams.slug);
  const rssHref = `/rss/autor/${profile.slug}.xml`;

  return (
    <section className="author-page" id="content">
      <div className="pbk-container author-page__header">
        <div className="author-page__headerContent">
          <div className="author-page__profile">
            <div className="author-page__identity">
              <img
                className="author-page__avatar"
                src={profile.avatar}
                alt={`Zdjęcie autora: ${profile.name}`}
                width={96}
                height={96}
                loading="lazy"
                decoding="async"
              />
              <div>
                <h1>{profile.name}</h1>
                <p className="pbk-card__meta">Autor w ProjektBezKodu</p>
              </div>
            </div>
            <p>{profile.bio}</p>
            {profile.links?.length ? (
              <div className="author-page__links">
                {profile.links.map((link) => (
                  <Link key={link.href} href={link.href} rel={link.rel}>
                    {link.label}
                  </Link>
                ))}
              </div>
            ) : null}
            <div className="author-page__stats" aria-label="Statystyki autora">
              <span className="author-page__stat">
                <BookOpen aria-hidden="true" weight="bold" />
                {stats.articleCount} artykuł{pluralise(stats.articleCount)}
              </span>
              <span className="author-page__stat">
                <Clock aria-hidden="true" weight="bold" />
                Łączny czas czytania ~ {stats.totalReadingMinutes} min
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="pbk-container author-page__articles">
        <h2>Ostatnie artykuły</h2>
        {articles.length ? (
          <nav aria-label="Artykuły autora">
            <ArticleGrid className="author-page__grid">
              {articles.map((article) => {
                const primaryCategory = (article.taxonomy?.categories ?? [])[0];
                const category = primaryCategory
                  ? articleTaxonomyCatalog.getCategory(primaryCategory)
                  : undefined;
                return (
                  <ArticleCard
                    key={article.slug}
                    title={article.title}
                    href={article.path}
                    description={article.hero?.subheading ?? article.description}
                    hero={resolveArticleHero(article)}
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
          </nav>
        ) : (
          <p className="pbk-card__meta">
            Autor nie opublikował jeszcze artykułów. Zajrzyj wkrótce.
          </p>
        )}
        <div className="author-page__rss">
          <Link href={rssHref}>
            <Rss aria-hidden="true" weight="bold" /> Subskrybuj artykuły autora
          </Link>
        </div>
      </div>

      <AuthorJsonLd
        name={profile.name}
        bio={profile.bio}
        avatar={profile.avatar}
        links={profile.links}
      />
    </section>
  );
}

function pluralise(count: number) {
  if (count === 1) {
    return "";
  }
  if (count >= 2 && count <= 4) {
    return "y";
  }
  return "ów";
}

function resolveArticleHero(article: ContentSummary) {
  const providedSrc = article.hero?.image?.src ?? article.meta?.heroImageSrc;
  const isBroken =
    providedSrc === "/img/article_image.jpeg" ||
    providedSrc?.endsWith(".webp.jpeg") ||
    providedSrc?.endsWith(".webp.webp");

  if (providedSrc && !isBroken) {
    return {
      src: providedSrc,
      alt: article.hero?.image?.alt ?? article.meta?.heroImageAlt,
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

function AuthorJsonLd({
  name,
  bio,
  avatar,
  links = [],
}: {
  name: string;
  bio: string;
  avatar: string;
  links?: { href: string }[];
}) {
  const payload = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    description: bio,
    image: avatar,
    sameAs: links.map((link) => link.href),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
