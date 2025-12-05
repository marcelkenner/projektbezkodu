import type { Frontmatter } from "@/app/lib/frontmatter";

export interface ResolvedHeroImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export type HeroImageKind =
  | "article"
  | "tutorial"
  | "comparison"
  | "template"
  | "tool";

function inferHeroImageKind(frontmatter: Frontmatter): HeroImageKind {
  if (frontmatter.template === "tutorial") return "tutorial";
  if (frontmatter.template === "comparison") return "comparison";
  if (frontmatter.template === "template") return "template";
  if (frontmatter.template === "tool") return "tool";

  const path = frontmatter.path ?? "";
  if (path.startsWith("/poradniki/")) return "tutorial";
  if (path.startsWith("/porownania/")) return "comparison";
  if (path.startsWith("/szablony/")) return "template";
  if (path.startsWith("/narzedzia/")) return "tool";

  return "article";
}

export function resolveHeroImage(
  frontmatter: Frontmatter,
  fallbackAlt: string,
): ResolvedHeroImage | null {
  const hero = frontmatter.hero?.image;
  if (
    hero?.src &&
    hero.src !== "/img/article_image.jpeg" &&
    !hero.src.endsWith(".webp.jpeg") &&
    !hero.src.endsWith(".webp.webp")
  ) {
    return {
      src: hero.src,
      alt: hero.alt ?? fallbackAlt,
      width: hero.width,
      height: hero.height,
    };
  }

  if (
    frontmatter.meta?.heroImageSrc &&
    frontmatter.meta.heroImageSrc !== "/img/article_image.jpeg" &&
    !frontmatter.meta.heroImageSrc.endsWith(".webp.jpeg") &&
    !frontmatter.meta.heroImageSrc.endsWith(".webp.webp")
  ) {
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
    tutorial: "/img/tutorials_hero_image.webp",
    comparison: "/img/comparisons_hero_image.webp",
    template: "/img/templates_hero_image.webp",
    tool: "/img/tools_hero_image.webp",
  };

  const src = defaults[kind] ?? "/img/hero_image.webp";

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

export function heroImageKindFromPath(path: string | undefined): HeroImageKind {
  if (!path) return "article";
  if (path.startsWith("/poradniki/")) return "tutorial";
  if (path.startsWith("/porownania/")) return "comparison";
  if (path.startsWith("/szablony/")) return "template";
  if (path.startsWith("/narzedzia/")) return "tool";
  return "article";
}

export function defaultHeroImageForPath(
  path: string | undefined,
  fallbackAlt: string,
): ResolvedHeroImage {
  const kind = heroImageKindFromPath(path);
  return defaultHeroImage(fallbackAlt, kind);
}
