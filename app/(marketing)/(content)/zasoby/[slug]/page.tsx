/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge, TableOfContents } from "@/app/ui";
import { MarkdownRenderer } from "@/app/ui/MarkdownRenderer";
import { getCopy } from "@/app/lib/copy";
import { ResourceRepository } from "@/app/lib/content/repositories";
import {
  ResourceDirectory,
  type ResourceEntry,
} from "@/app/lib/content/resourceDirectory";
import type { MarkdownDocument } from "@/app/lib/content/repositories";
import "./resource-detail.module.css";

const copy = getCopy("resources");
const repository = new ResourceRepository();
const directory = new ResourceDirectory(repository.listSummaries());

export function generateStaticParams() {
  return repository.listSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const resource = repository.getResource(resolvedParams.slug);
  if (!resource) {
    return {};
  }
  const { frontmatter } = resource;
  const seo = frontmatter.seo;
  return {
    title: seo?.title ?? frontmatter.title,
    description: seo?.description ?? resource.excerpt,
    alternates: {
      canonical: seo?.canonical ?? frontmatter.path,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const document = repository.getResource(resolvedParams.slug);
  if (!document) {
    notFound();
  }

  const entry = directory.findBySlug(resolvedParams.slug);
  const viewModel = new ResourceDetailViewModel(document, entry);
  const headings = viewModel.getHeadings();
  const download = viewModel.getDownloadAction();

  return (
    <section className="resource-detail section section--surface" id="content">
      <div className="pbk-container resource-detail__layout">
        <aside className="resource-detail__aside">
          <TableOfContents
            title={copy.detail.sections.contents}
            items={headings}
          />
          {viewModel.getTopics().length ? (
            <div className="resource-detail__topics pbk-card pbk-stack pbk-stack--tight">
              <h2>{copy.detail.topicsHeading}</h2>
              <ul className="resource-detail__topicList">
                {viewModel.getTopics().map((topic) => (
                  <li key={topic}>{topic}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
        <article className="resource-detail__article">
          <header className="resource-detail__hero pbk-stack pbk-stack--tight">
            <div className="pbk-stack pbk-stack--tight">
              <h1>{viewModel.getTitle()}</h1>
              {viewModel.getIntro() ? <p>{viewModel.getIntro()}</p> : null}
            </div>
            {viewModel.getHeroImage() ? (
              <img
                className="resource-detail__heroImage"
                src={viewModel.getHeroImage()!.src}
                alt={viewModel.getHeroImage()!.alt}
                width={viewModel.getHeroImage()!.width}
                height={viewModel.getHeroImage()!.height}
                loading="lazy"
                decoding="async"
              />
            ) : null}
            {viewModel.getMetaBadges().length ? (
              <div className="resource-detail__badges pbk-inline-list">
                {viewModel.getMetaBadges().map((badge) => (
                  <Badge key={badge} variant="accent">
                    {badge}
                  </Badge>
                ))}
              </div>
            ) : null}
            <div className="resource-detail__cta">
              {download ? (
                <Link
                  className="pbk-button pbk-button--primary"
                  href={download.href}
                  rel={download.rel}
                >
                  {download.label}
                </Link>
              ) : null}
              {viewModel.getDetailsLink() ? (
                <Link
                  className="pbk-button pbk-button--secondary"
                  href={viewModel.getDetailsLink()!}
                >
                  {copy.cards.detailsCta}
                </Link>
              ) : null}
            </div>
            {viewModel.getFileReference() ? (
              <dl className="resource-detail__file">
                {viewModel.getFileReference()?.format ? (
                  <div>
                    <dt>{copy.detail.file.formatLabel}</dt>
                    <dd>{viewModel.getFileReference()!.format}</dd>
                  </div>
                ) : null}
                {viewModel.getFileReference()?.size ? (
                  <div>
                    <dt>{copy.detail.file.sizeLabel}</dt>
                    <dd>{viewModel.getFileReference()!.size}</dd>
                  </div>
                ) : null}
                {viewModel.getFileReference()?.checksum ? (
                  <div>
                    <dt>{copy.detail.file.checksumLabel}</dt>
                    <dd>
                      <code>{viewModel.getFileReference()!.checksum}</code>
                    </dd>
                  </div>
                ) : null}
              </dl>
            ) : null}
          </header>
          <div className="resource-detail__content prose">
            {viewModel.renderContent()}
          </div>
        </article>
      </div>
    </section>
  );
}

class ResourceDetailViewModel {
  private readonly renderer: MarkdownRenderer;

  constructor(
    private readonly resource: MarkdownDocument,
    private readonly entry?: ResourceEntry,
  ) {
    this.renderer = new MarkdownRenderer(resource.content);
  }

  getTitle() {
    return (
      this.resource.frontmatter.hero?.heading ?? this.resource.frontmatter.title
    );
  }

  getIntro() {
    return this.resource.frontmatter.hero?.subheading ?? this.resource.excerpt;
  }

  getHeroImage() {
    const heroImage = this.resource.frontmatter.hero?.image;
    if (heroImage?.src && heroImage.alt) {
      return {
        src: heroImage.src,
        alt: heroImage.alt,
        width: heroImage.width,
        height: heroImage.height,
      };
    }

    const meta = this.resource.frontmatter.meta;
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

  getMetaBadges() {
    const badges: string[] = [];
    if (this.entry?.format?.label) {
      badges.push(this.entry.format.label);
    }
    if (this.entry?.duration?.label) {
      badges.push(this.entry.duration.label);
    }
    if (this.resource.frontmatter.meta?.license) {
      badges.push(this.resource.frontmatter.meta.license);
    }
    return badges;
  }

  getTopics() {
    return this.entry?.topics.map((topic) => topic.label) ?? [];
  }

  getDownloadAction() {
    const href =
      this.entry?.downloadHref ??
      this.resource.frontmatter.meta?.downloadHref ??
      this.resource.frontmatter.meta?.primaryCta?.href;
    if (!href) {
      return null;
    }
    const rel = href.startsWith("http") ? "noopener sponsored" : undefined;
    return {
      href,
      rel,
      label:
        this.resource.frontmatter.meta?.primaryCta?.label ??
        copy.detail.ctaLabel,
    };
  }

  getDetailsLink() {
    return (
      this.entry?.detailsHref ??
      this.resource.frontmatter.meta?.secondaryCta?.href ??
      this.resource.frontmatter.path
    );
  }

  getFileReference() {
    const meta = this.resource.frontmatter.meta;
    if (!meta) {
      return null;
    }
    const size = meta.fileSize ?? null;
    const format = meta.format ?? this.entry?.format?.label ?? null;
    const checksum = meta.checksum ?? null;
    if (!size && !format && !checksum) {
      return null;
    }
    return {
      size: size ?? undefined,
      format: format ?? undefined,
      checksum: checksum ?? undefined,
    };
  }

  renderContent() {
    return this.renderer.render();
  }

  getHeadings() {
    return this.renderer.getHeadings();
  }
}
