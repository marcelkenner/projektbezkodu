import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { CanonicalHostRedirectManager } from "@/app/lib/url/CanonicalHostRedirectManager";
import { RedirectPathRecoveryManager } from "@/app/lib/url/RedirectPathRecoveryManager";

const canonicalHostRedirectManager = new CanonicalHostRedirectManager();
const redirectPathRecoveryManager = new RedirectPathRecoveryManager();

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const recoveredPath = redirectPathRecoveryManager.recover(pathname);
  const canonicalHostRedirectUrl = canonicalHostRedirectManager.buildRedirectUrl(
    req,
    recoveredPath,
    search,
  );
  if (canonicalHostRedirectUrl) {
    return NextResponse.redirect(canonicalHostRedirectUrl, 308);
  }

  if (recoveredPath !== pathname) {
    const url = req.nextUrl.clone();
    url.pathname = recoveredPath;
    url.search = search;
    return NextResponse.redirect(url, 308);
  }

  if (!pathname.startsWith("/_next/")) {
    return NextResponse.next();
  }

  // Normalize repeated slashes and duplicated `_next` segments to avoid chunk load failures.
  let normalized = pathname.replace(/\/{2,}/g, "/");
  normalized = normalized.replace(/\/_next(?:\/_next)+/g, "/_next");

  if (normalized !== pathname) {
    const url = req.nextUrl.clone();
    url.pathname = normalized;
    url.search = search;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/_next/:path*", "/((?!api|_next|.*\\..*).*)"],
};
