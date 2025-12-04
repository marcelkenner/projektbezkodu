import type { Metadata } from "next";
import Link from "next/link";
import sitemapCopySource from "@/data/copy/sitemap.json";
import { getCopy } from "@/app/lib/copy";
import {
  SitemapComposer,
  type SitemapSection,
} from "@/app/lib/navigation/SitemapComposer";
import "./sitemap.module.css";
import { ArticleSummaryBullets, ArticleCtaGroup } from "@/app/ui";

type QuickLink = { label: string; href: string };

interface SitemapCtaCopy {
  heading: string;
  body: string;
  bulletsHeading?: string;
  bullets?: string[];
  primary?: QuickLink;
  secondary?: QuickLink;
}

interface SitemapCopyData {
  seo: { title: string; description: string; canonical: string };
  hero: { title: string; intro: string };
  sections?: {
    primaryPages?: { heading?: string; links?: QuickLink[] };
    legal?: { heading?: string; links?: QuickLink[] };
  };
  sectionMeta: { countLabel: string };
  cta?: SitemapCtaCopy;
}

const staticCopy = sitemapCopySource as unknown as SitemapCopyData;
const copy = getCopy("sitemap") as unknown as SitemapCopyData;
const composer = new SitemapComposer();

export const metadata: Metadata = {
  title: staticCopy.seo.title,
  description: staticCopy.seo.description,
  alternates: {
    canonical: staticCopy.seo.canonical,
  },
};

export default function SitemapPage() {
  const sections = composer.buildSections();
  const quickLinks = copy.sections?.primaryPages?.links ?? [];
  const legalLinks = copy.sections?.legal?.links ?? [];

  return (
    <section className="sitemap-page" id="content">
      <div className="pbk-container pbk-stack pbk-stack--tight">
        <div className="pbk-readable">
          <header className="sitemap-page__intro">
            <h1>{copy.hero.title}</h1>
            <p>{copy.hero.intro}</p>
          </header>
        </div>
        <div className="sitemap-page__highlights">
          <QuickLinksSection
            heading={copy.sections?.primaryPages?.heading}
            links={quickLinks}
          />
          <QuickLinksSection
            heading={copy.sections?.legal?.heading}
            links={legalLinks}
          />
        </div>
        <SitemapCta />
        <div className="sitemap-page__grid">
          {sections.map((section) => (
            <SitemapSectionCard key={section.getHeading()} section={section} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SitemapSectionCard({ section }: { section: SitemapSection }) {
  const links = section.getLinks();
  if (!links.length) {
    return null;
  }
  return (
    <article className="sitemap-page__section">
      <div className="sitemap-page__sectionHeader">
        <h2>{section.getHeading()}</h2>
        {copy.sectionMeta?.countLabel ? (
          <p className="sitemap-page__count">
            {copy.sectionMeta.countLabel.replace(
              "{count}",
              String(links.length),
            )}
          </p>
        ) : null}
      </div>
      <ul className="sitemap-page__list">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </article>
  );
}

function QuickLinksSection({
  heading,
  links,
}: {
  heading?: string;
  links: { label: string; href: string }[];
}) {
  if (!links.length) {
    return null;
  }
  return (
    <article className="sitemap-page__quickCard">
      {heading ? <h2>{heading}</h2> : null}
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </article>
  );
}

function SitemapCta() {
  const promo = copy.cta;
  if (!promo) {
    return null;
  }
  return (
    <div className="sitemap-page__cta">
      <div className="sitemap-page__ctaCopy pbk-stack pbk-stack--tight">
        <h2>{promo.heading}</h2>
        <p>{promo.body}</p>
      </div>
      <ArticleSummaryBullets
        bullets={promo.bullets ?? []}
        heading={promo.bulletsHeading}
      />
      <ArticleCtaGroup
        primary={promo.primary ?? undefined}
        secondary={promo.secondary ?? undefined}
      />
    </div>
  );
}
