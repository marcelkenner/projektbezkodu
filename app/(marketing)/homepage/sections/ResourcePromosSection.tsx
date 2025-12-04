import Link from "next/link";
import {
  HomepageIconFactory,
  type ResourcePromoIconName,
} from "./HomepageIconFactory";
import "../resource-section.module.css";

export interface ResourcePromoCopy {
  heading: string;
  subheading?: string;
  primary?: ResourcePromoContent;
  items: ResourcePromoContent[];
}

export interface ResourcePromoContent {
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  icon: ResourcePromoIconName;
  badge?: string;
  stat?: string;
}

class ResourcePromoModel {
  constructor(private readonly content: ResourcePromoContent) {}

  get title() {
    return this.content.title;
  }

  get description() {
    return this.content.description;
  }

  get href() {
    return this.content.href;
  }

  get icon() {
    return this.content.icon;
  }

  get badge() {
    return this.content.badge;
  }

  get stat() {
    return this.content.stat;
  }

  get ctaLabel() {
    return this.content.ctaLabel;
  }

  get ariaLabel() {
    return `${this.content.ctaLabel} → ${this.content.title}`;
  }
}

export function ResourcePromosSection({ copy }: { copy: ResourcePromoCopy }) {
  const items = copy.items?.map((item) => new ResourcePromoModel(item)) ?? [];
  const primary = copy.primary ? new ResourcePromoModel(copy.primary) : null;

  if (!primary && !items.length) {
    return null;
  }

  return (
    <section
      className="homepage-section homepage-section--resources"
      aria-labelledby="resources-heading"
    >
      <div className="pbk-container homepage-resources">
        <header className="homepage-resources__header">
          {copy.subheading ? (
            <p className="homepage-resources__eyebrow">{copy.subheading}</p>
          ) : null}
          <h2 id="resources-heading">{copy.heading}</h2>
        </header>
        {primary ? <ResourcePromoPrimary card={primary} /> : null}
        {items.length ? (
          <div className="homepage-resources__grid">
            {items.map((promo) => (
              <ResourcePromoCard key={promo.title} card={promo} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ResourcePromoPrimary({ card }: { card: ResourcePromoModel }) {
  return (
    <article className="homepage-resources__primary">
      <div className="homepage-resources__primaryBody">
        {card.badge ? (
          <p className="homepage-resources__badge">{card.badge}</p>
        ) : null}
        <h3>{card.title}</h3>
        <p>{card.description}</p>
        <Link
          href={card.href}
          className="homepage-resources__primaryCta"
          aria-label={card.ariaLabel}
        >
          {card.ctaLabel}
          {HomepageIconFactory.arrow("homepage-resources__arrow")}
        </Link>
      </div>
      {card.stat ? (
        <p className="homepage-resources__stat">{card.stat}</p>
      ) : null}
    </article>
  );
}

function ResourcePromoCard({ card }: { card: ResourcePromoModel }) {
  return (
    <article className="homepage-resources__card">
      <div className="homepage-resources__iconWrap">
        {HomepageIconFactory.resource(card.icon)}
      </div>
      <div className="homepage-resources__cardBody">
        <h3>{card.title}</h3>
        <p>{card.description}</p>
        <Link
          href={card.href}
          className="homepage-resources__link"
          aria-label={card.ariaLabel}
        >
          {card.ctaLabel}
          {HomepageIconFactory.arrow("homepage-resources__arrow")}
        </Link>
      </div>
    </article>
  );
}
