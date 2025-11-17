import fs from "fs";
import path from "path";
import Link from "next/link";
import type { Metadata } from "next";

import { getCopy } from "@/app/lib/copy";
import "./tools.module.css";
import { ToolsJumpSelect } from "./ToolsJumpSelect";
import { StructuredDataScript } from "@/app/ui";
import { defaultSiteUrlFactory } from "@/app/lib/url/SiteUrlFactory";

const copy = getCopy("tools");
const CONTENT_ROOT = path.join(process.cwd(), "content/narzedzia");

export const metadata: Metadata = {
  title: copy.seo.title,
  description: copy.seo.description,
  alternates: {
    canonical: copy.seo.canonical,
  },
};

export default function ToolsPage() {
  const overview = loadToolsFromContent();
  const itemListStructuredData = buildToolCollectionJsonLd(overview);

  return (
    <section className="tools-page" id="content">
      <StructuredDataScript
        id="tools-item-list"
        data={itemListStructuredData}
      />
      <div className="pbk-container pbk-stack pbk-stack--tight">
        <div className="pbk-readable pbk-readable--start">
          <div className="tools-page__intro">
            <h1>{copy.hero.title}</h1>
            <p>{copy.hero.intro}</p>
          </div>
        </div>
        <ToolsJumpSelect tools={overview} />
        <div className="tools-page__grid">
          {overview.map((tool) => (
            <article key={tool.slug} className="tools-page__card">
              <div className="pbk-stack pbk-stack--tight">
                <span className="tools-page__badge">{tool.folderName}</span>
                <h2>{tool.heading ?? tool.title ?? tool.folderName}</h2>
                {tool.subheading ? <p>{tool.subheading}</p> : null}
              </div>
              <div className="tools-detail__cta">
                <Link
                  className="pbk-button pbk-button--secondary"
                  href={tool.path}
                >
                  Przewodnik
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

interface ToolOverviewEntry {
  folderName: string;
  slug: string;
  path: string;
  title: string;
  heading?: string;
  subheading?: string;
}

function loadToolsFromContent(): ToolOverviewEntry[] {
  if (!fs.existsSync(CONTENT_ROOT)) {
    return [];
  }

  const entries = fs
    .readdirSync(CONTENT_ROOT, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        !entry.name.startsWith(".") &&
        entry.name !== "_examples",
    );

  const tools: ToolOverviewEntry[] = [];

  entries.forEach((entry) => {
    const indexPath = path.join(CONTENT_ROOT, entry.name, "index.md");
    if (!fs.existsSync(indexPath)) {
      return;
    }

    const file = fs.readFileSync(indexPath, "utf8");
    const frontmatter = parseFrontmatter(file);
    const slug = toNonEmptyString(frontmatter.slug);
    const pathValue = toNonEmptyString(frontmatter.path);
    if (!pathValue) {
      return;
    }
    const title = toNonEmptyString(frontmatter.title) ?? entry.name;
    const hero = isRecord(frontmatter.hero) ? frontmatter.hero : undefined;
    const heroHeading = toNonEmptyString(hero?.heading);
    const heroSubheading = toNonEmptyString(hero?.subheading);

    tools.push({
      folderName: entry.name,
      slug: slug ?? entry.name,
      path: pathValue,
      title,
      heading: heroHeading,
      subheading: heroSubheading,
    });
  });

  return tools.sort((a, b) =>
    a.title.toLowerCase().localeCompare(b.title.toLowerCase(), "pl"),
  );
}

function parseFrontmatter(file: string): Record<string, unknown> {
  const match = /^---\n([\s\S]*?)\n---/.exec(file);
  if (!match) {
    return {};
  }
  const yaml = match[1];
  const entries = yaml.split("\n").filter(Boolean);
  const data: Record<string, unknown> = {};
  entries.forEach((line) => {
    const [key, ...rest] = line.split(":");
    const value = rest
      .join(":")
      .trim()
      .replace(/^"|"$|^'|'$/g, "");
    const keys = key.trim().split(".");
    let target = data as Record<string, unknown>;
    keys.forEach((k, index) => {
      if (index === keys.length - 1) {
        target[k] = value;
      } else {
        target[k] = target[k] ?? {};
        target = target[k] as Record<string, unknown>;
      }
    });
  });
  return data;
}

function toNonEmptyString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function buildToolCollectionJsonLd(entries: ToolOverviewEntry[]) {
  if (!entries.length) {
    return null;
  }

  const factory = defaultSiteUrlFactory;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: entries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: factory.build(entry.path),
      name: entry.heading ?? entry.title ?? entry.folderName,
      description: entry.subheading,
    })),
  };
}
