import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

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
  matcher: ["/_next/:path*"],
};
