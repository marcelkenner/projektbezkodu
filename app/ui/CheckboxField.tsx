import type { InputHTMLAttributes } from "react";
import "./ui.css";

export interface CheckboxFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  id: string;
  label: string;
  descriptionId?: string;
}

export function CheckboxField({
  id,
  label,
  descriptionId,
  className = "",
  ...rest
}: CheckboxFieldProps) {
  return (
    <div className="pbk-input pbk-input--checkbox">
      <label className="pbk-checkbox__label" htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          className={["pbk-checkbox", className].filter(Boolean).join(" ")}
          aria-describedby={descriptionId}
          {...rest}
        />
        <span>{label}</span>
      </label>
    </div>
  );
}
