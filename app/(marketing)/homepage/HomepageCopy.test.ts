import { expect, test } from "vitest";

import homepageCopy from "@/data/copy/homepage.json";

function getHeroVariant(id: string) {
  return homepageCopy.hero.variants.find((variant) => variant.id === id);
}

test("homepage hero variants point to published routes", () => {
  const leadGenerationVariant = getHeroVariant("lead-gen");
  const automationVariant = getHeroVariant("automation");

  expect(leadGenerationVariant?.secondaryCta.href).toBe(
    "/artykuly/sciezki/webflow-30-dni/",
  );
  expect(automationVariant?.secondaryCta.href).toBe("/artykuly/automation/");
});

test("homepage resources link to the published lead magnet page", () => {
  const downloadResource = homepageCopy.resources.items.find(
    (item) => item.title === "Materiały do pobrania",
  );

  expect(downloadResource?.href).toBe("/do-pobrania/start-checklista/");
});
