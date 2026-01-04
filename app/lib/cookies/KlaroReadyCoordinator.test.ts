import { describe, expect, it } from "vitest";

import { KlaroReadyCoordinator } from "@/app/lib/cookies/KlaroReadyCoordinator";
import type { KlaroManager, KlaroWindowLike } from "@/app/lib/cookies/KlaroManager";

function buildManager(): KlaroManager {
  return {
    getConsent: () => true,
    updateConsent: () => undefined,
    saveAndApplyConsents: () => undefined,
  };
}

describe("KlaroReadyCoordinator", () => {
  it("resolves window.__klaroReady and dispatches klaro:ready", async () => {
    const dispatched: unknown[] = [];
    const host: KlaroWindowLike = {
      dispatchEvent: (event: Event) => {
        dispatched.push(event);
        return true;
      },
    };

    const previousCustomEvent = (globalThis as unknown as { CustomEvent?: unknown })
      .CustomEvent;

    class FakeCustomEvent {
      type: string;
      detail: unknown;
      constructor(type: string, init?: { detail?: unknown }) {
        this.type = type;
        this.detail = init?.detail;
      }
    }

    (globalThis as unknown as { CustomEvent?: unknown }).CustomEvent = FakeCustomEvent;

    try {
      const coordinator = new KlaroReadyCoordinator(host);
      const manager = buildManager();

      coordinator.ensurePromise();
      coordinator.resolve(manager);

      await expect(host.__klaroReady).resolves.toBe(manager);
      expect(host.__klaroReadySettled).toBe(true);

      const event = dispatched.at(0) as { type?: string; detail?: unknown } | undefined;
      expect(event?.type).toBe(KlaroReadyCoordinator.readyEventName);
      expect(event?.detail).toEqual({ manager });
    } finally {
      (globalThis as unknown as { CustomEvent?: unknown }).CustomEvent = previousCustomEvent;
    }
  });

  it("rejects window.__klaroReady and dispatches klaro:failed", async () => {
    const dispatched: unknown[] = [];
    const host: KlaroWindowLike = {
      dispatchEvent: (event: Event) => {
        dispatched.push(event);
        return true;
      },
    };

    const previousCustomEvent = (globalThis as unknown as { CustomEvent?: unknown })
      .CustomEvent;

    class FakeCustomEvent {
      type: string;
      detail: unknown;
      constructor(type: string, init?: { detail?: unknown }) {
        this.type = type;
        this.detail = init?.detail;
      }
    }

    (globalThis as unknown as { CustomEvent?: unknown }).CustomEvent = FakeCustomEvent;

    try {
      const coordinator = new KlaroReadyCoordinator(host);
      const error = new Error("nope");

      coordinator.ensurePromise();
      coordinator.reject(error);

      await expect(host.__klaroReady).rejects.toBe(error);
      expect(host.__klaroReadySettled).toBe(true);

      const event = dispatched.at(0) as { type?: string; detail?: unknown } | undefined;
      expect(event?.type).toBe(KlaroReadyCoordinator.failedEventName);
      expect(event?.detail).toEqual({ reason: error });
    } finally {
      (globalThis as unknown as { CustomEvent?: unknown }).CustomEvent = previousCustomEvent;
    }
  });
});

