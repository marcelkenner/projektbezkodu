import {
  ArticleRepository,
  ComparisonRepository,
  GlossaryRepository,
  ResourceRepository,
  TutorialRepository,
  CaseStudyRepository,
} from "@/app/lib/content/repositories";
import { articleTaxonomyCatalog } from "@/app/lib/content/articleTaxonomy";
import { TagDirectory } from "@/app/lib/content/tagDirectory";
import { TemplateCatalog } from "@/app/lib/content/templateCatalog";
import { ToolCatalog } from "@/app/lib/content/toolCatalog";
import { LeadMagnetCatalog } from "@/app/lib/content/leadMagnetCatalog";
import { getCopy } from "@/app/lib/copy";
import { ArticleHubManager } from "@/app/lib/content/ArticleHubManager";

export interface SitemapLink {
  label: string;
  href: string;
}

interface SitemapCopySection {
  heading?: string;
  links?: SitemapLink[];
}

interface SitemapCopy {
  sections?: {
    primaryPages?: SitemapCopySection;
    legal?: SitemapCopySection;
  };
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
  private readonly comparisonRepository = new ComparisonRepository();
  private readonly glossaryRepository = new GlossaryRepository();
  private readonly resourceRepository = new ResourceRepository();
  private readonly tutorialRepository = new TutorialRepository();
  private readonly caseStudyRepository = new CaseStudyRepository();
  private readonly articleHubManager = new ArticleHubManager();
  private readonly templateCatalog = new TemplateCatalog();
  private readonly toolCatalog = new ToolCatalog();
  private readonly tagDirectory = new TagDirectory();
  private readonly leadMagnetCatalog = new LeadMagnetCatalog();

  buildSections(): SitemapSection[] {
    const copy = getCopy("sitemap") as SitemapCopy;
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
      new SitemapSection("Poradniki", this.getTutorialLinks()),
      new SitemapSection("Porównania", this.getComparisonLinks()),
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
    const hubs = this.articleHubManager.listHubs(4);
    if (hubs.length) {
      return hubs.map((hub) => ({
        label: hub.label,
        href: hub.href,
      }));
    }
    return articleTaxonomyCatalog.listCategories().map((category) => ({
      label: category.label,
      href: `/artykuly/${category.slug}/`,
    }));
  }

  private getArticleLinks(): SitemapLink[] {
    return this.articleRepository.listSummaries().map((article) => ({
      label: article.title,
      href: article.path,
    }));
  }

  private getTutorialLinks(): SitemapLink[] {
    return this.tutorialRepository.listSummaries().map((entry) => ({
      label: entry.title,
      href: entry.path,
    }));
  }

  private getComparisonLinks(): SitemapLink[] {
    return this.comparisonRepository.listSummaries().map((entry) => ({
      label: entry.title,
      href: entry.path,
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
