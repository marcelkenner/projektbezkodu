import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./ui.css";

type ButtonVariant = "primary" | "secondary" | "tertiary";
type ButtonSize = "default" | "compact";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
}

export function Button({
  children,
  variant = "primary",
  size = "default",
  icon,
  className = "",
  type = "button",
  ...rest
}: ButtonProps) {
  const classes = [
    "pbk-button",
    `pbk-button--${variant}`,
    size === "compact" ? "pbk-button--compact" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} type={type} {...rest}>
      {icon}
      <span>{children}</span>
    </button>
  );
}
