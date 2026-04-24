import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => createElement("img", props),
}));

import { BrandLogo } from "./BrandLogo";

describe("BrandLogo", () => {
  it("renders the shared header wordmark without preloading it", () => {
    const html = renderToStaticMarkup(createElement(BrandLogo));

    expect(html).toContain('src="/projektbezkodu_logo.png"');
    expect(html).toContain('quality="60"');
    expect(html).toContain('decoding="async"');
    expect(html).toContain('sizes="(max-width: 768px) 120px, 128px"');
    expect(html).not.toContain("priority=");
  });
});
