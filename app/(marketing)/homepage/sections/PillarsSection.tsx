import Link from "next/link";
import {
  HomepageIconFactory,
  type PillarIconName,
} from "./HomepageIconFactory";

export interface PillarItem {
  title: string;
  description: string;
  href: string;
  icon: PillarIconName;
}

export interface PillarsCopy {
  heading: string;
  items: PillarItem[];
}

export function PillarsSection({ copy }: { copy: PillarsCopy }) {
  if (!copy.items.length) {
    return null;
  }

  return (
    <section
      className="homepage-section homepage-section--pillars"
      aria-labelledby="pillars-heading"
    >
      <div className="pbk-container">
        <h2 id="pillars-heading">{copy.heading}</h2>
        <div className="homepage-pillars__grid">
          {copy.items.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="homepage-pillars__card"
            >
              {HomepageIconFactory.pillar(item.icon)}
              <div className="homepage-pillars__cardBody">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className="homepage-pillars__cta">
                  Sprawdź
                  {HomepageIconFactory.arrow()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
