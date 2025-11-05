import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./ui.css";

type ButtonVariant = "primary" | "secondary" | "tertiary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: ReactNode;
}

export function Button({
  children,
  variant = "primary",
  icon,
  className = "",
  type = "button",
  ...rest
}: ButtonProps) {
  const classes = ["pbk-button", `pbk-button--${variant}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} type={type} {...rest}>
      {icon}
      <span>{children}</span>
    </button>
  );
}
