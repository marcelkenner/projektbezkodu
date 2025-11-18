/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { HomepageIconFactory } from "./HomepageIconFactory";

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
  const { heading, logos = [], testimonials = [], testimonialsHeading } = copy;

  if (!logos.length && !testimonials.length) {
    return null;
  }

  return (
    <section className="homepage-section" aria-labelledby="social-proof-heading">
      <div className="pbk-container">
        {logos.length ? (
          <div>
            <p id="social-proof-heading" className="homepage-socialProof__heading">
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
          </div>
        ) : null}
        {testimonials.length ? (
          <TestimonialsSection heading={testimonialsHeading} testimonials={testimonials} />
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
  testimonials: HomepageTestimonial[];
}) {
  return (
    <div className="homepage-testimonials">
      {heading ? <p className="homepage-testimonials__heading">{heading}</p> : null}
      <div className="homepage-testimonials__grid">
        {testimonials.map((testimonial) => (
          <figure key={testimonial.quote} className="homepage-testimonialCard">
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
                <Link href={testimonial.cta.href} className="homepage-testimonialCard__cta">
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
