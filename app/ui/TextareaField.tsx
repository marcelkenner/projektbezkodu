import type { TextareaHTMLAttributes } from "react";
import "./ui.css";

export interface TextareaFieldProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
  description?: string;
  error?: string;
}

export function TextareaField({
  id,
  label,
  description,
  error,
  className = "",
  ...rest
}: TextareaFieldProps) {
  const controlClasses = [
    "pbk-input__control",
    error ? "pbk-input__control--error" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="pbk-input">
      <label className="pbk-input__label" htmlFor={id}>
        {label}
      </label>
      <textarea id={id} className={controlClasses} {...rest} />
      {description && !error ? (
        <p className="pbk-input__description">{description}</p>
      ) : null}
      {error ? <p className="pbk-input__error">{error}</p> : null}
    </div>
  );
}
