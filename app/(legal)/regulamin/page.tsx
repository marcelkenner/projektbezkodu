import { MarkdownPageLoader } from "@/app/lib/content/pageLoader";
import { MarkdownRenderer } from "@/app/ui/MarkdownRenderer";
import { getCopy } from "../../lib/copy";
import "../legal.module.css";

const termsPageLoader = new MarkdownPageLoader("content/regulamin/index.md");

export default function TermsPage() {
  const copy = getCopy("terms");
  const page = termsPageLoader.load();
  const renderer = new MarkdownRenderer(page.content);
  const lastUpdatedDate =
    copy.lastUpdated?.datetime ?? page.frontmatter.date ?? "";
  const lastUpdatedLabel =
    copy.lastUpdated?.label ?? formatDate(lastUpdatedDate);

  return (
    <section className="legal-page" id="content">
      <div className="pbk-container legal-page__content">
        <header className="legal-page__header">
          <h1>{copy.title}</h1>
          <p>{copy.lead}</p>
          {lastUpdatedDate ? (
            <small className="legal-page__meta">
              <time dateTime={lastUpdatedDate}>{lastUpdatedLabel}</time>
            </small>
          ) : null}
        </header>
        <article className="prose">{renderer.render()}</article>
        <div className="legal-page__contact">
          <strong>Kontakt</strong>
          <span>{copy.contact?.email}</span>
          <span>{copy.contact?.address}</span>
        </div>
      </div>
    </section>
  );
}

function formatDate(isoDate: string): string {
  if (!isoDate) {
    return "";
  }
  const parsed = Date.parse(isoDate);
  if (Number.isNaN(parsed)) {
    return "";
  }
  return new Intl.DateTimeFormat("pl-PL", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(parsed);
}
