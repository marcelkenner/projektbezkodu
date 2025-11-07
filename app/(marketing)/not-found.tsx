import Link from "next/link";
import { MagnifyingGlass, Warning } from "@phosphor-icons/react/dist/ssr";
import { getCopy } from "@/app/lib/copy";
import "./not-found.module.css";

export default function NotFoundPage() {
  const copy = getCopy("not-found");

  return (
    <section className="not-found" id="content">
      <div className="pbk-container not-found__inner">
        <Warning aria-hidden="true" className="not-found__icon" weight="bold" />
        <h1>{copy.title}</h1>
        <p>{copy.body}</p>
        <div className="not-found__cta">
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
        <form
          className="not-found__search"
          method="get"
          role="search"
          aria-label={copy.search.label}
          action={copy.search.action}
        >
          <label className="sr-only" htmlFor="not-found-query">
            {copy.search.label}
          </label>
          <input
            id="not-found-query"
            name="q"
            type="search"
            placeholder={copy.search.placeholder}
            minLength={2}
          />
          <button type="submit" aria-label={copy.search.buttonLabel}>
            <MagnifyingGlass aria-hidden="true" size={20} weight="bold" />
          </button>
        </form>
        {copy.shortcuts?.length ? (
          <ul className="not-found__links">
            {copy.shortcuts.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
