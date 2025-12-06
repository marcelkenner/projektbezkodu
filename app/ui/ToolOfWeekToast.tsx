import Link from "next/link";
import type { ToolShowcase } from "@/app/lib/toolShowcase";
import { Sparkle, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import "./ui.css";

interface ToolOfWeekToastProps {
  tool: ToolShowcase;
  onClose?: () => void;
}

export function ToolOfWeekToast({ tool, onClose }: ToolOfWeekToastProps) {
  return (
    <aside className="pbk-toolweek" aria-live="polite">
      <button
        type="button"
        className="pbk-toolweek__close"
        aria-label="Zamknij"
        onClick={onClose}
      >
        ×
      </button>
      <div className="pbk-toolweek__header">
        <span className="pbk-toolweek__eyebrow">
          <Sparkle aria-hidden="true" weight="fill" /> Narzędzie tygodnia
        </span>
        <h3>{tool.label}</h3>
      </div>
      <p className="pbk-toolweek__description">{tool.description}</p>
      <div className="pbk-toolweek__actions">
        <Link
          className="pbk-button pbk-button--primary pbk-button--iconTrailing"
          href={tool.affiliateUrl}
        >
          Sprawdź narzędzie
          <ArrowUpRight weight="bold" aria-hidden="true" />
        </Link>
        <Link
          className="pbk-button pbk-button--tertiary pbk-button--iconTrailing"
          href={tool.readMorePath}
        >
          Czytaj więcej
          <ArrowUpRight weight="bold" aria-hidden="true" />
        </Link>
      </div>
      <p className="pbk-toolweek__disclosure">
        Link partnerski – korzystając, wspierasz nowe poradniki bez dodatkowych
        kosztów.
      </p>
    </aside>
  );
}
