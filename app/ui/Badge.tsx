import type { ReactNode } from "react";
import "./ui.css";

type BadgeVariant = "accent" | "neutral";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

export function Badge({
  variant = "accent",
  children,
  className = "",
}: BadgeProps) {
  const classes = ["pbk-badge", `pbk-badge--${variant}`, className]
    .filter(Boolean)
    .join(" ");
  return <span className={classes}>{children}</span>;
}
