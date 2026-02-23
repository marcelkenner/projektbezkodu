import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { CanonicalHostRedirectManager } from "@/app/lib/url/CanonicalHostRedirectManager";

describe("CanonicalHostRedirectManager", () => {
  it("redirects www host to apex host when apex is canonical", () => {
    const manager = new CanonicalHostRedirectManager("https://projektbezkodu.pl");
    const request = new NextRequest("https://www.projektbezkodu.pl/kontakt/?utm=1");

    const redirectUrl = manager.buildRedirectUrl(
      request,
      request.nextUrl.pathname,
      request.nextUrl.search,
    );

    expect(redirectUrl?.toString()).toBe("https://projektbezkodu.pl/kontakt/?utm=1");
  });

  it("redirects apex host to www host when www is canonical", () => {
    const manager = new CanonicalHostRedirectManager(
      "https://www.projektbezkodu.pl",
    );
    const request = new NextRequest("https://projektbezkodu.pl/artykuly/");

    const redirectUrl = manager.buildRedirectUrl(
      request,
      request.nextUrl.pathname,
      request.nextUrl.search,
    );

    expect(redirectUrl?.toString()).toBe("https://www.projektbezkodu.pl/artykuly/");
  });

  it("strips non-local canonical ports from redirect targets", () => {
    const manager = new CanonicalHostRedirectManager(
      "https://projektbezkodu.pl:8080",
    );
    const request = new NextRequest("https://www.projektbezkodu.pl/kontakt/");

    const redirectUrl = manager.buildRedirectUrl(
      request,
      request.nextUrl.pathname,
      request.nextUrl.search,
    );

    expect(redirectUrl?.toString()).toBe("https://projektbezkodu.pl/kontakt/");
  });

  it("uses x-forwarded-host when present", () => {
    const manager = new CanonicalHostRedirectManager("https://projektbezkodu.pl");
    const request = new NextRequest("https://projektbezkodu.pl/poradniki/", {
      headers: { "x-forwarded-host": "www.projektbezkodu.pl, proxy.internal" },
    });

    const redirectUrl = manager.buildRedirectUrl(
      request,
      request.nextUrl.pathname,
      request.nextUrl.search,
    );

    expect(redirectUrl?.toString()).toBe("https://projektbezkodu.pl/poradniki/");
  });

  it("skips localhost hosts", () => {
    const manager = new CanonicalHostRedirectManager("https://projektbezkodu.pl");
    const request = new NextRequest("http://localhost:3000/kontakt/");

    const redirectUrl = manager.buildRedirectUrl(
      request,
      request.nextUrl.pathname,
      request.nextUrl.search,
    );

    expect(redirectUrl).toBeNull();
  });

  it("does not redirect unrelated domains", () => {
    const manager = new CanonicalHostRedirectManager("https://projektbezkodu.pl");
    const request = new NextRequest("https://example.com/kontakt/");

    const redirectUrl = manager.buildRedirectUrl(
      request,
      request.nextUrl.pathname,
      request.nextUrl.search,
    );

    expect(redirectUrl).toBeNull();
  });
});
