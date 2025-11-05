import type { InputHTMLAttributes } from "react";
import "./ui.css";

export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  id: string;
  label: string;
  type?: "text" | "email" | "tel" | "url" | "password";
  description?: string;
  error?: string;
}

export function TextField({
  id,
  label,
  type = "text",
  description,
  error,
  className = "",
  ...rest
}: TextFieldProps) {
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
      <input id={id} type={type} className={controlClasses} {...rest} />
      {description && !error ? (
        <p className="pbk-input__description">{description}</p>
      ) : null}
      {error ? <p className="pbk-input__error">{error}</p> : null}
    </div>
  );
}
