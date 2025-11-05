import type { ReactNode } from "react";
import "./ui.css";

interface CardProps {
  title: string;
  eyebrow?: string;
  meta?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function Card({ title, eyebrow, meta, actions, children }: CardProps) {
  return (
    <article className="pbk-card">
      {eyebrow ? (
        <span className="pbk-badge pbk-badge--accent">{eyebrow}</span>
      ) : null}
      <div className="pbk-stack pbk-stack--tight">
        <h3 className="pbk-card__title">{title}</h3>
        {meta ? <p className="pbk-card__meta">{meta}</p> : null}
        <div>{children}</div>
      </div>
      {actions ? <div>{actions}</div> : null}
    </article>
  );
}
