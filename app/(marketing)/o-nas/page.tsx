/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { getCopy } from "@/app/lib/copy";
import "./about.module.css";

const copy = getCopy("about");

export const metadata: Metadata = {
  title: copy.seo.title,
  description: copy.seo.description,
  alternates: {
    canonical: copy.seo.canonical,
  },
};

export default function AboutPage() {
  return (
    <section className="about-page" id="content">
      <div className="pbk-container about-page__section">
        <header>
          <h1>{copy.hero.title}</h1>
          <p className="about-page__lead">{copy.hero.lead}</p>
        </header>
      </div>

      <PurposeSection />
      <TeamSection />
      <PrinciplesSection />
      <ServicesSection />
      <CallToActionSection />
      <OrganizationJsonLd />
    </section>
  );
}

function PurposeSection() {
  return (
    <div className="pbk-container about-page__section">
      <h2>{copy.purpose.heading}</h2>
      <div className="pbk-stack pbk-stack--tight">
        {copy.purpose.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}

function TeamSection() {
  return (
    <div className="pbk-container about-page__section">
      <h2>{copy.team.heading}</h2>
      <div className="about-page__teamGrid">
        {copy.team.members.map((member) => (
          <article key={member.slug} className="about-page__member">
            <div className="about-page__memberHeader">
              <img
                className="about-page__avatar"
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
              <div className="about-page__memberLinks">
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
    <div className="pbk-container about-page__section">
      <h2>{copy.principles.heading}</h2>
      <ul className="about-page__principlesList">
        {copy.principles.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function ServicesSection() {
  return (
    <div className="pbk-container about-page__section">
      <h2>{copy.services.heading}</h2>
      <div className="about-page__servicesGrid">
        {copy.services.cards.map((card) => (
          <article key={card.title} className="about-page__serviceCard">
            <div className="pbk-stack pbk-stack--tight">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
            <Link className="pbk-button pbk-button--tertiary" href={card.href}>
              {card.ctaLabel}
              <ArrowRight aria-hidden="true" weight="bold" />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

function CallToActionSection() {
  return (
    <div className="pbk-container about-page__section">
      <div className="about-page__cta">
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
        <span className="about-page__ctaText">{copy.cta.disclaimer}</span>
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
