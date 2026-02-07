import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";

import { proxy } from "../proxy";

describe("proxy", () => {
  it("redirects merged page paths to the first canonical path", () => {
    const cases = [
      {
        input:
          "https://example.com/narzedzia/bigcommerce/recenzja/,%20/narzedzia/bigcommerce/recenzja",
        expected: "https://example.com/narzedzia/bigcommerce/recenzja",
      },
      {
        input:
          "https://example.com/artykuly/seo/poradnik/,%20/artykuly/seo/poradnik",
        expected: "https://example.com/artykuly/seo/poradnik",
      },
      {
        input:
          "https://example.com/poradniki/automatyzacje/,%20/poradniki/automatyzacje",
        expected: "https://example.com/poradniki/automatyzacje",
      },
    ] as const;

    cases.forEach(({ input, expected }) => {
      const request = new NextRequest(input);
      const response = proxy(request);
      expect(response.status).toBe(308);
      expect(response.headers.get("location")).toBe(expected);
    });
  });

  it("rewrites malformed _next paths", () => {
    const request = new NextRequest(
      "https://example.com/_next//_next/static/chunk.js",
    );

    const response = proxy(request);
    expect(response.headers.get("x-middleware-rewrite")).toBe(
      "https://example.com/_next/static/chunk.js",
    );
  });
});
