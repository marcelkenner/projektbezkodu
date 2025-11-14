/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/app/ui";
import { MarkdownRenderer } from "@/app/ui/MarkdownRenderer";
import { getCopy } from "@/app/lib/copy";
import {
  CaseStudyRepository,
  type MarkdownDocument,
} from "@/app/lib/content/repositories";
import "./case-study.module.css";

const copy = getCopy("case-studies");
const repository = new CaseStudyRepository();

export function generateStaticParams() {
  return repository.listSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const caseStudy = repository.getCaseStudy(resolvedParams.slug);
  if (!caseStudy) {
    return {};
  }
  const { frontmatter } = caseStudy;
  const seo = frontmatter.seo;
  return {
    title: seo?.title ?? frontmatter.title ?? copy.seo.fallbackTitle,
    description:
      seo?.description ?? caseStudy.excerpt ?? copy.seo.fallbackDescription,
    alternates: {
      canonical:
        seo?.canonical ?? `${copy.seo.canonicalPrefix}/${resolvedParams.slug}`,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const document = repository.getCaseStudy(resolvedParams.slug);
  if (!document) {
    notFound();
  }

  const viewModel = new CaseStudyViewModel(document);
  const renderer = viewModel.getRenderer();

  return (
    <section className="case-study section section--surface" id="content">
      <div className="pbk-container case-study__layout">
        <header className="case-study__header pbk-stack">
          <nav
            className="case-study__breadcrumbs"
            aria-label={copy.hero.breadcrumbs.listLabel}
          >
            <ol>
              <li>
                <Link href="/">{copy.hero.breadcrumbs.homeLabel}</Link>
              </li>
              <li>
                <Link href={copy.hero.breadcrumbs.listHref}>
                  {copy.hero.breadcrumbs.listLabel}
                </Link>
              </li>
              <li aria-current="page">{viewModel.getTitle()}</li>
            </ol>
          </nav>
          <div className="case-study__hero pbk-stack pbk-stack--tight">
            <h1>{viewModel.getTitle()}</h1>
            {viewModel.getSubtitle() ? <p>{viewModel.getSubtitle()}</p> : null}
            <dl className="case-study__meta">
              {viewModel.getMeta().map((meta) => (
                <div key={meta.label}>
                  <dt>{meta.label}</dt>
                  <dd>{meta.value}</dd>
                </div>
              ))}
            </dl>
            {viewModel.getHeroImage() ? (
              <img
                className="case-study__image"
                src={viewModel.getHeroImage()!.src}
                alt={viewModel.getHeroImage()!.alt}
                width={viewModel.getHeroImage()!.width}
                height={viewModel.getHeroImage()!.height}
                loading="lazy"
                decoding="async"
              />
            ) : null}
          </div>
        </header>

        {viewModel.getSummary().length ? (
          <section className="case-study__summary pbk-card">
            <h2>{copy.sections.summary}</h2>
            <ul>
              {viewModel.getSummary().map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {viewModel.getMetrics().length ? (
          <section className="case-study__metrics pbk-card">
            <h2>{copy.sections.metrics}</h2>
            <dl>
              {viewModel.getMetrics().map((metric) => (
                <div key={metric.label}>
                  <dt>{metric.label}</dt>
                  <dd>{metric.value}</dd>
                  {metric.description ? <p>{metric.description}</p> : null}
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        <article className="case-study__content prose">
          {renderer.render()}
        </article>

        {viewModel.getStack().length ? (
          <section className="case-study__stack pbk-card pbk-stack pbk-stack--tight">
            <h2>{copy.sections.stack}</h2>
            <div className="case-study__stackTags">
              {viewModel.getStack().map((tool) => (
                <Badge key={tool} variant="accent">
                  {tool}
                </Badge>
              ))}
            </div>
          </section>
        ) : null}

        {viewModel.getLessons().length ? (
          <section className="case-study__lessons pbk-card">
            <h2>{copy.sections.lessons}</h2>
            <ul>
              {viewModel.getLessons().map((lesson) => (
                <li key={lesson}>{lesson}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <footer className="case-study__cta pbk-card">
          <div className="case-study__ctaContent">
            <h2>{viewModel.getTitle()}</h2>
            <p>{copy.seo.fallbackDescription}</p>
          </div>
          <div className="case-study__ctaActions">
            <Link
              className="pbk-button pbk-button--primary"
              href={viewModel.getPrimaryCta().href}
            >
              {viewModel.getPrimaryCta().label}
            </Link>
            <Link
              className="pbk-button pbk-button--secondary"
              href={viewModel.getSecondaryCta().href}
            >
              {viewModel.getSecondaryCta().label}
            </Link>
          </div>
        </footer>
      </div>
    </section>
  );
}

class CaseStudyViewModel {
  private readonly renderer: MarkdownRenderer;

  constructor(private readonly document: MarkdownDocument) {
    this.renderer = new MarkdownRenderer(document.content);
  }

  getRenderer() {
    return this.renderer;
  }

  getTitle() {
    return (
      this.document.frontmatter.hero?.heading ?? this.document.frontmatter.title
    );
  }

  getSubtitle() {
    return this.document.frontmatter.hero?.subheading ?? this.document.excerpt;
  }

  getHeroImage() {
    const heroImage = this.document.frontmatter.hero?.image;
    if (heroImage?.src && heroImage.alt) {
      return heroImage;
    }
    const meta = this.document.frontmatter.meta;
    if (meta?.heroImageSrc && meta.heroImageAlt) {
      return {
        src: meta.heroImageSrc,
        alt: meta.heroImageAlt,
        width: meta.heroImageWidth,
        height: meta.heroImageHeight,
      };
    }
    return null;
  }

  getMeta() {
    const meta = this.document.frontmatter.meta;
    const items: { label: string; value: string }[] = [];
    if (meta?.industry) {
      items.push({ label: "Branża", value: meta.industry });
    }
    if (meta?.period) {
      items.push({ label: "Okres", value: meta.period });
    }
    if (meta?.stack?.length) {
      items.push({ label: copy.sections.stack, value: meta.stack.join(", ") });
    }
    return items;
  }

  getSummary() {
    return this.document.frontmatter.meta?.summaryBullets ?? [];
  }

  getMetrics() {
    return this.document.frontmatter.meta?.metrics ?? [];
  }

  getStack() {
    return this.document.frontmatter.meta?.stack ?? [];
  }

  getLessons() {
    return this.document.frontmatter.meta?.lessons ?? [];
  }

  getPrimaryCta() {
    const fallbackLabel = copy.cta.primaryLabel;
    const fallbackHref = copy.cta.primaryHref;
    const metaCta = this.document.frontmatter.meta?.primaryCta;
    return {
      label: metaCta?.label ?? fallbackLabel,
      href: metaCta?.href ?? fallbackHref,
    };
  }

  getSecondaryCta() {
    const fallbackLabel = copy.cta.secondaryLabel;
    const fallbackHref = copy.cta.secondaryHref;
    const metaCta = this.document.frontmatter.meta?.secondaryCta;
    return {
      label: metaCta?.label ?? fallbackLabel,
      href: metaCta?.href ?? fallbackHref,
    };
  }
}
