/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button, TextField, CheckboxField } from "@/app/ui";
import { LeadMagnetCatalog } from "@/app/lib/content/leadMagnetCatalog";
import "./../lead-magnet.module.css";

const catalog = new LeadMagnetCatalog();

export function generateStaticParams() {
  return catalog.listSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const leadMagnet = catalog.get(params.slug);
  if (!leadMagnet) {
    return {};
  }

  return {
    title: leadMagnet.seo.title,
    description: leadMagnet.seo.description,
    alternates: {
      canonical: leadMagnet.seo.canonical,
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default function LeadMagnetPage({
  params,
}: {
  params: { slug: string };
}) {
  const leadMagnet = catalog.get(params.slug);
  if (!leadMagnet) {
    notFound();
  }

  return (
    <section className="lead-page" id="content">
      <div className="pbk-container lead-page__grid">
        <div className="lead-page__hero">
          <header className="pbk-stack pbk-stack--tight">
            <h1>{leadMagnet.hero.title}</h1>
          </header>
          <ul className="lead-page__bullets">
            {leadMagnet.hero.bullets.map((bullet) => (
              <li key={bullet}>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
          <img
            className="lead-page__image"
            src={leadMagnet.hero.image.src}
            alt={leadMagnet.hero.image.alt}
            width={leadMagnet.hero.image.width}
            height={leadMagnet.hero.image.height}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="lead-page__formCard">
          <header className="pbk-stack pbk-stack--tight">
            <h2>{leadMagnet.form.title}</h2>
          </header>
          <form
            className="lead-page__form"
            action={leadMagnet.form.action}
            method={leadMagnet.form.method}
          >
            <TextField
              id={leadMagnet.form.emailField.id}
              name="email"
              type="email"
              label={leadMagnet.form.emailField.label}
              placeholder={leadMagnet.form.emailField.placeholder}
              required
              autoComplete="email"
            />
            <CheckboxField
              id={leadMagnet.form.consentField.id}
              name="consent"
              label={leadMagnet.form.consentField.label}
              required
            />
            <Button type="submit" variant="primary">
              {leadMagnet.form.submitLabel}
            </Button>
            <p className="lead-page__disclaimer">
              {leadMagnet.form.disclaimer}{" "}
              <Link href={leadMagnet.form.consentField.privacyHref}>
                {leadMagnet.form.consentField.privacyLabel}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
