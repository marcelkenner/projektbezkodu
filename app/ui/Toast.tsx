import type { ReactNode } from "react";
import "./ui.css";

type ToastVariant = "info" | "success" | "warning" | "danger";

interface ToastProps {
  variant?: ToastVariant;
  message: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export function Toast({
  variant = "info",
  message,
  actionLabel,
  onAction,
}: ToastProps) {
  return (
    <div className={`pbk-toast pbk-alert--${variant}`} role="status">
      <div>{message}</div>
      {actionLabel ? (
        <button
          type="button"
          className="pbk-button pbk-button--tertiary"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
