import { defaultSiteUrlFactory } from "@/app/lib/url/SiteUrlFactory";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

interface SegmentOverride {
  label: string;
  href?: string;
}

const SEGMENT_OVERRIDES = new Map<string, SegmentOverride>([
  ["artykuly", { label: "Artykuły", href: "/artykuly/" }],
  ["poradniki", { label: "Poradniki", href: "/poradniki/" }],
  ["porownania", { label: "Porównania", href: "/porownania/" }],
  ["narzedzia", { label: "Narzędzia", href: "/narzedzia/" }],
  ["zasoby", { label: "Zasoby", href: "/zasoby/" }],
  ["szablony", { label: "Szablony", href: "/szablony/" }],
  ["do-pobrania", { label: "Do pobrania", href: "/do-pobrania/" }],
]);

export class BreadcrumbComposer {
  constructor(
    private readonly overrides = SEGMENT_OVERRIDES,
    private readonly homeCrumb: BreadcrumbItem = {
      label: "Strona główna",
      href: "/",
    },
  ) {}

  compose(path: string, currentLabel?: string): BreadcrumbItem[] {
    const normalizedPath = this.normalizePath(path);
    if (!normalizedPath) {
      return [];
    }

    const segments = normalizedPath.split("/").filter(Boolean);
    if (!segments.length) {
      return [this.homeCrumb];
    }

    const items: BreadcrumbItem[] = [this.homeCrumb];

    segments.forEach((segment, index) => {
      const override = this.overrides.get(segment);
      const isLast = index === segments.length - 1;
      const href = isLast
        ? undefined
        : (override?.href ?? this.buildHref(segments.slice(0, index + 1)));
      const label =
        isLast && currentLabel
          ? currentLabel
          : (override?.label ?? this.toTitleCase(segment));

      items.push({
        label,
        href,
        isCurrent: isLast,
      });
    });

    return items;
  }

  private normalizePath(input: string): string {
    if (!input) {
      return "";
    }
    const absolute = defaultSiteUrlFactory.build(input);
    const url = new URL(absolute);
    return url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;
  }

  private buildHref(segments: string[]): string {
    return `/${segments.join("/")}/`;
  }

  private toTitleCase(segment: string): string {
    return segment
      .split(/[-_]/g)
      .filter(Boolean)
      .map(
        (token) => token.charAt(0).toUpperCase() + token.slice(1).toLowerCase(),
      )
      .join(" ");
  }
}
