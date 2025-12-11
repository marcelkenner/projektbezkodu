import type { Metadata } from "next";
import { readMarkdownFile } from "../lib/frontmatter";
import { HeroSection } from "./homepage/HeroSection";
import { HomepageSections } from "./homepage/HomepageSections";
import { LatestArticlesManager } from "../lib/content/LatestArticlesManager";

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
  const latestArticles = new LatestArticlesManager().listLatest(6);

  return (
    <div>
      <HeroSection />
      <HomepageSections articles={latestArticles} />
    </div>
  );
}
