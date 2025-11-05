import Link from "next/link";
import { getCopy } from "../lib/copy";

export default function NotFoundPage() {
  const copy = getCopy("not-found");

  return (
    <section className="section section--surface">
      <div
        className="pbk-container pbk-stack pbk-stack--tight"
        style={{ paddingBlock: "6rem" }}
      >
        <span className="pbk-badge pbk-badge--neutral">404</span>
        <h1>{copy.title}</h1>
        <p>{copy.body}</p>
        <div className="hero__actions">
          <Link
            className="pbk-button pbk-button--primary"
            href={copy.primaryCta.href}
          >
            {copy.primaryCta.label}
          </Link>
          <Link
            className="pbk-button pbk-button--secondary"
            href={copy.secondaryCta.href}
          >
            {copy.secondaryCta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
