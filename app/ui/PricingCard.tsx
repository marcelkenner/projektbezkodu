import { Button } from "./Button";
import "./ui.css";

interface PricingFeature {
  label: string;
  included?: boolean;
}

interface PricingCardProps {
  title: string;
  price: string;
  description?: string;
  features: PricingFeature[];
  ctaLabel: string;
  onSelect?: () => void;
}

export function PricingCard({
  title,
  price,
  description,
  features,
  ctaLabel,
  onSelect,
}: PricingCardProps) {
  return (
    <section className="pbk-pricing-card" aria-label={`Pakiet ${title}`}>
      <div className="pbk-stack pbk-stack--tight">
        <h3>{title}</h3>
        <p className="pbk-pricing-card__price">{price}</p>
        {description ? <p>{description}</p> : null}
      </div>
      <ul className="pbk-stack pbk-stack--tight" role="list">
        {features.map((feature) => (
          <li key={feature.label}>
            {feature.included === false ? "✕" : "✓"} {feature.label}
          </li>
        ))}
      </ul>
      <Button onClick={onSelect}>{ctaLabel}</Button>
    </section>
  );
}
