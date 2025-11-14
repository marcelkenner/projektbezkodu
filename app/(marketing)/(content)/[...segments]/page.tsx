import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContentLibrary } from "@/app/lib/content/contentLibrary";
import { ContentPageCoordinator } from "@/app/lib/content/contentPageCoordinator";

import { TableOfContents } from "@/app/ui/TableOfContents";
import styles from "./content-page.module.css";
import "../artykuly/article.module.css";

const library = new ContentLibrary();
const coordinator = new ContentPageCoordinator(library);

interface ContentPageProps {
  params: Promise<{
    segments: string[];
  }>;
}

export function generateStaticParams() {
  return coordinator.listStaticParams();
}

export async function generateMetadata({
  params,
}: ContentPageProps): Promise<Metadata> {
  const { segments } = await params;
  const viewModel = coordinator.build(segments);
  if (!viewModel) {
    return {};
  }
  return viewModel.getMetadata();
}

export default async function ContentPage({ params }: ContentPageProps) {
  const { segments } = await params;
  const viewModel = coordinator.build(segments);
  if (!viewModel) {
    notFound();
  }

  const heading = viewModel.getHeroHeading();
  const subheading = viewModel.getHeroSubheading();
  const publishedDate = viewModel.getPublishedDate();
  const tocItems = viewModel.getHeadings();
  const hasToc = tocItems.length > 0;
  const useArticleLayout = viewModel.shouldUseArticleLayout();
  const layoutClassName = hasToc
    ? "article-page__layout article-page__layout--with-toc"
    : "article-page__layout";

  if (useArticleLayout) {
    return (
      <section className="article-page" id="content">
        <div className="pbk-container">
          <header className="article-page__header">
            <p className={styles.contentPagePath}>{viewModel.getPath()}</p>
            <h1>{heading}</h1>
            {subheading ? (
              <p className={styles.contentPageLead}>{subheading}</p>
            ) : null}
            {publishedDate ? (
              <small className={styles.contentPageMeta}>
                <time dateTime={publishedDate}>
                  {formatDate(publishedDate)}
                </time>
              </small>
            ) : null}
          </header>
          <div className={layoutClassName}>
            {hasToc ? (
              <div className="article-page__toc">
                <TableOfContents items={tocItems} />
              </div>
            ) : null}
            <article className="prose">{viewModel.getBody()}</article>
          </div>
        </div>
      </section>
    );
  }

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
