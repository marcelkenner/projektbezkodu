import type { ReactNode } from "react";
import "./ui.css";

type AlertVariant = "info" | "success" | "warning" | "danger";

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
}

export function Alert({ variant = "info", title, children }: AlertProps) {
  return (
    <div
      className={`pbk-alert pbk-alert--${variant}`}
      role="status"
      aria-live="polite"
    >
      <div>
        {title ? <span className="pbk-alert__title">{title}</span> : null}
        <div>{children}</div>
      </div>
    </div>
  );
}
