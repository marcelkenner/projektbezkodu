import Link from "next/link";
import type { Metadata } from "next";
import { getCopy } from "@/app/lib/copy";
import { RefreshButton } from "./RefreshButton";
import styles from "./offline.module.css";

const copy = getCopy("offline");

export const metadata: Metadata = {
  title: copy.seo.title,
  description: copy.seo.description,
  alternates: {
    canonical: copy.seo.canonical,
  },
  robots: {
    index: false,
    follow: false,
  },
};

class OfflineViewModel {
  getHero() {
    return copy.hero;
  }

  getActions() {
    return copy.actions;
  }

  getCachedLinks() {
    return copy.cachedLinks;
  }
}

export default function OfflineFallbackPage() {
  const viewModel = new OfflineViewModel();
  const cachedLinks = viewModel.getCachedLinks();

  return (
    <section
      className={`${styles.scope} offline-page section section--surface`}
      id="content"
    >
      <div className="pbk-container pbk-stack pbk-stack--tight">
        <div className="offline-page__icon" aria-hidden="true">
          <span>📡</span>
        </div>
        <h1>{viewModel.getHero().title}</h1>
        <p>{viewModel.getHero().description}</p>
        <div className="offline-page__actions">
          <RefreshButton label={viewModel.getActions().refresh} />
        </div>
        <section className="offline-page__cached pbk-card pbk-stack">
          <h2>{cachedLinks.heading}</h2>
          {cachedLinks.links.length ? (
            <ul>
              {cachedLinks.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>{cachedLinks.empty}</p>
          )}
        </section>
      </div>
    </section>
  );
}
