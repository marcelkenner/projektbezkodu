import { describe, expect, it } from "vitest";

import { isAnchorUrl, isExternalUrl, isMailOrTel, isSafeUrl } from "./safety";

describe("app/ui/markdown/safety", () => {
  it("detects anchor URLs", () => {
    expect(isAnchorUrl("#section")).toBe(true);
    expect(isAnchorUrl(" #section ")).toBe(true);
    expect(isAnchorUrl("")).toBe(false);
    expect(isAnchorUrl(null)).toBe(false);
    expect(isAnchorUrl(undefined)).toBe(false);
    expect(isAnchorUrl("/#section")).toBe(false);
  });

  it("accepts safe URLs", () => {
    expect(isSafeUrl("#section")).toBe(true);
    expect(isSafeUrl("/docs/getting-started")).toBe(true);
    expect(isSafeUrl("https://example.com")).toBe(true);
    expect(isSafeUrl("http://example.com")).toBe(true);
    expect(isSafeUrl("mailto:hello@example.com")).toBe(true);
    expect(isSafeUrl("tel:+48123123123")).toBe(true);
  });

  it("rejects unsafe or invalid URLs", () => {
    expect(isSafeUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeUrl("data:text/html;base64,PGgxPjxoMT4=")).toBe(false);
    expect(isSafeUrl("   ")).toBe(false);
    expect(isSafeUrl("http://")).toBe(false);
  });

  it("detects external URLs", () => {
    expect(isExternalUrl("https://example.com")).toBe(true);
    expect(isExternalUrl("http://example.com")).toBe(true);
    expect(isExternalUrl("//cdn.example.com/app.js")).toBe(true);

    expect(isExternalUrl("/internal")).toBe(false);
    expect(isExternalUrl("#section")).toBe(false);
    expect(isExternalUrl("mailto:hello@example.com")).toBe(false);
  });

  it("detects mail/tel schemes", () => {
    expect(isMailOrTel("mailto:hello@example.com")).toBe(true);
    expect(isMailOrTel("tel:+48123123123")).toBe(true);
    expect(isMailOrTel(" https://example.com ")).toBe(false);
  });
});

