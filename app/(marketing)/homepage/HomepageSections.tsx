/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  FlowArrow,
  Gauge,
  Lightning,
  Sparkle,
  Stack,
  Target,
} from "@phosphor-icons/react/dist/ssr";
import { getCopy } from "@/app/lib/copy";
import type { ContentSummary } from "@/app/lib/content/repositories";
import "./section.module.css";

const ARTICLE_PLACEHOLDER = "/images/placeholders/article-3x2.webp";

export interface HomepageSectionsProps {
  articles: ContentSummary[];
}

export function HomepageSections({ articles }: HomepageSectionsProps) {
  const homepageCopy = getCopy("homepage");

  return (
    <>
      <SocialProofSection
        heading={homepageCopy.socialProof.heading}
        logos={homepageCopy.socialProof.logos}
      />
      <PillarsSection
        heading={homepageCopy.pillars.heading}
        items={homepageCopy.pillars.items}
      />
      <WorkflowSection
        heading={homepageCopy.workflow.heading}
        steps={homepageCopy.workflow.steps}
      />
      <LatestArticlesSection copy={homepageCopy.articles} articles={articles} />
      <NewsletterSection copy={homepageCopy.newsletter} />
    </>
  );
}

interface SocialProofProps {
  heading: string;
  logos: { src: string; alt: string }[];
  testimonialsHeading?: string;
  testimonials?: Testimonial[];
}

interface Testimonial {
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
  cta?: { label: string; href: string };
}

function SocialProofSection({
  heading,
  logos,
  testimonialsHeading,
  testimonials = [],
}: SocialProofProps) {
  if (!logos.length && !testimonials.length) {
    return null;
  }

  return (
    <section
      className="homepage-section"
      aria-labelledby="social-proof-heading"
    >
      <div className="pbk-container">
        {logos.length ? (
          <>
            <p
              id="social-proof-heading"
              className="homepage-socialProof__heading"
            >
              {heading}
            </p>
            <div className="homepage-socialProof__logos" role="list">
              {logos.map((logo) => (
                <img
                  key={logo.alt}
                  src={logo.src}
                  alt={logo.alt}
                  className="homepage-socialProof__logo"
                  width={96}
                  height={32}
                  loading="lazy"
                  decoding="async"
                  role="listitem"
                />
              ))}
            </div>
          </>
        ) : null}
        {testimonials.length ? (
          <TestimonialsSection
            heading={testimonialsHeading}
            testimonials={testimonials}
          />
        ) : null}
      </div>
    </section>
  );
}

