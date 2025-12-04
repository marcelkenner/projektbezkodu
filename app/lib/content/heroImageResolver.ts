import type { Frontmatter } from "@/app/lib/frontmatter";

export interface ResolvedHeroImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export function resolveHeroImage(
  frontmatter: Frontmatter,
  fallbackAlt: string,
): ResolvedHeroImage | null {
  const hero = frontmatter.hero?.image;
  if (hero?.src) {
    return {
      src: hero.src,
      alt: hero.alt ?? fallbackAlt,
      width: hero.width,
      height: hero.height,
    };
  }

  if (frontmatter.meta?.heroImageSrc) {
    return {
      src: frontmatter.meta.heroImageSrc,
      alt: frontmatter.meta.heroImageAlt ?? fallbackAlt,
      width: frontmatter.meta.heroImageWidth,
      height: frontmatter.meta.heroImageHeight,
    };
  }

  return null;
}

export function defaultHeroImage(fallbackAlt: string): ResolvedHeroImage {
  return {
    src: "/img/article_image.jpeg",
    alt: fallbackAlt,
    width: 1600,
    height: 900,
  };
}
