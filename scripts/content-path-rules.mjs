import path from "path";

const EXACT_ROUTE_ROOTS = new Map([
  ["do-pobrania", "do-pobrania"],
  ["glossary", "glossary"],
  ["poradniki", "poradniki"],
  ["porownania", "porownania"],
  ["szablony", "szablony"],
  ["zasoby", "zasoby"],
]);

const TOP_LEVEL_NON_TOOL_ROOTS = new Set([
  "_examples",
  "artykuly",
  ...EXACT_ROUTE_ROOTS.keys(),
  "narzedzia-no-code",
]);

export function normalizePublicPath(rawPath) {
  if (typeof rawPath !== "string") {
    return null;
  }
  const trimmed = rawPath.trim();
  if (!trimmed) {
    return null;
  }
  const withoutDomain = trimmed.replace(/^https?:\/\/[^/]+/i, "");
  const withLeading = withoutDomain.startsWith("/")
    ? withoutDomain
    : `/${withoutDomain}`;
  return withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
}

export function isExcludedFromContentPathAudit(relativePath) {
  const normalized = relativePath.replace(/\\/g, "/");
  return normalized.startsWith("_examples/");
}

export function getExpectedCanonicalPath(relativePath, frontmatter = {}) {
  const normalized = relativePath.replace(/\\/g, "/");
  const parsed = path.posix.parse(normalized);
  const directorySegments = parsed.dir.split("/").filter(Boolean);
  const topLevelDirectory = directorySegments[0];

  if (!topLevelDirectory || isExcludedFromContentPathAudit(normalized)) {
    return null;
  }

  if (topLevelDirectory === "artykuly") {
    return null;
  }

  if (EXACT_ROUTE_ROOTS.has(topLevelDirectory)) {
    return buildExactRoutePath(
      EXACT_ROUTE_ROOTS.get(topLevelDirectory),
      parsed,
      frontmatter,
    );
  }

  if (topLevelDirectory === "narzedzia-no-code") {
    return buildToolRoutePath(directorySegments.slice(1), parsed);
  }

  if (TOP_LEVEL_NON_TOOL_ROOTS.has(topLevelDirectory)) {
    return null;
  }

  return buildToolRoutePath([topLevelDirectory, ...directorySegments.slice(1)], parsed);
}

function buildExactRoutePath(publicRoot, parsed, frontmatter) {
  const slug = getExplicitSlug(frontmatter, parsed);
  const directorySegments = parsed.dir.split("/").filter(Boolean);
  if (parsed.name === "index") {
    if (directorySegments.length === 1) {
      return `/${publicRoot}/`;
    }
    return `/${publicRoot}/${slug}/`;
  }
  return `/${publicRoot}/${slug}/`;
}

function buildToolRoutePath(sourceSegments, parsed) {
  const [toolSlug, ...rest] = sourceSegments.filter(Boolean);
  if (!toolSlug) {
    return null;
  }

  if (parsed.name === "index") {
    if (rest.at(-1) === "glowny") {
      return `/narzedzia/${toolSlug}/`;
    }
    if (!rest.length) {
      return `/narzedzia/${toolSlug}/`;
    }
    return `/narzedzia/${toolSlug}/${rest.join("/")}/`;
  }

  const leafSegments = [...rest, parsed.name].filter(Boolean);
  if (!leafSegments.length) {
    return `/narzedzia/${toolSlug}/`;
  }
  return `/narzedzia/${toolSlug}/${leafSegments.join("/")}/`;
}

function getExplicitSlug(frontmatter, parsed) {
  if (typeof frontmatter?.slug === "string" && frontmatter.slug.trim()) {
    return frontmatter.slug.trim();
  }

  if (parsed.name !== "index") {
    return parsed.name;
  }

  const directorySegments = parsed.dir.split("/").filter(Boolean);
  return directorySegments.at(-1) ?? parsed.name;
}
