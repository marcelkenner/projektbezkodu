import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GlossaryRepository } from "@/app/lib/content/repositories";
import Link from "next/link";
import {
  ArticleSummaryBullets,
  ArticleCtaGroup,
  ArticleSharePanel,
  TaxonomyChips,
} from "@/app/ui";
import { getCopy } from "@/app/lib/copy";
import styles from "../glossary.module.css";
import { MarkdownRenderer } from "@/app/ui/MarkdownRenderer";
import { GlossaryPromo } from "../GlossaryPromo";
import { RandomArticlesSection } from "../../components/RandomArticlesSection";
import { BreadcrumbComposer } from "@/app/lib/navigation/BreadcrumbComposer";
import { defaultSiteUrlFactory } from "@/app/lib/url/SiteUrlFactory";

const glossaryRepository = new GlossaryRepository();
const breadcrumbComposer = new BreadcrumbComposer();

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
  const canonicalPath = frontmatter.path ?? `/glossary/${frontmatter.slug}/`;
  const canonicalUrl = defaultSiteUrlFactory.build(canonicalPath);
  const breadcrumbs = breadcrumbComposer.compose(
    canonicalPath,
    frontmatter.title,
  );
  const tags =
    frontmatter.taxonomy?.tags?.map((tag) => ({ label: tag, slug: tag })) ?? [];

  return (
    <section className="section section--surface">
      <div className={`pbk-container pbk-stack ${styles.glossaryTermLayout}`}>
        <div className={`${styles.glossaryTermHero} pbk-stack pbk-stack--tight`}>
          <nav aria-label="Okruszki" className="pbk-inline-list">
            {breadcrumbs.map((crumb, index) => {
              const key = `${crumb.label}-${crumb.href ?? "current"}`;
              const isLast = index === breadcrumbs.length - 1;
              return (
                <span key={key}>
                  {crumb.href ? (
                    <Link className="pbk-inline-link" href={crumb.href}>
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="pbk-card__meta">{crumb.label}</span>
                  )}
                  {!isLast ? " / " : null}
                </span>
              );
            })}
          </nav>
          <p className="pbk-card__meta">Definicja</p>
          <h1>{frontmatter.title}</h1>
          {frontmatter.hero?.subheading ? (
            <p className={styles.glossaryTermLede}>{frontmatter.hero.subheading}</p>
          ) : null}
          <article className={`${styles.glossaryTermDefinition} pbk-stack pbk-stack--tight`}>
            <div className="prose">{renderer.render()}</div>
            {takeaways.length ? (
              <ArticleSummaryBullets
                bullets={takeaways}
                heading="Co zapamiętać"
              />
            ) : null}
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
          <ArticleSharePanel title={frontmatter.title} url={canonicalUrl} />
        </div>

        <div className={styles.glossaryTermBody}>
          <aside className={`${styles.glossaryTermAside} pbk-stack pbk-stack--tight`}>
            <GlossaryPromo promo={promo} />
            <RandomArticlesSection currentPath={canonicalPath} />
            <TaxonomyChips categories={[]} tags={tags} />
          </aside>
        </div>
      </div>
    </section>
  );
}
