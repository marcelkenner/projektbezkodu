import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComparisonRepository } from "@/app/lib/content/repositories";
import { comparisonTaxonomyCatalog } from "@/app/lib/content/comparisonTaxonomy";
import { MarkdownRenderer } from "@/app/ui/MarkdownRenderer";
import { Badge } from "@/app/ui";

const comparisonRepository = new ComparisonRepository();

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

export default async function ComparisonPage({
  params,
}: ComparisonPageProps) {
  const resolvedParams = await params;
  const comparison = comparisonRepository.getComparison(resolvedParams.slug);
  if (!comparison) {
    notFound();
  }

  const { frontmatter, content } = comparison;
  const renderer = new MarkdownRenderer(content);
  const categories = comparisonTaxonomyCatalog.resolveCategories(
    frontmatter.taxonomy?.categories,
  );
  const tags = comparisonTaxonomyCatalog.resolveTags(
    frontmatter.taxonomy?.tags,
  );

  return (
    <section className="section section--surface">
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
