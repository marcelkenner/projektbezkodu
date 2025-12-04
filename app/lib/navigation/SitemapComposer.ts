import {
  ArticleRepository,
  GlossaryRepository,
  ResourceRepository,
  CaseStudyRepository,
} from "@/app/lib/content/repositories";
import { articleTaxonomyCatalog } from "@/app/lib/content/articleTaxonomy";
import { TagDirectory } from "@/app/lib/content/tagDirectory";
import { TemplateCatalog } from "@/app/lib/content/templateCatalog";
import { ToolCatalog } from "@/app/lib/content/toolCatalog";
import { LeadMagnetCatalog } from "@/app/lib/content/leadMagnetCatalog";
import { getCopy } from "@/app/lib/copy";

export interface SitemapLink {
  label: string;
  href: string;
}

export class SitemapSection {
  constructor(
    private readonly heading: string,
    private readonly links: SitemapLink[],
  ) {}

  getHeading() {
    return this.heading;
  }

  getLinks() {
    return this.links;
  }
}

export class SitemapComposer {
  private readonly articleRepository = new ArticleRepository();
  private readonly glossaryRepository = new GlossaryRepository();
  private readonly resourceRepository = new ResourceRepository();
  private readonly caseStudyRepository = new CaseStudyRepository();
  private readonly templateCatalog = new TemplateCatalog();
  private readonly toolCatalog = new ToolCatalog();
  private readonly tagDirectory = new TagDirectory();
  private readonly leadMagnetCatalog = new LeadMagnetCatalog();

  buildSections(): SitemapSection[] {
    const copy = getCopy("sitemap") as any;
    const staticSections: SitemapSection[] = [];

    if (copy.sections?.primaryPages?.links?.length) {
      staticSections.push(
        new SitemapSection(
          copy.sections.primaryPages.heading ?? "Najważniejsze strony",
          copy.sections.primaryPages.links,
        ),
      );
    }

    if (copy.sections?.legal?.links?.length) {
      staticSections.push(
        new SitemapSection(
          copy.sections.legal.heading ?? "Dokumenty",
          copy.sections.legal.links,
        ),
      );
    }

    const dynamicSections = [
      new SitemapSection("Kategorie artykułów", this.getCategoryLinks()),
      new SitemapSection("Artykuły", this.getArticleLinks()),
      new SitemapSection("Tagi treści", this.getTagLinks()),
      new SitemapSection("Narzędzia", this.getToolLinks()),
      new SitemapSection("Szablony", this.getTemplateLinks()),
      new SitemapSection("Lead magnety", this.getLeadMagnetLinks()),
      new SitemapSection("Glosariusz", this.getGlossaryLinks()),
      new SitemapSection("Zasoby", this.getResourceLinks()),
      new SitemapSection("Case studies", this.getCaseStudyLinks()),
    ];

    return [...staticSections, ...dynamicSections];
  }

  buildLinks(): SitemapLink[] {
    const links: SitemapLink[] = [];
    const seen = new Set<string>();
    this.buildSections().forEach((section) => {
      section.getLinks().forEach((link) => {
        if (seen.has(link.href)) {
          return;
        }
        seen.add(link.href);
        links.push(link);
      });
    });
    return links;
  }

  private getCategoryLinks(): SitemapLink[] {
    return articleTaxonomyCatalog.listCategories().map((category) => ({
      label: category.label,
      href: `/kategoria/${category.slug}/`,
    }));
  }

  private getArticleLinks(): SitemapLink[] {
    return this.articleRepository.listSummaries().map((article) => ({
      label: article.title,
      href: article.path,
    }));
  }

  private getTagLinks(): SitemapLink[] {
    return this.tagDirectory.list().map((tag) => ({
      label: tag.label,
      href: `/tag/${tag.slug}/`,
    }));
  }

  private getToolLinks(): SitemapLink[] {
    return this.toolCatalog.list().map((tool) => ({
      label: tool.name,
      href: tool.guideHref,
    }));
  }

  private getTemplateLinks(): SitemapLink[] {
    return this.templateCatalog.list().map((template) => ({
      label: template.name,
      href: `/szablony/${template.slug}/`,
    }));
  }

  private getLeadMagnetLinks(): SitemapLink[] {
    return this.leadMagnetCatalog.listSlugs().map((slug) => {
      const entry = this.leadMagnetCatalog.get(slug);
      return {
        label: entry?.hero.title ?? this.formatLabel(slug),
        href: `/do-pobrania/${slug}/`,
      };
    });
  }

  private getGlossaryLinks(): SitemapLink[] {
    return this.glossaryRepository.listSummaries().map((entry) => ({
      label: entry.title,
      href: entry.path,
    }));
  }

  private getResourceLinks(): SitemapLink[] {
    return this.resourceRepository.listSummaries().map((entry) => ({
      label: entry.title,
      href: entry.path,
    }));
  }

  private getCaseStudyLinks(): SitemapLink[] {
    return this.caseStudyRepository.listSummaries().map((entry) => ({
      label: entry.title,
      href: entry.path,
    }));
  }

  private formatLabel(slug: string): string {
    return slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }
}
