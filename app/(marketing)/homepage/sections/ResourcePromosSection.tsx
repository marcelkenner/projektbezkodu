import Link from "next/link";
import {
  HomepageIconFactory,
  type ResourcePromoIconName,
} from "./HomepageIconFactory";
import sectionStyles from "../section-shell.module.css";
import resourceStyles from "../resource-section.module.css";

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
      className={`${sectionStyles["homepage-section"]} ${resourceStyles["homepage-section--resources"]}`}
      aria-labelledby="resources-heading"
    >
      <div className={`pbk-container ${resourceStyles["homepage-resources"]}`}>
        <header className={resourceStyles["homepage-resources__header"]}>
          {copy.subheading ? (
            <p className={resourceStyles["homepage-resources__eyebrow"]}>
              {copy.subheading}
            </p>
          ) : null}
          <h2 id="resources-heading">{copy.heading}</h2>
        </header>
        {primary ? <ResourcePromoPrimary card={primary} /> : null}
        {items.length ? (
          <div className={resourceStyles["homepage-resources__grid"]}>
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
    <article className={resourceStyles["homepage-resources__primary"]}>
      <div className={resourceStyles["homepage-resources__primaryBody"]}>
        {card.badge ? (
          <p className={resourceStyles["homepage-resources__badge"]}>
            {card.badge}
          </p>
        ) : null}
        <h3>{card.title}</h3>
        <p>{card.description}</p>
        <Link
          href={card.href}
          className={resourceStyles["homepage-resources__primaryCta"]}
          aria-label={card.ariaLabel}
        >
          {card.ctaLabel}
          {HomepageIconFactory.arrow(
            resourceStyles["homepage-resources__arrow"],
          )}
        </Link>
      </div>
      {card.stat ? (
        <p className={resourceStyles["homepage-resources__stat"]}>
          {card.stat}
        </p>
      ) : null}
    </article>
  );
}

function ResourcePromoCard({ card }: { card: ResourcePromoModel }) {
  return (
    <article className={resourceStyles["homepage-resources__card"]}>
      <div className={resourceStyles["homepage-resources__iconWrap"]}>
        {HomepageIconFactory.resource(
          card.icon,
          resourceStyles["homepage-resources__icon"],
        )}
      </div>
      <div className={resourceStyles["homepage-resources__cardBody"]}>
        <h3>{card.title}</h3>
        <p>{card.description}</p>
        <Link
          href={card.href}
          className={resourceStyles["homepage-resources__link"]}
          aria-label={card.ariaLabel}
        >
          {card.ctaLabel}
          {HomepageIconFactory.arrow(
            resourceStyles["homepage-resources__arrow"],
          )}
        </Link>
      </div>
    </article>
  );
}
