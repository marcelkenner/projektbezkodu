import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Frontmatter } from "@/app/lib/frontmatter";
import { ComparisonRepository } from "@/app/lib/content/repositories";
import { comparisonTaxonomyCatalog } from "@/app/lib/content/comparisonTaxonomy";
import { ArticleStructuredDataBuilder } from "@/app/lib/seo/ArticleStructuredDataBuilder";
import { ReviewStructuredDataBuilder } from "@/app/lib/seo/ReviewStructuredDataBuilder";
import { MarkdownRenderer } from "@/app/ui/MarkdownRenderer";
import { Badge, StructuredDataScript } from "@/app/ui";

const comparisonRepository = new ComparisonRepository();
const comparisonStructuredDataBuilder = new ArticleStructuredDataBuilder();
const reviewStructuredDataBuilder = new ReviewStructuredDataBuilder();

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

  const heroImage = resolveComparisonHeroImage(frontmatter);
  const structuredData = comparisonStructuredDataBuilder.build({
    title: frontmatter.title,
    description: frontmatter.seo?.description ?? excerpt,
    canonicalPath: frontmatter.path ?? `/porownania/${slug}/`,
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
        itemName:
          frontmatter.meta.review.productName ?? frontmatter.title,
        itemUrl: frontmatter.meta.review.productUrl,
        ratingValue: frontmatter.meta.review.ratingValue,
        bestRating: frontmatter.meta.review.bestRating,
        worstRating: frontmatter.meta.review.worstRating,
        reviewBody: frontmatter.meta.review.body,
        authorName:
          frontmatter.meta.review.author ?? frontmatter.meta?.author,
        pros: frontmatter.meta.review.pros,
        cons: frontmatter.meta.review.cons,
      })
    : null;
  const structuredDataPayloads = [structuredData, reviewStructuredData].filter(
    Boolean,
  ) as Record<string, unknown>[];

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
          {categories.length ? (
            <div className="pbk-inline-list">
              {categories.map((category) => (
                <Badge key={category.slug} variant="accent">
                  {category.label}
                </Badge>
              ))}
            </div>
          ) : null}
          {tags.length ? (
            <div className="pbk-inline-list">
              {tags.map((tag) => (
                <Badge key={tag.slug} variant="neutral">
                  {tag.label}
                </Badge>
              ))}
            </div>
          ) : null}
        </header>
        <article className="prose">{renderer.render()}</article>
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
