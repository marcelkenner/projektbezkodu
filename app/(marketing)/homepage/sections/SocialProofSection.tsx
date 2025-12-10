/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { HomepageIconFactory } from "./HomepageIconFactory";
import sectionStyles from "../section-shell.module.css";
import socialStyles from "../social-proof.module.css";

export interface HomepageLogo {
  src: string;
  alt: string;
}

export interface HomepageTestimonial {
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
  cta?: { label: string; href: string };
}

export interface SocialProofCopy {
  heading: string;
  logos: HomepageLogo[];
  testimonialsHeading?: string;
  testimonials?: HomepageTestimonial[];
}

export function SocialProofSection({ copy }: { copy: SocialProofCopy }) {
  const { testimonials = [], testimonialsHeading } = copy;

  if (!testimonials.length) {
    return null;
  }

  return (
    <section
      className={sectionStyles["homepage-section"]}
      aria-labelledby="social-proof-heading"
    >
      <div className="pbk-container">
        <TestimonialsSection
          heading={testimonialsHeading}
          testimonials={testimonials}
        />
      </div>
    </section>
  );
}

function TestimonialsSection({
  heading,
  testimonials,
}: {
  heading?: string;
  testimonials: HomepageTestimonial[];
}) {
  const headingId = heading ? "social-proof-heading" : undefined;
  return (
    <div className={socialStyles["homepage-testimonials"]}>
      {heading ? (
        <p
          id={headingId}
          className={socialStyles["homepage-testimonials__heading"]}
        >
          {heading}
        </p>
      ) : null}
      <div className={socialStyles["homepage-testimonials__grid"]}>
        {testimonials.map((testimonial) => (
          <figure
            key={testimonial.quote}
            className={socialStyles["homepage-testimonialCard"]}
          >
            <blockquote>
              <p>{testimonial.quote}</p>
            </blockquote>
            <figcaption>
              <div className={socialStyles["homepage-testimonialCard__author"]}>
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
                  className={socialStyles["homepage-testimonialCard__cta"]}
                >
                  {testimonial.cta.label}
                  {HomepageIconFactory.arrow()}
                </Link>
              ) : null}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
