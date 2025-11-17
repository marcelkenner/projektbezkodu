/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { getCopy } from "@/app/lib/copy";
import "./section.module.css";

interface HeroImageSource {
  src: string;
  width: number;
}

interface HeroImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  sources: HeroImageSource[];
}

interface HeroCta {
  label: string;
  href: string;
  ariaLabel?: string;
}

interface HeroContent {
  heading: string;
  subheading: string;
  primaryCta: HeroCta;
  secondaryCta: HeroCta;
  microcopy: string;
  image: HeroImage;
}

interface HeroVariant extends HeroContent {
  id: string;
}

interface HeroVariantConfig {
  defaultVariantId: string;
  variants: HeroVariant[];
}

export function HeroSection() {
  const { hero } = getCopy("homepage");
  const heroContent = resolveHeroContent(hero);

  return (
    <section id="hero" className="homepage-hero" aria-labelledby="hero-heading">
      <div className="pbk-container homepage-hero__layout">
        <div className="homepage-hero__content">
          <h1 id="hero-heading">{heroContent.heading}</h1>
          <p className="homepage-hero__lead">{heroContent.subheading}</p>
          <HeroActions content={heroContent} />
          <p className="homepage-hero__microcopy">{heroContent.microcopy}</p>
        </div>
        <div className="homepage-hero__media">
          <ResponsiveImage image={heroContent.image} />
        </div>
      </div>
    </section>
  );
}

function HeroActions({ content }: { content: HeroContent }) {
  return (
    <div className="homepage-hero__actions">
      <Link
        href={content.primaryCta.href}
        className="pbk-button pbk-button--primary"
        aria-label={content.primaryCta.ariaLabel ?? content.primaryCta.label}
      >
        {content.primaryCta.label}
      </Link>
      <Link
        href={content.secondaryCta.href}
        className="pbk-button pbk-button--secondary"
      >
        {content.secondaryCta.label}
      </Link>
    </div>
  );
}

function ResponsiveImage({ image }: { image: HeroImage }) {
  const srcSet = image.sources
    .map((source) => `${source.src} ${source.width}w`)
    .join(", ");
  return (
    <img
      className="homepage-hero__image"
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      decoding="async"
      fetchPriority="high"
      sizes={image.sizes}
      srcSet={srcSet}
    />
  );
}

function mapHeroCopy(copy: HeroContent): HeroContent {
  return {
    heading: copy.heading,
    subheading: copy.subheading,
    primaryCta: copy.primaryCta,
    secondaryCta: copy.secondaryCta,
    microcopy: copy.microcopy,
    image: copy.image,
  };
}

function resolveHeroContent(
  heroCopy: HeroContent | HeroVariantConfig,
): HeroContent {
  if (!isVariantConfig(heroCopy)) {
    return mapHeroCopy(heroCopy);
  }

  const requestedVariantId =
    process.env.NEXT_PUBLIC_HOMEPAGE_HERO_VARIANT?.trim().toLowerCase();
  const normalizedDefault = heroCopy.defaultVariantId?.toLowerCase();

  const findVariant = (id?: string) =>
    heroCopy.variants.find(
      (variant) =>
        variant.id.toLowerCase() === (id ?? "").trim().toLowerCase(),
    );

  const selectedVariant =
    (requestedVariantId && findVariant(requestedVariantId)) ||
    findVariant(normalizedDefault) ||
    heroCopy.variants[0];

  return mapHeroCopy(selectedVariant);
}

function isVariantConfig(
  heroCopy: HeroContent | HeroVariantConfig,
): heroCopy is HeroVariantConfig {
  return Array.isArray((heroCopy as HeroVariantConfig).variants);
}
