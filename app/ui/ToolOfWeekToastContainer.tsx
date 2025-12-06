"use client";

import { useState } from "react";
import type { ToolShowcase } from "@/app/lib/toolShowcase";
import { ToolOfWeekToast } from "./ToolOfWeekToast";
import "./ui.css";

interface ToolOfWeekToastContainerProps {
  tool: ToolShowcase;
}

export function ToolOfWeekToastContainer({
  tool,
}: ToolOfWeekToastContainerProps) {
  const [open, setOpen] = useState(true);

  return open ? (
    <ToolOfWeekToast tool={tool} onClose={() => setOpen(false)} />
  ) : (
    <button
      type="button"
      className="pbk-toolweek__mini"
      aria-label={`Otwórz narzędzie tygodnia: ${tool.label}`}
      onClick={() => setOpen(true)}
    >
      <span className="pbk-toolweek__miniEyebrow">Narzędzie tygodnia</span>
      <span className="pbk-toolweek__miniLabel">{tool.label}</span>
    </button>
  );
}
