import type { Frontmatter } from "@/app/lib/frontmatter";

export interface ResolvedHeroImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export type HeroImageKind = "article" | "tutorial" | "comparison" | "template";

function inferHeroImageKind(frontmatter: Frontmatter): HeroImageKind {
  if (frontmatter.template === "tutorial") return "tutorial";
  if (frontmatter.template === "comparison") return "comparison";
  if (frontmatter.template === "template") return "template";

  const path = frontmatter.path ?? "";
  if (path.startsWith("/poradniki/")) return "tutorial";
  if (path.startsWith("/porownania/")) return "comparison";
  if (path.startsWith("/szablony/")) return "template";

  return "article";
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

export function defaultHeroImage(
  fallbackAlt: string,
  kind: HeroImageKind = "article",
): ResolvedHeroImage {
  const defaults: Record<HeroImageKind, string> = {
    article: "/img/articles_hero_image.webp",
    tutorial: "/img/tutorials_hero_image.webp.webp",
    comparison: "/img/comparisons_hero_image.webp.jpeg",
    template: "/img/templates_hero_image.webp.webp",
  };

  const src = defaults[kind] ?? defaults.article;

  return {
    src,
    alt: fallbackAlt,
    width: 1600,
    height: 900,
  };
}

export function heroImageKindFrom(frontmatter: Frontmatter): HeroImageKind {
  return inferHeroImageKind(frontmatter);
}
