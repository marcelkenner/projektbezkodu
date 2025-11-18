import type { FormHTMLAttributes, ReactNode } from "react";

interface FilterBarProps extends FormHTMLAttributes<HTMLFormElement> {
  legend?: string;
  actions?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

export function FilterBar({
  legend,
  actions,
  footer,
  children,
  className = "",
  ...formProps
}: FilterBarProps) {
  const classes = ["pbk-filterBar", className].filter(Boolean).join(" ");
  return (
    <form className={classes} {...formProps}>
      {legend ? <p className="pbk-filterBar__legend">{legend}</p> : null}
      <div className="pbk-filterBar__fields">{children}</div>
      {actions ? <div className="pbk-filterBar__actions">{actions}</div> : null}
      {footer ? <div className="pbk-filterBar__footer">{footer}</div> : null}
    </form>
  );
}
