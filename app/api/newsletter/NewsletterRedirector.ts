import { NextResponse } from "next/server";

import { RequestOriginResolver } from "@/app/api/newsletter/RequestOriginResolver";

export class NewsletterRedirector {
  constructor(private readonly originResolver = new RequestOriginResolver()) {}

  redirect(request: Request, pathname: string, params: Record<string, string>) {
    const origin = this.originResolver.resolve(request);
    const target = new URL(pathname, origin);
    Object.entries(params).forEach(([key, value]) => {
      target.searchParams.set(key, value);
    });
    return NextResponse.redirect(target);
  }
}
