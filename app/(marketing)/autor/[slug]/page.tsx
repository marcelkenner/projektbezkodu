/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookOpen, Clock, Rss } from "@phosphor-icons/react/dist/ssr";
import { getCopy } from "@/app/lib/copy";
import { AuthorDirectory } from "@/app/lib/content/authorDirectory";
import { articleTaxonomyCatalog } from "@/app/lib/content/articleTaxonomy";
import { ArticleCard } from "@/app/(marketing)/(content)/artykuly/ArticleCard";
import "./../author.module.css";

const authorDirectory = new AuthorDirectory();
const articlesCopy = getCopy("articles");

export function generateStaticParams() {
  return authorDirectory.listProfiles().map((profile) => ({
    slug: profile.slug,
  }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const profile = authorDirectory.getProfile(params.slug);
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

export default function AuthorPage({ params }: { params: { slug: string } }) {
  const profile = authorDirectory.getProfile(params.slug);
  if (!profile) {
    notFound();
  }

  const stats = authorDirectory.getStats(params.slug);
  const articles = authorDirectory.listArticles(params.slug);
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
          <nav className="author-page__grid" aria-label="Artykuły autora">
            {articles.map((article) => {
              const primaryCategory = (article.taxonomy?.categories ?? [])[0];
              const category = primaryCategory
                ? articleTaxonomyCatalog.getCategory(primaryCategory)
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
