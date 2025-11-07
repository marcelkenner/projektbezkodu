import Link from "next/link";
import type { Metadata } from "next";
import { TagDirectory } from "@/app/lib/content/tagDirectory";
import { getCopy } from "@/app/lib/copy";
import "./tag.module.css";

const copy = getCopy("tags");
const directory = new TagDirectory();

export const metadata: Metadata = {
  title: copy.seo.title,
  description: copy.seo.description,
  alternates: {
    canonical: copy.seo.canonical,
  },
};

export default function TagIndexPage() {
  const tags = directory.list();

  return (
    <section className="tag-page" id="content">
      <div className="pbk-container pbk-stack pbk-stack--tight">
        <div className="tag-page__intro">
          <h1>{copy.hero.title}</h1>
          <p>{copy.hero.intro}</p>
        </div>
        <div className="tag-page__list">
          {tags.map((tag) => (
            <article key={tag.slug} className="tag-page__item">
              <Link href={`/tag/${tag.slug}/`}>{tag.label}</Link>
              {tag.description ? (
                <p className="pbk-card__meta">{tag.description}</p>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
