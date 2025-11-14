import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GlossaryRepository } from "@/app/lib/content/repositories";
import { MarkdownRenderer } from "@/app/ui/MarkdownRenderer";

const glossaryRepository = new GlossaryRepository();

interface GlossaryPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return glossaryRepository.listSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: GlossaryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const term = glossaryRepository.getTerm(resolvedParams.slug);
  if (!term) {
    return {};
  }

  const { frontmatter } = term;
  return {
    title: `${frontmatter.title} – Słownik ProjektBezKodu`,
    description: term.excerpt,
  };
}

export default async function GlossaryTermPage({ params }: GlossaryPageProps) {
  const resolvedParams = await params;
  const term = glossaryRepository.getTerm(resolvedParams.slug);
  if (!term) {
    notFound();
  }

  const { frontmatter, content } = term;
  const renderer = new MarkdownRenderer(content);

  return (
    <section className="section section--surface">
      <div className="pbk-container pbk-stack">
        <header className="pbk-stack pbk-stack--tight">
          <h1>{frontmatter.title}</h1>
          {frontmatter.hero?.subheading ? (
            <p>{frontmatter.hero.subheading}</p>
          ) : null}
        </header>
        <article className="prose">{renderer.render()}</article>
      </div>
    </section>
  );
}
