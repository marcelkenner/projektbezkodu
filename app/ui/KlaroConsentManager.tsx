"use client";

import { useEffect } from "react";
import klaroConfig from "@/app/lib/cookies/klaroConfig";
import "klaro/dist/klaro.min.css";

export interface KlaroManager {
  getConsent: (name: string) => boolean | null;
  updateConsent: (name: string, value: boolean) => void;
  saveAndApplyConsents: () => void;
  applyConsents?: (value: boolean) => void;
}

declare global {
  interface Window {
    klaro?: {
      setup?: (config: unknown) => void;
      config?: unknown;
      show?: (app?: string, force?: boolean) => void;
      getManager?: () => KlaroManager;
    };
    klaroConfig?: unknown;
  }
}

export function KlaroConsentManager() {
  useEffect(() => {
    let active = true;

    async function loadKlaro() {
      if (typeof window === "undefined") {
        return;
      }

      window.klaroConfig = klaroConfig as unknown;

      await import("klaro/dist/klaro-no-css.js");
      if (!active) {
        return;
      }
      if (window.klaro?.setup) {
        window.klaro.setup(klaroConfig);
      }
    }

    void loadKlaro();

    return () => {
      active = false;
    };
  }, []);

  return null;
}
