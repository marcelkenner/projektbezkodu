import type { Metadata } from "next";
import Link from "next/link";
import { getCopy } from "@/app/lib/copy";
import "../contact.module.css";

const copy = getCopy("contact");

export const metadata: Metadata = {
  title: `${copy.hero.title} | ProjektBezKodu`,
  description: copy.hero.intro,
  robots: {
    index: false,
    follow: true,
  },
};

export default function ContactLegacyThankYouPage() {
  return (
    <section className="contact-page" id="content">
      <div className="pbk-container pbk-stack pbk-stack--tight">
        <header className="pbk-stack pbk-stack--tight">
          <h1>Dziękujemy za wiadomość</h1>
          <p className="pbk-card__meta">
            Formularz kontaktowy został wyłączony. Napisz proszę na{" "}
            <Link href={`mailto:${copy.notice.email}`}>
              {copy.notice.email}
            </Link>
            .
          </p>
        </header>
        <Link className="pbk-button pbk-button--secondary" href="/kontakt/">
          Wróć do sekcji kontakt
        </Link>
      </div>
    </section>
  );
}
