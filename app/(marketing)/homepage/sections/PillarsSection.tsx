import Link from "next/link";
import {
  HomepageIconFactory,
  type PillarIconName,
} from "./HomepageIconFactory";
import sectionStyles from "../section-shell.module.css";
import pillarsStyles from "../pillars.module.css";

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
      className={`${sectionStyles["homepage-section"]} ${sectionStyles["homepage-section--pillars"]}`}
      aria-labelledby="pillars-heading"
    >
      <div className="pbk-container">
        <h2 id="pillars-heading">{copy.heading}</h2>
        <div className={pillarsStyles["homepage-pillars__grid"]}>
          {copy.items.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={pillarsStyles["homepage-pillars__card"]}
            >
              {HomepageIconFactory.pillar(
                item.icon,
                pillarsStyles["homepage-pillars__icon"],
              )}
              <div className={pillarsStyles["homepage-pillars__cardBody"]}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className={pillarsStyles["homepage-pillars__cta"]}>
                  Sprawdź
                  {HomepageIconFactory.arrow(
                    pillarsStyles["homepage-pillars__arrow"],
                  )}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
