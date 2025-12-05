import type { ReactNode, FormHTMLAttributes } from "react";
import { FilterBar } from "@/app/ui/FilterBar";
import styles from "./ContentFilterBar.module.css";

type ContentFilterVariant = "articles" | "tutorials" | "tools" | "comparisons";

interface ContentFilterBarProps extends FormHTMLAttributes<HTMLFormElement> {
  variant: ContentFilterVariant;
  legend?: string;
  actions?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

export function ContentFilterBar({
  variant,
  legend,
  actions,
  footer,
  children,
  className = "",
  ...formProps
}: ContentFilterBarProps) {
  const classes = [
    styles.contentFilter,
    styles[`contentFilter--${variant}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <FilterBar
        legend={legend}
        actions={actions}
        footer={footer}
        className=""
        {...formProps}
      >
        {children}
      </FilterBar>
    </div>
  );
}
