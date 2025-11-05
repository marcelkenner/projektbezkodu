import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TutorialRepository } from "@/app/lib/content/repositories";
import { tutorialTaxonomyCatalog } from "@/app/lib/content/tutorialTaxonomy";
import { MarkdownRenderer } from "@/app/ui/MarkdownRenderer";
import { Badge } from "@/app/ui";

const tutorialRepository = new TutorialRepository();

interface TutorialPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return tutorialRepository.listSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: TutorialPageProps): Metadata {
  const tutorial = tutorialRepository.getTutorial(params.slug);
  if (!tutorial) {
    return {};
  }

  const { frontmatter } = tutorial;
  return {
    title: frontmatter.seo?.title ?? frontmatter.title,
    description: frontmatter.seo?.description ?? tutorial.excerpt,
  };
}

export default function TutorialPage({ params }: TutorialPageProps) {
  const tutorial = tutorialRepository.getTutorial(params.slug);
  if (!tutorial) {
    notFound();
  }

  const { frontmatter, content } = tutorial;
  const renderer = new MarkdownRenderer(content);
  const difficulty = frontmatter.meta?.difficulty;
  const duration = frontmatter.meta?.duration;
  const categories = tutorialTaxonomyCatalog.resolveCategories(
    frontmatter.taxonomy?.categories,
  );
  const tags = tutorialTaxonomyCatalog.resolveTags(frontmatter.taxonomy?.tags);

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
          <div className="pbk-inline-list">
            {difficulty ? <Badge variant="accent">{difficulty}</Badge> : null}
            {duration ? <Badge variant="neutral">{duration}</Badge> : null}
            {tags.map((tag) => (
              <Badge key={tag.slug} variant="neutral">
                {tag.label}
              </Badge>
            ))}
          </div>
        </header>
        <article className="prose">
          {renderer.render()}
        </article>
      </div>
    </section>
  );
}
