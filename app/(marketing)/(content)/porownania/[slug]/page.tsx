import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Frontmatter } from "@/app/lib/frontmatter";
import { ComparisonRepository } from "@/app/lib/content/repositories";
import type { ContentSummary } from "@/app/lib/content/repositories";
import { comparisonTaxonomyCatalog } from "@/app/lib/content/comparisonTaxonomy";
import { ArticleStructuredDataBuilder } from "@/app/lib/seo/ArticleStructuredDataBuilder";
import { ReviewStructuredDataBuilder } from "@/app/lib/seo/ReviewStructuredDataBuilder";
import { FaqStructuredDataBuilder } from "@/app/lib/seo/FaqStructuredDataBuilder";
import { extractFaqItems } from "@/app/lib/content/faqExtractor";
import { MarkdownRenderer } from "@/app/ui/MarkdownRenderer";
import {
  StructuredDataScript,
  ArticleMetaBadges,
  ArticleSummaryBullets,
  ArticleCtaGroup,
  TaxonomyChips,
  ArticleSharePanel,
} from "@/app/ui";
import { defaultSiteUrlFactory } from "@/app/lib/url/SiteUrlFactory";

const comparisonRepository = new ComparisonRepository();
const comparisonStructuredDataBuilder = new ArticleStructuredDataBuilder();
const reviewStructuredDataBuilder = new ReviewStructuredDataBuilder();
const comparisonFaqBuilder = new FaqStructuredDataBuilder();

interface ComparisonPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return comparisonRepository.listSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ComparisonPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const comparison = comparisonRepository.getComparison(resolvedParams.slug);
  if (!comparison) {
    return {};
  }
  const { frontmatter } = comparison;
  return {
    title: frontmatter.seo?.title ?? frontmatter.title,
    description: frontmatter.seo?.description ?? comparison.excerpt,
  };
}

