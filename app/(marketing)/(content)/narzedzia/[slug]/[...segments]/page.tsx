import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContentLibrary } from "@/app/lib/content/contentLibrary";
import { ContentPageCoordinator } from "@/app/lib/content/contentPageCoordinator";

import styles from "../../../[...segments]/content-page.module.css";

const library = new ContentLibrary();
const coordinator = new ContentPageCoordinator(library);

interface ToolArticleProps {
  params: Promise<{
    slug: string;
    segments?: string[];
  }>;
}

const buildSegments = (slug: string, extra: string[] = []) => [
  "narzedzia",
  slug,
  ...extra,
];

export function generateStaticParams() {
  return coordinator
    .listStaticParams()
    .filter(
      ({ segments }) => segments[0] === "narzedzia" && segments.length > 2,
    )
    .map(({ segments }) => ({
      slug: segments[1],
      segments: segments.slice(2),
    }));
}

export async function generateMetadata({
  params,
}: ToolArticleProps): Promise<Metadata> {
  const { slug, segments = [] } = await params;
  const viewModel = coordinator.build(buildSegments(slug, segments));
  if (!viewModel) {
    return {};
  }
  return viewModel.getMetadata();
}

export default async function ToolArticle({ params }: ToolArticleProps) {
  const { slug, segments = [] } = await params;
  const viewModel = coordinator.build(buildSegments(slug, segments));
  if (!viewModel) {
    notFound();
  }

  const heading = viewModel.getHeroHeading();
  const subheading = viewModel.getHeroSubheading();
  const publishedDate = viewModel.getPublishedDate();

  return (
    <section className="section section--surface" id="content">
      <div className="pbk-container pbk-stack pbk-stack--loose">
        <header className="pbk-stack pbk-stack--tight">
          <p className={styles.contentPagePath}>{viewModel.getPath()}</p>
          <h1>{heading}</h1>
          {subheading ? (
            <p className={styles.contentPageLead}>{subheading}</p>
          ) : null}
          {publishedDate ? (
            <small className={styles.contentPageMeta}>
              <time dateTime={publishedDate}>{formatDate(publishedDate)}</time>
            </small>
          ) : null}
        </header>
        <article className="prose">{viewModel.getBody()}</article>
      </div>
    </section>
  );
}

function formatDate(input: string): string {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    return input;
  }
  return new Intl.DateTimeFormat("pl-PL", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(date);
}
