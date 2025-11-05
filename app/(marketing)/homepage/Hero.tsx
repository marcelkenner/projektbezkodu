import type { HeroContent } from "../../lib/frontmatter";
import { Badge, Button } from "../../ui";
import { getCopy } from "../../lib/copy";
import "./section.css";

interface HeroProps {
  hero?: HeroContent;
}

export function Hero({ hero }: HeroProps) {
  const homepageCopy = getCopy("homepage");
  const globalCopy = getCopy("global");
  const defaultHero = homepageCopy.hero;

  const heading = hero?.heading ?? defaultHero.heading;
  const subheading = hero?.subheading ?? defaultHero.subheading;
  const primaryCta = hero?.primaryCta ?? globalCopy.ctas.primary;
  const secondaryCta = hero?.secondaryCta ?? globalCopy.ctas.secondary;
  const trustLogos = hero?.trustLogos ?? defaultHero.trustLogos;

  return (
    <section className="hero">
      <div className="pbk-container hero__inner">
        <Badge>{defaultHero.badge}</Badge>
        <div className="pbk-stack pbk-stack--tight">
          <h1>{heading}</h1>
          {subheading ? <p>{subheading}</p> : null}
          <div className="hero__actions">
            <Button variant="primary">{primaryCta}</Button>
            <Button variant="secondary">{secondaryCta}</Button>
          </div>
        </div>
        <div className="hero__trust">
          <p>{defaultHero.trustLine}</p>
          <div className="hero__trust-list">
            {trustLogos.map((logo) => (
              <span key={logo}>{logo}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