export default async function ComparisonPage({ params }: ComparisonPageProps) {
  const resolvedParams = await params;
  const comparison = comparisonRepository.getComparison(resolvedParams.slug);
  if (!comparison) {
    notFound();
  }

  const { frontmatter, content, excerpt, slug } = comparison;
  const renderer = new MarkdownRenderer(content);
  const categories = comparisonTaxonomyCatalog.resolveCategories(
    frontmatter.taxonomy?.categories,
  );
  const tags = comparisonTaxonomyCatalog.resolveTags(
    frontmatter.taxonomy?.tags,
  );
  const metaCategoryBadges = categories
    .filter((category): category is NonNullable<(typeof categories)[number]> =>
      Boolean(category),
    )
    .map((category) => ({
      label: category.label,
      slug: category.slug,
    }));
  const tagBadges = tags
    .filter((tag): tag is NonNullable<(typeof tags)[number]> => Boolean(tag))
    .map((tag) => ({
      label: tag.label,
      slug: tag.slug,
    }));

  const heroImage = resolveComparisonHeroImage(frontmatter);
  const canonicalPath = frontmatter.path ?? `/porownania/${slug}/`;
  const shareUrl = defaultSiteUrlFactory.build(canonicalPath);
  const structuredData = comparisonStructuredDataBuilder.build({
    title: frontmatter.title,
    description: frontmatter.seo?.description ?? excerpt,
    canonicalPath,
    authorName: frontmatter.meta?.author,
    datePublished: frontmatter.date,
    dateModified: frontmatter.meta?.updatedAt,
    tags: frontmatter.taxonomy?.tags,
    categories: categories
      .map((category) => category?.label)
      .filter((label): label is string => Boolean(label)),
    image: heroImage,
  });
  const reviewStructuredData = frontmatter.meta?.review
    ? reviewStructuredDataBuilder.build({
        canonicalPath: frontmatter.path ?? `/porownania/${slug}/`,
        itemName: frontmatter.meta.review.productName ?? frontmatter.title,
        itemUrl: frontmatter.meta.review.productUrl,
        ratingValue: frontmatter.meta.review.ratingValue,
        bestRating: frontmatter.meta.review.bestRating,
        worstRating: frontmatter.meta.review.worstRating,
        reviewBody: frontmatter.meta.review.body,
        authorName: frontmatter.meta.review.author ?? frontmatter.meta?.author,
        pros: frontmatter.meta.review.pros,
        cons: frontmatter.meta.review.cons,
      })
    : null;
  const faqItems = extractFaqItems(content);
  const faqStructuredData = faqItems.length
    ? comparisonFaqBuilder.build(faqItems)
    : null;
  const structuredDataPayloads = [
    structuredData,
    reviewStructuredData,
    faqStructuredData,
  ].filter(Boolean) as Record<string, unknown>[];
  const relatedComparisons = getRelatedComparisons(
    slug,
    frontmatter.taxonomy?.categories ?? [],
    frontmatter.taxonomy?.tags ?? [],
  );

  return (
    <section className="section section--surface">
      <StructuredDataScript
        id="comparison-structured-data"
        data={structuredDataPayloads.length ? structuredDataPayloads : null}
      />
      <div className="pbk-container pbk-stack">
        <header className="pbk-stack pbk-stack--tight">
          <h1>{frontmatter.title}</h1>
          {frontmatter.hero?.subheading ? (
            <p>{frontmatter.hero.subheading}</p>
          ) : null}
          <ArticleMetaBadges
            categories={metaCategoryBadges}
            difficulty={frontmatter.meta?.difficulty}
            duration={frontmatter.meta?.duration}
          />
        </header>
        <ArticleSharePanel title={frontmatter.title} url={shareUrl} />
        <ArticleSummaryBullets
          bullets={frontmatter.meta?.summaryBullets}
          heading="Najważniejsze różnice"
        />
        <article className="prose">
          {renderer.render()}
          <ArticleCtaGroup
            primary={frontmatter.meta?.primaryCta ?? undefined}
            secondary={frontmatter.meta?.secondaryCta ?? undefined}
            isAffiliate={Boolean(frontmatter.meta?.hasAffiliateLinks)}
          />
          {faqItems.length ? (
            <section
              className="comparison-faq pbk-card pbk-stack"
              aria-labelledby="comparison-faq"
            >
              <h2 id="comparison-faq">Najczęstsze pytania</h2>
              <dl className="comparison-faq__list">
                {faqItems.map((item) => (
                  <div key={item.question} className="comparison-faq__item">
                    <dt>{item.question}</dt>
                    <dd>{item.answer}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}
        </article>
        {relatedComparisons.length ? (
          <section
            className="comparison-related"
            aria-labelledby="related-comparisons"
          >
            <h2 id="related-comparisons">Zobacz też</h2>
            <div className="comparison-related__grid">
              {relatedComparisons.map((entry) => (
                <article key={entry.slug} className="comparison-related__card">
                  <h3>
                    <Link href={entry.path}>{entry.title}</Link>
                  </h3>
                  {entry.description ? <p>{entry.description}</p> : null}
                </article>
              ))}
            </div>
          </section>
        ) : null}
        <TaxonomyChips categories={metaCategoryBadges} tags={tagBadges} />
      </div>
    </section>
  );
}

function resolveComparisonHeroImage(frontmatter: Frontmatter) {
  if (frontmatter.hero?.image?.src) {
    return {
      src: frontmatter.hero.image.src,
      alt: frontmatter.hero.image.alt,
      width: frontmatter.hero.image.width,
      height: frontmatter.hero.image.height,
    };
  }

  if (frontmatter.meta?.heroImageSrc && frontmatter.meta.heroImageAlt) {
    return {
      src: frontmatter.meta.heroImageSrc,
      alt: frontmatter.meta.heroImageAlt,
      width: frontmatter.meta.heroImageWidth,
      height: frontmatter.meta.heroImageHeight,
    };
  }

  return null;
}

function getRelatedComparisons(
  slug: string,
  categories: string[],
  tags: string[],
  limit = 3,
): ContentSummary[] {
  const categorySet = new Set(categories);
  const tagSet = new Set(tags);
  const summaries = comparisonRepository
    .listSummaries()
    .filter((entry) => entry.slug !== slug);
  const scored = summaries
    .map((entry) => {
      const entryCategories = entry.taxonomy?.categories ?? [];
      const entryTags = entry.taxonomy?.tags ?? [];
      let score = 0;
      entryCategories.forEach((category) => {
        if (categorySet.has(category)) {
          score += 2;
        }
      });
      entryTags.forEach((tag) => {
        if (tagSet.has(tag)) {
          score += 1;
        }
      });
      return { entry, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ entry }) => entry);

  if (scored.length) {
    return scored;
  }

  return summaries.slice(0, limit);
}
