import type { Metadata } from "next";
import { readMarkdownFile } from "../lib/frontmatter";
import {
  ArticleRepository,
  type ContentSummary,
} from "../lib/content/repositories";
import { HeroSection } from "./homepage/HeroSection";
import { HomepageSections } from "./homepage/HomepageSections";

const HOMEPAGE_PATH = "content/_examples/homepage.md";

export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  const { frontmatter } = readMarkdownFile(HOMEPAGE_PATH);
  return {
    title: frontmatter.seo?.title ?? frontmatter.title,
    description: frontmatter.seo?.description,
    keywords: frontmatter.seo?.keywords,
  };
}

export default function Homepage() {
  const articleRepository = new ArticleRepository();
  const latestArticles = selectLatestArticles(
    articleRepository.listSummaries(),
  );

  return (
    <div>
      <HeroSection />
      <HomepageSections articles={latestArticles} />
    </div>
  );
}

function selectLatestArticles(
  summaries: ContentSummary[],
  limit = 3,
): ContentSummary[] {
  return summaries
    .slice()
    .sort((a, b) => {
      const timeA = a.date ? Date.parse(a.date) : 0;
      const timeB = b.date ? Date.parse(b.date) : 0;
      if (timeA === timeB) {
        return a.title.localeCompare(b.title, "pl");
      }
      return timeB - timeA;
    })
    .slice(0, limit);
}
