import type { ReactNode } from "react";
import "./ui.css";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}

export function Modal({ open, onClose, title, children, actions }: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="pbk-modal"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="pbk-modal__panel">
        <div className="pbk-stack pbk-stack--tight">
          <h3>{title}</h3>
          <div>{children}</div>
          <div className="pbk-modal__actions">
            {actions ?? (
              <button
                type="button"
                className="pbk-button pbk-button--tertiary"
                onClick={onClose}
              >
                Zamknij
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
