/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, Info } from "@phosphor-icons/react/dist/ssr";
import type { Frontmatter } from "@/app/lib/frontmatter";
import { ArticleRepository } from "@/app/lib/content/repositories";
import { articleTaxonomyCatalog } from "@/app/lib/content/articleTaxonomy";
import { defaultSiteUrlFactory } from "@/app/lib/url/SiteUrlFactory";
import { ArticleStructuredDataBuilder } from "@/app/lib/seo/ArticleStructuredDataBuilder";
import { MarkdownRenderer } from "@/app/ui/MarkdownRenderer";
import { TableOfContents, StructuredDataScript } from "@/app/ui";
import { getCopy } from "@/app/lib/copy";
import { ArticleSharePanel } from "../ArticleSharePanel";
import "../article.module.css";

const articleRepository = new ArticleRepository();
const allSummaries = articleRepository.listSummaries();
const articleStructuredDataBuilder = new ArticleStructuredDataBuilder();

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return articleRepository.listSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const article = articleRepository.getArticle(slug);
  if (!article) {
    return {};
  }
  const { frontmatter, excerpt } = article;
  const summary = allSummaries.find((entry) => entry.slug === slug);
  const canonical = summary?.path ?? frontmatter.path ?? `/artykuly/${slug}/`;
  const shareUrl = defaultSiteUrlFactory.build(canonical);
  const shareTitle = frontmatter.seo?.title ?? frontmatter.title;
  const shareDescription = frontmatter.seo?.description ?? excerpt;
  const shareImage =
    frontmatter.seo?.image ??
    frontmatter.meta?.heroImageSrc ??
    frontmatter.hero?.image?.src;
  const shareImageUrl = shareImage
    ? defaultSiteUrlFactory.build(shareImage)
    : undefined;
  const shareImageAlt =
    frontmatter.hero?.image?.alt ??
    frontmatter.meta?.heroImageAlt ??
    shareTitle;
  const shareImageWidth =
    frontmatter.meta?.heroImageWidth ?? frontmatter.hero?.image?.width ?? 1200;
  const shareImageHeight =
    frontmatter.meta?.heroImageHeight ??
    frontmatter.hero?.image?.height ??
    630;
  return {
    title: shareTitle,
    description: shareDescription,
    keywords: frontmatter.seo?.keywords,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: shareUrl,
      title: shareTitle,
      description: shareDescription,
      publishedTime: frontmatter.date,
      modifiedTime: frontmatter.meta?.updatedAt,
      authors: frontmatter.meta?.author
        ? [frontmatter.meta.author]
        : undefined,
      images: shareImageUrl
        ? [
            {
              url: shareImageUrl,
              width: shareImageWidth,
              height: shareImageHeight,
              alt: shareImageAlt,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description: shareDescription,
      images: shareImageUrl ? [shareImageUrl] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const article = articleRepository.getArticle(slug);
  if (!article) {
    notFound();
  }

  const { frontmatter, content, excerpt } = article;
  const renderer = new MarkdownRenderer(content);
  const headings = renderer.getHeadings();
  const copy = getCopy("articles");
  const authorsMap = new Map(
    (copy.authors ?? []).map((author) => [author.slug, author]),
  );
  const categories = articleTaxonomyCatalog.resolveCategories(
    frontmatter.taxonomy?.categories,
  );
  const primaryCategory = categories.at(0);
  const author = frontmatter.meta?.author
    ? authorsMap.get(frontmatter.meta.author)
    : undefined;
  const readingTime = frontmatter.meta?.duration;
  const publishedDate = formatDate(frontmatter.date);
  const updatedDate = formatDate(frontmatter.meta?.updatedAt);
  const relatedArticles = articleRepository.getRelatedArticles(slug, 3);
  const adjacent = findAdjacentArticles(slug);
  const hasAffiliateLinks = Boolean(frontmatter.meta?.hasAffiliateLinks);
  const primaryCta = frontmatter.meta?.primaryCta;
  const secondaryCta = frontmatter.meta?.secondaryCta;
  const hasToc = headings.length > 0;
  const layoutClassName = hasToc
    ? "article-page__layout article-page__layout--with-toc"
    : "article-page__layout";
  const summary = allSummaries.find((entry) => entry.slug === slug);
  const canonicalPath =
    summary?.path ?? frontmatter.path ?? `/artykuly/${slug}/`;
  const articleUrl = defaultSiteUrlFactory.build(canonicalPath);
  const heroImage = resolveHeroImage(frontmatter);
  const articleStructuredData = articleStructuredDataBuilder.build({
    title: frontmatter.title,
    description: frontmatter.seo?.description ?? excerpt,
    canonicalPath,
    authorName: author?.name ?? frontmatter.meta?.author,
    datePublished: frontmatter.date,
    dateModified: frontmatter.meta?.updatedAt,
    tags: frontmatter.taxonomy?.tags,
    categories: categories
      .map((category) => category?.label)
      .filter((label): label is string => Boolean(label)),
    image: heroImage,
  });

  return (
    <section className="article-page" id="content">
      <StructuredDataScript
        id="article-structured-data"
        data={articleStructuredData}
      />
      <div className="pbk-container">
        <nav className="article-page__breadcrumbs" aria-label="Okruszki">
          <Link href="/">Strona główna</Link>
          <span aria-hidden="true">›</span>
          <Link href="/artykuly">Artykuły</Link>
          {primaryCategory ? (
            <>
              <span aria-hidden="true">›</span>
              <Link href={`/kategoria/${primaryCategory.slug}/`}>
                {primaryCategory.label}
              </Link>
            </>
          ) : null}
          <span aria-hidden="true">›</span>
          <span aria-current="page">{frontmatter.title}</span>
        </nav>

        <header className="article-page__header">
          <h1>{frontmatter.title}</h1>
          {frontmatter.hero?.subheading ? (
            <p>{frontmatter.hero.subheading}</p>
          ) : null}
          <p className="article-page__meta">
            {readingTime ? (
              <>
                <Clock
                  aria-hidden="true"
                  className="article-page__metaIcon"
                  weight="bold"
                />
                <span>{readingTime}</span>
              </>
            ) : null}
            {readingTime && publishedDate ? (
              <span aria-hidden="true">•</span>
            ) : null}
            {publishedDate ? (
              <time dateTime={frontmatter.date ?? ""}>{publishedDate}</time>
            ) : null}
            {author ? (
              <>
                <span aria-hidden="true">•</span>
                <Link href="/o-nas/">{author.name}</Link>
              </>
            ) : null}
            {updatedDate ? (
              <>
                <span aria-hidden="true">•</span>
                <span>
                  Zaktualizowano:{" "}
                  <time dateTime={frontmatter.meta?.updatedAt ?? ""}>
                    {updatedDate}
                  </time>
                </span>
              </>
            ) : null}
          </p>
          {hasAffiliateLinks ? (
            <aside className="article-page__disclosure" role="note">
              <Info
                aria-hidden="true"
                className="article-page__metaIcon"
                weight="bold"
              />
              <span>
                W tekście są linki partnerskie. Nic nie dopłacasz, a wspierasz
                poradniki.
              </span>
            </aside>
          ) : null}
        </header>

        <ArticleSharePanel title={frontmatter.title} url={articleUrl} />

        <div className={layoutClassName}>
          {hasToc ? (
            <div className="article-page__toc">
              <TableOfContents items={headings} />
            </div>
          ) : null}
          <article className="prose">
            {renderer.render()}
            {(primaryCta || secondaryCta) && (
              <>
                <h2>Następny krok</h2>
                <div className="article-page__cta">
                  {primaryCta ? (
                    <Link
                      href={primaryCta.href}
                      className="pbk-button pbk-button--primary"
                      rel={primaryCta.rel ?? undefined}
                    >
                      {primaryCta.label}
                    </Link>
                  ) : null}
                  {secondaryCta ? (
                    <Link
                      href={secondaryCta.href}
                      className="pbk-button pbk-button--secondary"
                    >
                      {secondaryCta.label}
                    </Link>
                  ) : null}
                </div>
              </>
            )}
          </article>
        </div>

        <section className="article-page__author">
          <div className="article-page__authorHeader">
            <img
              className="article-page__authorAvatar"
              src={author?.avatar ?? "/img/authors/marcel-nowak.webp"}
              alt={
                author
                  ? `Zdjęcie autora: ${author.name}`
                  : "Zdjęcie autora ProjektBezKodu"
              }
              width={72}
              height={72}
              loading="lazy"
              decoding="async"
            />
            <div>
              <p className="pbk-card__meta">Autor</p>
              <p>{author?.name ?? "ProjektBezKodu"}</p>
            </div>
          </div>
          <p className="pbk-card__meta">
            {author?.bio ??
              "Tworzymy poradniki, checklisty i narzędzia, które pozwalają rozwijać serwis bez kodu."}
          </p>
        </section>

        {relatedArticles.length ? (
          <section
            className="article-page__related"
            aria-labelledby="related-heading"
          >
            <h2 id="related-heading">Powiązane artykuły</h2>
            <div className="article-page__relatedGrid">
              {relatedArticles.map((related) => (
                <div key={related.slug} className="article-page__relatedCard">
                  <h3>
                    <Link href={related.path}>{related.title}</Link>
                  </h3>
                  {related.description ? (
                    <p className="article-page__relatedMeta">
                      {related.description}
                    </p>
                  ) : null}
                  <Link className="articles-card__link" href={related.path}>
                    Czytaj →
                  </Link>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <nav
          className="article-page__prevNext"
          aria-label="Nawigacja między artykułami"
        >
          {adjacent.previous ? (
            <Link rel="prev" href={adjacent.previous.path}>
              « {adjacent.previous.title}
            </Link>
          ) : (
            <span />
          )}
          {adjacent.next ? (
            <Link rel="next" href={adjacent.next.path}>
              {adjacent.next.title} »
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>
    </section>
  );
}

function formatDate(isoDate?: string): string {
  if (!isoDate) {
    return "";
  }
  const parsed = Date.parse(isoDate);
  if (Number.isNaN(parsed)) {
    return "";
  }
  return new Intl.DateTimeFormat("pl-PL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(parsed);
}

function findAdjacentArticles(slug: string) {
  const sorted = allSummaries.slice().sort((a, b) => {
    const dateA = a.date ? Date.parse(a.date) : 0;
    const dateB = b.date ? Date.parse(b.date) : 0;
    if (dateA === dateB) {
      return a.title.localeCompare(b.title, "pl");
    }
    return dateB - dateA;
  });
  const index = sorted.findIndex((article) => article.slug === slug);
  return {
    previous: index > 0 ? sorted[index - 1] : undefined,
    next:
      index >= 0 && index < sorted.length - 1 ? sorted[index + 1] : undefined,
  };
}

function resolveHeroImage(frontmatter: Frontmatter) {
  if (frontmatter.hero?.image?.src) {
    return {
      src: frontmatter.hero.image.src,
      alt: frontmatter.hero.image.alt,
      width: frontmatter.hero.image.width,
      height: frontmatter.hero.image.height,
    };
  }

  if (
    frontmatter.meta?.heroImageSrc &&
    frontmatter.meta.heroImageAlt
  ) {
    return {
      src: frontmatter.meta.heroImageSrc,
      alt: frontmatter.meta.heroImageAlt,
      width: frontmatter.meta.heroImageWidth,
      height: frontmatter.meta.heroImageHeight,
    };
  }

  return null;
}
