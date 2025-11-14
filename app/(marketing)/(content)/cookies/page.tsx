import type { Metadata } from "next";
import { getCopy } from "@/app/lib/copy";
import { CookiePreferencesForm } from "./CookiePreferencesForm";
import "./cookies.module.css";

const copy = getCopy("cookies");

export const metadata: Metadata = {
  title: copy.seo.title,
  description: copy.seo.description,
  alternates: {
    canonical: copy.seo.canonical,
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function CookiesSettingsPage() {
  return (
    <section className="cookies-page" id="content">
      <div className="pbk-container pbk-stack pbk-stack--tight pbk-readable">
        <header className="cookies-page__intro">
          <h1>{copy.hero.title}</h1>
          <p>{copy.hero.intro}</p>
        </header>
        <CookiePreferencesForm
          labels={copy.categories}
          intro={copy.hero.intro}
          actions={copy.actions}
          privacyLink={copy.privacyLink}
        />
      </div>
    </section>
  );
}
