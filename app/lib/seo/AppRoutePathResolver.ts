import path from "path";

import { SitemapPathNormalizer } from "@/app/lib/seo/SitemapPathNormalizer";

interface AppRoutePathResolverOptions {
  projectRoot?: string;
  appDirName?: string;
}

export class AppRoutePathResolver {
  private readonly appRoot: string;
  private readonly pathNormalizer = new SitemapPathNormalizer();

  constructor(options: AppRoutePathResolverOptions = {}) {
    const projectRoot = options.projectRoot ?? process.cwd();
    const appDirName = options.appDirName ?? "app";
    this.appRoot = path.join(projectRoot, appDirName);
  }

  resolve(pageFilePath: string): string | null {
    const relativePath = path.relative(this.appRoot, pageFilePath);
    const parsed = path.parse(relativePath);
    const segments = parsed.dir.split(path.sep).filter(Boolean);

    if (segments.some((segment) => this.isDynamicSegment(segment))) {
      return null;
    }

    const routeSegments = segments.filter(
      (segment) => !this.isRouteGroup(segment),
    );
    const routePath = routeSegments.length
      ? `/${routeSegments.join("/")}`
      : "/";
    return this.pathNormalizer.normalizeSitePath(routePath);
  }

  private isDynamicSegment(segment: string): boolean {
    return segment.startsWith("[");
  }

  private isRouteGroup(segment: string): boolean {
    if (segment.startsWith("@")) {
      return true;
    }
    return segment.startsWith("(") && segment.endsWith(")");
  }
}
