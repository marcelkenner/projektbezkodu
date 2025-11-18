import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GlossaryRepository } from "@/app/lib/content/repositories";
import { ArticleSummaryBullets, ArticleCtaGroup } from "@/app/ui";
import { getCopy } from "@/app/lib/copy";
import "../glossary.module.css";
import { MarkdownRenderer } from "@/app/ui/MarkdownRenderer";
import { GlossaryPromo } from "../GlossaryPromo";

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
  const promo = getCopy("glossary").cta;
  const takeaways = frontmatter.meta?.summaryBullets ?? [];
  const primaryCta = frontmatter.meta?.primaryCta;
  const secondaryCta = frontmatter.meta?.secondaryCta;

  return (
    <section className="section section--surface">
      <div className="pbk-container pbk-stack">
        <div className="glossary-term__card pbk-stack pbk-stack--tight">
          <p className="pbk-card__meta">Definicja</p>
          <h1>{frontmatter.title}</h1>
          {frontmatter.hero?.subheading ? (
            <p>{frontmatter.hero.subheading}</p>
          ) : null}
          {takeaways.length ? (
            <ArticleSummaryBullets
              bullets={takeaways}
              heading="Co zapamiętać"
            />
          ) : null}
        </div>
        <article className="glossary-term__definition pbk-stack pbk-stack--tight">
          <div className="prose">{renderer.render()}</div>
          <ArticleCtaGroup
            primary={primaryCta ?? undefined}
            secondary={secondaryCta ?? undefined}
            helperText={
              frontmatter.meta?.hasAffiliateLinks
                ? "Niektóre linki są afiliacyjne – polecamy tylko rozwiązania, których sami używamy."
                : undefined
            }
            isAffiliate={Boolean(frontmatter.meta?.hasAffiliateLinks)}
          />
        </article>
        <GlossaryPromo promo={promo} />
      </div>
    </section>
  );
}
