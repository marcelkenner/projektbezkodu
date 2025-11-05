'use client';

import { useState } from "react";
import type { ToolShowcase } from "@/app/lib/toolShowcase";
import { ToolOfWeekToast } from "./ToolOfWeekToast";
import "./ui.css";

interface ToolOfWeekToastContainerProps {
  tool: ToolShowcase;
}

export function ToolOfWeekToastContainer({ tool }: ToolOfWeekToastContainerProps) {
  const [open, setOpen] = useState(true);

  return open ? (
    <ToolOfWeekToast tool={tool} onClose={() => setOpen(false)} />
  ) : (
    <button
      type="button"
      className="pbk-floating-toast__mini"
      onClick={() => setOpen(true)}
    >
      Narzędzie tygodnia
    </button>
  );
}
