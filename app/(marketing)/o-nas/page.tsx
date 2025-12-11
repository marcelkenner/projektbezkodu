/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { Metadata } from "next";
import { getCopy } from "@/app/lib/copy";
import styles from "./about.module.css";

const copy = getCopy("about");

export const metadata: Metadata = {
  title: { absolute: copy.seo.title },
  description: copy.seo.description,
  alternates: {
    canonical: copy.seo.canonical,
  },
};

export default function AboutPage() {
  return (
    <section className={styles.aboutPage} id="content">
      <HeroSection />
      <PurposeSection />
      <HighlightsSection />
      <TeamSection />
      <PrinciplesSection />
      <CallToActionSection />
      <OrganizationJsonLd />
    </section>
  );
}

function HeroSection() {
  const stats = [
    {
      label: "Osób w zespole",
      value: `${copy.team.members.length}+`,
    },
    {
      label: "Publikacje",
      value: "Artykuły, poradniki, checklisty",
    },
    {
      label: "Zasady działania",
      value: `${copy.principles.items.length} kluczowych zasad`,
    },
  ];

  return (
    <div className={`pbk-container ${styles.section} ${styles.heroSection}`}>
      <div className={styles.heroCard}>
        <div className={styles.heroContent}>
          <p className={styles.kicker}>Kim jesteśmy</p>
          <h1 className={styles.heroTitle}>{copy.hero.title}</h1>
          <p className={styles.lead}>{copy.hero.lead}</p>
          <div className={styles.heroActions}>
            <Link
              className="pbk-button pbk-button--primary"
              href={copy.cta.primary.href}
            >
              {copy.cta.primary.label}
            </Link>
            <Link
              className="pbk-button pbk-button--secondary"
              href={copy.cta.secondary.href}
            >
              {copy.cta.secondary.label}
            </Link>
          </div>
        </div>
        <div className={styles.heroStats}>
          {stats.map((item) => (
            <article key={item.label} className={styles.statCard}>
              <p className={styles.statLabel}>{item.label}</p>
              <p className={styles.statValue}>{item.value}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function PurposeSection() {
  return (
    <div
      className={`pbk-container ${styles.section} ${styles.surfaceSection}`}
    >
      <div className={styles.sectionHeader}>
        <span className={styles.eyebrow}>Dlaczego to robimy</span>
        <h2>{copy.purpose.heading}</h2>
      </div>
      <div className="pbk-stack pbk-stack--tight">
        {copy.purpose.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}

function HighlightsSection() {
  const highlights = [
    {
      label: "Pracujemy po stronie klienta",
      value: copy.purpose.paragraphs[0],
    },
    {
      label: "Publikujemy regularnie",
      value: copy.purpose.paragraphs[1] ?? copy.purpose.paragraphs[0],
    },
    {
      label: "Zespół produktowy",
      value: copy.purpose.paragraphs[2] ?? copy.purpose.paragraphs[0],
    },
  ];

  return (
    <div
      className={`pbk-container ${styles.section} ${styles.surfaceSection}`}
    >
      <div className={styles.highlightGrid}>
        {highlights.map((item) => (
          <article key={item.label} className={styles.highlightCard}>
            <p className={styles.highlightLabel}>{item.label}</p>
            <p className={styles.highlightValue}>{item.value}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function TeamSection() {
  return (
    <div
      className={`pbk-container ${styles.section} ${styles.surfaceSection}`}
    >
      <div className={styles.sectionHeader}>
        <span className={styles.eyebrow}>Zespół</span>
        <h2>{copy.team.heading}</h2>
      </div>
      <div className={styles.teamGrid}>
        {copy.team.members.map((member) => (
          <article key={member.slug} className={styles.member}>
            <div className={styles.memberHeader}>
              <img
                className={styles.avatar}
                src={member.avatar}
                alt={`Zdjęcie: ${member.name}`}
                width={96}
                height={96}
                loading="lazy"
                decoding="async"
              />
              <div>
                <h3>{member.name}</h3>
                <p className="pbk-card__meta">{member.role}</p>
              </div>
            </div>
            <p>{member.bio}</p>
            {member.links?.length ? (
              <div className={styles.memberLinks}>
                {member.links.map((link) => (
                  <Link key={link.href} href={link.href} rel={link.rel}>
                    {link.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}

function PrinciplesSection() {
  return (
    <div
      className={`pbk-container ${styles.section} ${styles.surfaceSection}`}
    >
      <div className={styles.sectionHeader}>
        <span className={styles.eyebrow}>Jak pracujemy</span>
        <h2>{copy.principles.heading}</h2>
      </div>
      <div className={styles.principlesList}>
        {copy.principles.items.map((item) => (
          <article key={item} className={styles.principleCard}>
            <p>{item}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function ServicesSection() {
  return null;
}

function CallToActionSection() {
  return (
    <div className={`pbk-container ${styles.section} ${styles.surfaceSection}`}>
      <div className={styles.ctaCard}>
        <Link
          className="pbk-button pbk-button--primary pbk-button--lg"
          href={copy.cta.primary.href}
        >
          {copy.cta.primary.label}
        </Link>
        <Link
          className="pbk-button pbk-button--secondary pbk-button--lg"
          href={copy.cta.secondary.href}
        >
          {copy.cta.secondary.label}
        </Link>
        <p className={styles.ctaText}>{copy.cta.disclaimer}</p>
      </div>
    </div>
  );
}

function OrganizationJsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: copy.organization.name,
    url: copy.organization.url,
    logo: copy.organization.logo,
    sameAs: copy.organization.sameAs,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
    />
  );
}