function TestimonialsSection({
  heading,
  testimonials,
}: {
  heading?: string;
  testimonials: Testimonial[];
}) {
  return (
    <div className="homepage-testimonials">
      {heading ? (
        <p className="homepage-testimonials__heading">{heading}</p>
      ) : null}
      <div className="homepage-testimonials__grid">
        {testimonials.map((testimonial) => (
          <figure
            key={testimonial.quote}
            className="homepage-testimonialCard"
          >
            <blockquote>
              <p>{testimonial.quote}</p>
            </blockquote>
            <figcaption>
              <div className="homepage-testimonialCard__author">
                {testimonial.avatar ? (
                  <img
                    src={testimonial.avatar}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width={48}
                    height={48}
                  />
                ) : null}
                <div>
                  <strong>{testimonial.author}</strong>
                  {testimonial.role ? (
                    <span className="pbk-card__meta">{testimonial.role}</span>
                  ) : null}
                </div>
              </div>
              {testimonial.cta ? (
                <Link
                  href={testimonial.cta.href}
                  className="homepage-testimonialCard__cta"
                >
                  {testimonial.cta.label}
                  <ArrowIcon />
                </Link>
              ) : null}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

interface PillarItem {
  title: string;
  description: string;
  href: string;
  icon: string;
}

interface PillarsProps {
  heading: string;
  items: PillarItem[];
}

function PillarsSection({ heading, items }: PillarsProps) {
  if (!items.length) {
    return null;
  }

  return (
    <section
      className="homepage-section homepage-section--pillars"
      aria-labelledby="pillars-heading"
    >
      <div className="pbk-container">
        <h2 id="pillars-heading">{heading}</h2>
        <div className="homepage-pillars__grid">
          {items.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="homepage-pillars__card"
            >
              <PillarIcon name={item.icon} />
              <div className="homepage-pillars__cardBody">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className="homepage-pillars__cta">
                  Sprawdź
                  <ArrowIcon />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

interface WorkflowStep {
  title: string;
  description: string;
}

interface WorkflowProps {
  heading: string;
  steps: WorkflowStep[];
}

function WorkflowSection({ heading, steps }: WorkflowProps) {
  if (!steps.length) {
    return null;
  }

  return (
    <section className="homepage-section" aria-labelledby="workflow-heading">
      <div className="pbk-container">
        <h2 id="workflow-heading">{heading}</h2>
        <ol className="homepage-workflow__list">
          {steps.map((step, index) => (
            <WorkflowStepItem key={step.title} index={index} step={step} />
          ))}
        </ol>
      </div>
    </section>
  );
}

interface WorkflowStepItemProps {
  index: number;
  step: WorkflowStep;
}

function WorkflowStepItem({ index, step }: WorkflowStepItemProps) {
  return (
    <li className="homepage-workflow__item">
      <span className="homepage-workflow__number">{index + 1}</span>
      <div className="homepage-workflow__body">
        <h3 className="homepage-workflow__title">{step.title}</h3>
        <p className="homepage-workflow__description">{step.description}</p>
      </div>
    </li>
  );
}

interface LatestArticlesCopy {
  heading: string;
  ctaLabel: string;
  loading: string;
  empty: string;
}

interface LatestArticlesProps {
  copy: LatestArticlesCopy;
  articles: ContentSummary[];
}

function LatestArticlesSection({ copy, articles }: LatestArticlesProps) {
  const items = articles.slice(0, 3);

  return (
    <section className="homepage-section" aria-labelledby="latest-heading">
      <div className="pbk-container">
        <h2 id="latest-heading">{copy.heading}</h2>
        {items.length ? (
          <div className="homepage-articles__grid">
            {items.map((article) => (
              <ArticleCard
                key={article.slug}
                article={article}
                ctaLabel={copy.ctaLabel}
              />
            ))}
          </div>
        ) : (
          <p>{copy.empty}</p>
        )}
      </div>
    </section>
  );
}

interface ArticleCardProps {
  article: ContentSummary;
  ctaLabel: string;
}

function ArticleCard({ article, ctaLabel }: ArticleCardProps) {
  return (
    <article className="homepage-articles__card">
      <img
        src={ARTICLE_PLACEHOLDER}
        alt={`Miniatura artykułu: ${article.title}`}
        width={768}
        height={512}
        loading="lazy"
        decoding="async"
        sizes="(max-width:640px) 92vw, (max-width:1200px) 33vw, 384px"
        srcSet={`${ARTICLE_PLACEHOLDER} 384w`}
      />
      <div className="homepage-articles__content">
        <h3>
          <Link href={article.path}>{article.title}</Link>
        </h3>
        {article.description ? <p>{article.description}</p> : null}
        <ArticleMeta article={article} />
        <Link href={article.path} className="homepage-articles__link">
          {ctaLabel}
        </Link>
      </div>
    </article>
  );
}

function ArticleMeta({ article }: { article: ContentSummary }) {
  const readingTime = article.meta?.duration;
  const dateLabel = formatDate(article.date);

  if (!readingTime && !dateLabel) {
    return null;
  }

  return (
    <p className="homepage-articles__meta">
      {readingTime ? (
        <>
          <ClockIcon />
          <span>{readingTime}</span>
        </>
      ) : null}
      {dateLabel ? (
        <time dateTime={article.date ?? ""}>{dateLabel}</time>
      ) : null}
    </p>
  );
}

interface NewsletterCopy {
  heading: string;
  body: string;
  form: {
    emailLabel: string;
    emailPlaceholder: string;
    consentLabel: string;
    submitLabel: string;
    privacyLabel: string;
    privacyHref: string;
  };
}

function NewsletterSection({ copy }: { copy: NewsletterCopy }) {
  const form = copy.form;

  return (
    <section
      className="homepage-section homepage-section--newsletter"
      aria-labelledby="newsletter-heading"
    >
      <div className="pbk-container homepage-newsletter__wrapper">
        <div className="homepage-newsletter__content">
          <h2 id="newsletter-heading">{copy.heading}</h2>
          <p>{copy.body}</p>
          <form
            className="homepage-newsletter__form"
            action="/api/newsletter/subscribe"
            method="post"
          >
            <label htmlFor="newsletter-email">{form.emailLabel}</label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              required
              placeholder={form.emailPlaceholder}
              minLength={3}
            />
            <label className="homepage-newsletter__consent">
              <input type="checkbox" name="consent" required />{" "}
              {form.consentLabel}
            </label>
            <button type="submit" className="pbk-button pbk-button--primary">
              {form.submitLabel}
            </button>
            <small>
              <Link href={form.privacyHref}>{form.privacyLabel}</Link>
            </small>
          </form>
        </div>
      </div>
    </section>
  );
}

function PillarIcon({ name }: { name: string }) {
  switch (name) {
    case "bolt":
      return (
        <Lightning
          aria-hidden="true"
          className="homepage-pillars__icon"
          weight="fill"
        />
      );
    case "spark":
      return (
        <Sparkle
          aria-hidden="true"
          className="homepage-pillars__icon"
          weight="fill"
        />
      );
    case "workflow":
      return (
        <FlowArrow
          aria-hidden="true"
          className="homepage-pillars__icon"
          weight="fill"
        />
      );
    case "target":
      return (
        <Target
          aria-hidden="true"
          className="homepage-pillars__icon"
          weight="fill"
        />
      );
    case "layers":
      return (
        <Stack
          aria-hidden="true"
          className="homepage-pillars__icon"
          weight="fill"
        />
      );
    case "speed":
      return (
        <Gauge
          aria-hidden="true"
          className="homepage-pillars__icon"
          weight="fill"
        />
      );
    default:
      return (
        <Sparkle
          aria-hidden="true"
          className="homepage-pillars__icon"
          weight="fill"
        />
      );
  }
}

function ArrowIcon() {
  return (
    <ArrowRight
      aria-hidden="true"
      className="homepage-pillars__arrow"
      weight="bold"
    />
  );
}

function ClockIcon() {
  return (
    <Clock
      aria-hidden="true"
      className="homepage-articles__icon"
      weight="bold"
    />
  );
}

function formatDate(isoDate?: string) {
  if (!isoDate) {
    return "";
  }
  const parsed = Date.parse(isoDate);
  if (Number.isNaN(parsed)) {
    return "";
  }
  return new Intl.DateTimeFormat("pl-PL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(parsed);
}
