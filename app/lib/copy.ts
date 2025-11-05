import globalCopy from "@/data/copy/global.json";
import homepageCopy from "@/data/copy/homepage.json";
import notFoundCopy from "@/data/copy/not-found.json";
import articlesCopy from "@/data/copy/articles.json";
import comparisonsCopy from "@/data/copy/comparisons.json";
import tutorialsCopy from "@/data/copy/tutorials.json";
import glossaryCopy from "@/data/copy/glossary.json";
import privacyCopy from "@/data/copy/privacy.json";
import termsCopy from "@/data/copy/terms.json";

type CopyMap = {
  global: typeof globalCopy;
  homepage: typeof homepageCopy;
  "not-found": typeof notFoundCopy;
  articles: typeof articlesCopy;
  comparisons: typeof comparisonsCopy;
  tutorials: typeof tutorialsCopy;
  glossary: typeof glossaryCopy;
  privacy: typeof privacyCopy;
  terms: typeof termsCopy;
};

const copies: CopyMap = {
  global: globalCopy,
  homepage: homepageCopy,
  "not-found": notFoundCopy,
  articles: articlesCopy,
  comparisons: comparisonsCopy,
  tutorials: tutorialsCopy,
  glossary: glossaryCopy,
  privacy: privacyCopy,
  terms: termsCopy,
};

export function getCopy<K extends keyof CopyMap>(section: K): CopyMap[K] {
  return copies[section];
}
