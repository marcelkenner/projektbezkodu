const ALLOWED_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);
const LOCAL_BASE = "http://localhost";

export function isAnchorUrl(raw: string): boolean {
  return raw.startsWith("#");
}

export function isSafeUrl(raw: string | null | undefined): boolean {
  if (!raw) return false;
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

export function isExternalUrl(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

export function isMailOrTel(href: string): boolean {
  return /^mailto:|^tel:/i.test(href);
}
