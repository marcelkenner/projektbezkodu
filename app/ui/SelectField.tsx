import type { SelectHTMLAttributes } from "react";
import "./ui.css";

interface Option {
  value: string;
  label: string;
}

export interface SelectFieldProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  options: Option[];
  description?: string;
  error?: string;
}

export function SelectField({
  id,
  label,
  options,
  description,
  error,
  className = "",
  ...rest
}: SelectFieldProps) {
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
      <select id={id} className={controlClasses} {...rest}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {description && !error ? (
        <p className="pbk-input__description">{description}</p>
      ) : null}
      {error ? <p className="pbk-input__error">{error}</p> : null}
    </div>
  );
}
