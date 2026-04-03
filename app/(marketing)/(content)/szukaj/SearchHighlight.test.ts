import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { SearchHighlight } from "./SearchHighlight";

describe("SearchHighlight", () => {
  it("highlights the matching query token instead of the following segment", () => {
    const html = renderToStaticMarkup(
      createElement(SearchHighlight, {
        text: "Webflow CMS: kategorie i tagowanie",
        query: "webflow",
      }),
    );

    expect(html).toBe(
      "<mark>Webflow</mark> CMS: kategorie i tagowanie",
    );
  });
});
