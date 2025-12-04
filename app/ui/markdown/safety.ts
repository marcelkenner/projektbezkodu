const ALLOWED_PROTOCOLS = new Set<URL["protocol"]>([
  "http:",
  "https:",
  "mailto:",
  "tel:",
]);
const LOCAL_BASE = "http://localhost";

export function isAnchorUrl(raw: string | null | undefined): boolean {
  if (!raw) {
    return false;
  }
  const trimmed = raw.trim();
  return trimmed.startsWith("#");
}

export function isSafeUrl(raw: string | null | undefined): boolean {
  if (!raw) {
    return false;
  }
  const trimmed = raw.trim();
  if (!trimmed) {
    return false;
  }
  if (isAnchorUrl(trimmed)) {
    return true;
  }
  try {
    const url = new URL(trimmed, LOCAL_BASE);
    return ALLOWED_PROTOCOLS.has(url.protocol);
  } catch {
    return false;
  }
}

export function isExternalUrl(href: string | null | undefined): boolean {
  if (!href) {
    return false;
  }
  const trimmed = href.trim();
  if (!trimmed) {
    return false;
  }
  if (trimmed.startsWith("#")) {
    return false;
  }
  if (trimmed.startsWith("//")) {
    return true;
  }
  return /^https?:\/\//i.test(trimmed);
}

export function isMailOrTel(href: string | null | undefined): boolean {
  if (!href) {
    return false;
  }
  return /^(mailto:|tel:)/i.test(href.trim());
}
