import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContentLibrary } from "@/app/lib/content/contentLibrary";
import { ContentPageCoordinator } from "@/app/lib/content/contentPageCoordinator";

import styles from "./content-page.module.css";

const library = new ContentLibrary();
const coordinator = new ContentPageCoordinator(library);

interface ContentPageProps {
  params: {
    segments: string[];
  };
}

export function generateStaticParams() {
  return coordinator.listStaticParams();
}

export function generateMetadata({ params }: ContentPageProps): Metadata {
  const viewModel = coordinator.build(params.segments);
  if (!viewModel) {
    return {};
  }
  return viewModel.getMetadata();
}

export default function ContentPage({ params }: ContentPageProps) {
  const viewModel = coordinator.build(params.segments);
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
