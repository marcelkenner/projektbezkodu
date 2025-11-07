import Image from "next/image";
import Link from "next/link";
import type { ToolShowcase } from "@/app/lib/toolShowcase";
import "./ui.css";

interface ToolOfWeekToastProps {
  tool: ToolShowcase;
  onClose?: () => void;
}

export function ToolOfWeekToast({ tool, onClose }: ToolOfWeekToastProps) {
  return (
    <aside className="pbk-floating-toast pbk-card" aria-live="polite">
      <button
        type="button"
        className="pbk-floating-toast__close"
        aria-label="Zamknij"
        onClick={onClose}
      >
        ×
      </button>
      <div className="pbk-floating-toast__header">
        <span className="pbk-floating-toast__eyebrow">Narzędzie tygodnia</span>
        <h3>{tool.label}</h3>
      </div>
      <div className="pbk-floating-toast__body">
        <div className="pbk-floating-toast__image">
          <Image src={tool.image} alt={tool.label} width={45} height={45} />
        </div>
        <p>{tool.description}</p>
      </div>
      <div className="pbk-floating-toast__actions">
        <Link
          className="pbk-button pbk-button--primary"
          href={tool.affiliateUrl}
        >
          Sprawdź narzędzie
        </Link>
        <Link
          className="pbk-button pbk-button--tertiary"
          href={tool.readMorePath}
        >
          Czytaj więcej
        </Link>
      </div>
      <p className="pbk-floating-toast__disclosure">
        Link partnerski – korzystając, wspierasz nowe poradniki bez dodatkowych
        kosztów.
      </p>
    </aside>
  );
}
