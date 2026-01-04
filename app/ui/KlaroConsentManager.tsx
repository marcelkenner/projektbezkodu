"use client";

import { useEffect } from "react";
import type { KlaroManager } from "@/app/lib/cookies/KlaroManager";
import { KlaroBootstrapManager } from "@/app/lib/cookies/KlaroBootstrapManager";
import klaroConfig from "@/app/lib/cookies/klaroConfig";
import "klaro/dist/klaro.min.css";

declare global {
  interface Window {
    klaro?: {
      setup?: (config: unknown) => void;
      config?: unknown;
      show?: (app?: string, force?: boolean) => void;
      getManager?: () => KlaroManager;
    };
    klaroConfig?: unknown;
    __klaroReady?: Promise<KlaroManager>;
    __resolveKlaroReady?: (manager: KlaroManager) => void;
    __rejectKlaroReady?: (reason?: unknown) => void;
    __klaroReadySettled?: boolean;
  }
}

export function KlaroConsentManager() {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const abortController = new AbortController();

    const bootstrap = new KlaroBootstrapManager({
      host: window,
      config: klaroConfig,
      importKlaro: async () => {
        if (window.klaro) {
          return;
        }
        try {
          await import("klaro/dist/klaro-no-css.js");
        } catch {
          await import("klaro/dist/klaro.js");
        }
      },
    });

    void bootstrap.start({ signal: abortController.signal }).catch(() => undefined);

    return () => abortController.abort();
  }, []);

  return null;
}
