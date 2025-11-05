import type { Metadata } from "next";
import { readMarkdownFile } from "../lib/frontmatter";
import { Hero } from "./homepage/Hero";
import { ContentSections } from "./homepage/ContentSections";

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
  const { frontmatter } = readMarkdownFile(HOMEPAGE_PATH);
  return (
    <div>
      <Hero hero={frontmatter.hero} />
      <ContentSections frontmatter={frontmatter} />
    </div>
  );
}
