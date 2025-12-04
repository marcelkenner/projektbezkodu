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

type KlaroReadyResolver = (manager: KlaroManager | null) => void;

declare global {
  interface Window {
    klaro?: {
      setup?: (config: unknown) => void;
      config?: unknown;
      show?: (app?: string, force?: boolean) => void;
      getManager?: () => KlaroManager;
    };
    klaroConfig?: unknown;
    __klaroReady?: Promise<KlaroManager | null>;
    __resolveKlaroReady?: KlaroReadyResolver;
  }
}

function ensureReadyPromise() {
  if (typeof window === "undefined") {
    return;
  }
  if (!window.__klaroReady) {
    window.__klaroReady = new Promise((resolve) => {
      window.__resolveKlaroReady = resolve;
    });
  }
}

export function KlaroConsentManager() {
  useEffect(() => {
    let cancelled = false;

    async function loadKlaro() {
      if (typeof window === "undefined") {
        return;
      }

      ensureReadyPromise();
      window.klaroConfig = klaroConfig as unknown;

      try {
        if (!window.klaro) {
          await import("klaro/dist/klaro-no-css.js");
        }
        if (cancelled) {
          return;
        }
        if (window.klaro?.setup) {
          window.klaro.setup(klaroConfig);
          const manager = window.klaro.getManager?.() ?? null;
          window.__resolveKlaroReady?.(manager);
          window.dispatchEvent(
            new CustomEvent("klaro:ready", { detail: { manager } }),
          );
        }
      } catch (error) {
        console.error("Failed to initialize Klaro", error);
        window.__resolveKlaroReady?.(null);
      }
    }

    void loadKlaro();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
