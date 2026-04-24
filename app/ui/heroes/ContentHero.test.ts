import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => createElement("img", props),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: unknown;
    href: string;
  }) => createElement("a", { href, ...props }, children),
}));

import { ContentHero } from "./ContentHero";

describe("ContentHero", () => {
  it("renders the hero image with explicit high-priority loading hints", () => {
    const html = renderToStaticMarkup(
      createElement(ContentHero, {
        heading: "Adobe Creative Cloud",
        subheading: "Cennik i koszty",
        breadcrumbs: [
          { label: "Strona główna", href: "/" },
          { label: "Narzędzia", href: "/narzedzia/" },
          { label: "Adobe Creative Cloud", isCurrent: true },
        ],
        image: {
          src: "/images/tools/adobe-creative-cloud-pricing.webp",
          alt: "Tabela planów Adobe",
          width: 1200,
          height: 628,
        },
      }),
    );

    expect(html).toContain('fetchPriority="high"');
    expect(html).toContain('loading="eager"');
    expect(html).toContain('decoding="async"');
    expect(html).toContain('sizes="100vw"');
    expect(html).not.toContain("priority=");
  });
});
