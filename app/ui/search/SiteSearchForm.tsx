import Form from "next/form";
import type { ReactNode } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/app/ui/Button";
import { TextField } from "@/app/ui/TextField";
import "../ui.css";

export interface SiteSearchConfig {
  action: string;
  label: string;
  placeholder: string;
  buttonLabel: string;
}

type SiteSearchFormVariant = "compact" | "panel";

interface SiteSearchFormProps {
  config: SiteSearchConfig;
  inputId: string;
  query?: string;
  variant?: SiteSearchFormVariant;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
  required?: boolean;
  minLength?: number;
  children?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
}

export function SiteSearchForm({
  config,
  inputId,
  query = "",
  variant = "compact",
  className = "",
  inputClassName = "",
  buttonClassName = "",
  required = false,
  minLength,
  children,
  actions,
  footer,
}: SiteSearchFormProps) {
  if (variant === "compact") {
    return (
      <Form
        className={className}
        action={config.action}
        role="search"
        aria-label={config.label}
      >
        <label htmlFor={inputId} className="sr-only">
          {config.label}
        </label>
        <input
          id={inputId}
          name="q"
          type="search"
          required={required}
          minLength={minLength}
          placeholder={config.placeholder}
          autoComplete="off"
          defaultValue={query}
          className={inputClassName}
        />
        <button type="submit" className={buttonClassName} aria-label={config.buttonLabel}>
          <MagnifyingGlass aria-hidden="true" size={20} weight="bold" />
          <span className="sr-only">{config.buttonLabel}</span>
        </button>
      </Form>
    );
  }

  const formClasses = ["site-search-form", className].filter(Boolean).join(" ");

  return (
    <Form
      className={formClasses}
      action={config.action}
      role="search"
      aria-label={config.label}
    >
      <div className="site-search-form__fields">
        <TextField
          id={inputId}
          name="q"
          type="search"
          label={config.label}
          placeholder={config.placeholder}
          autoComplete="off"
          defaultValue={query}
          required={required}
          minLength={minLength}
        />
        {children}
      </div>
      <div className="site-search-form__actions">
        <Button type="submit" className={buttonClassName}>
          {config.buttonLabel}
        </Button>
        {actions}
      </div>
      {footer ? <div className="site-search-form__footer">{footer}</div> : null}
    </Form>
  );
}
