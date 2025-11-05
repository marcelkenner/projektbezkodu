import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleRepository } from "@/app/lib/content/repositories";
import { articleTaxonomyCatalog } from "@/app/lib/content/articleTaxonomy";
import { MarkdownRenderer } from "@/app/ui/MarkdownRenderer";
import { Badge, TableOfContents } from "@/app/ui";

const articleRepository = new ArticleRepository();

interface ArticlePageProps {
  params: { slug: string };
}

interface BadgeGroupProps {
  title: string;
  items: Array<{ slug: string; label: string }>;
  variant: "accent" | "neutral";
}

function BadgeGroup({ title, items, variant }: BadgeGroupProps) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="pbk-stack pbk-stack--tight">
      <span className="pbk-input__description">{title}</span>
      <div className="pbk-inline-list">
        {items.map((item) => (
          <Badge key={item.slug} variant={variant}>
            {item.label}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return articleRepository.listSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: ArticlePageProps): Metadata {
  const article = articleRepository.getArticle(params.slug);
  if (!article) {
    return {};
  }

  const { frontmatter } = article;
  return {
    title: frontmatter.seo?.title ?? frontmatter.title,
    description: frontmatter.seo?.description ?? article.excerpt,
  };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const article = articleRepository.getArticle(params.slug);
  if (!article) {
    notFound();
  }

  const { frontmatter, content } = article;
  const categories = articleTaxonomyCatalog.resolveCategories(
    frontmatter.taxonomy?.categories,
  );
  const tags = articleTaxonomyCatalog.resolveTags(frontmatter.taxonomy?.tags);
  const tools = (frontmatter.meta?.tools ?? []).map((tool) => ({
    slug: tool,
    label: tool,
  }));
  const renderer = new MarkdownRenderer(content);
  const headings = renderer.getHeadings();
  const relatedArticles = articleRepository.getRelatedArticles(params.slug);

  return (
    <section className="section section--surface">
      <div className="pbk-container pbk-stack">
        <header className="pbk-stack pbk-stack--tight">
          <h1>{frontmatter.title}</h1>
          {frontmatter.hero?.subheading ? (
            <p>{frontmatter.hero.subheading}</p>
          ) : null}
          <BadgeGroup title="Kategorie:" items={categories} variant="accent" />
          <BadgeGroup title="Tagi:" items={tags} variant="neutral" />
          <BadgeGroup title="Narzędzia w artykule:" items={tools} variant="neutral" />
        </header>
        <TableOfContents items={headings} />
        <article className="prose">
          {renderer.render()}
        </article>
        {relatedArticles.length ? (
          <aside className="pbk-stack">
            <h2>Powiązane artykuły</h2>
            <div className="section__grid">
              {relatedArticles.map((related) => (
                <div key={related.slug} className="pbk-card pbk-stack">
                  <h3>{related.title}</h3>
                  {related.description ? (
                    <p className="pbk-card__meta">{related.description}</p>
                  ) : null}
                  <Link
                    className="pbk-button pbk-button--tertiary"
                    href={related.path}
                  >
                    Czytaj artykuł
                  </Link>
                </div>
              ))}
            </div>
          </aside>
        ) : null}
      </div>
    </section>
  );
}
