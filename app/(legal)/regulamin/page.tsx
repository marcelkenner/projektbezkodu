import { MarkdownPageLoader } from "@/app/lib/content/pageLoader";
import { MarkdownRenderer } from "@/app/ui/MarkdownRenderer";
import { getCopy } from "../../lib/copy";

const termsPageLoader = new MarkdownPageLoader("content/regulamin/index.md");

export default function TermsPage() {
  const copy = getCopy("terms");
  const page = termsPageLoader.load();
  const renderer = new MarkdownRenderer(page.content);

  return (
    <section className="section section--surface">
      <div className="pbk-container pbk-stack pbk-stack--tight">
        <h1>{copy.title}</h1>
        <p>{copy.lead}</p>
        <p className="pbk-input__description">{copy.lastUpdated}</p>
        <article className="prose">{renderer.render()}</article>
      </div>
    </section>
  );
}
