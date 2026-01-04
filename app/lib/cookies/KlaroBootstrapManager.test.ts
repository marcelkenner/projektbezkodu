import { describe, expect, it } from "vitest";

import { KlaroBootstrapManager } from "@/app/lib/cookies/KlaroBootstrapManager";
import type { KlaroManager, KlaroWindowLike } from "@/app/lib/cookies/KlaroManager";

function buildManager(): KlaroManager {
  return {
    getConsent: () => true,
    updateConsent: () => undefined,
    saveAndApplyConsents: () => undefined,
  };
}

describe("KlaroBootstrapManager", () => {
  it("returns immediately when a manager is already available", async () => {
    const manager = buildManager();
    const host: KlaroWindowLike = {
      klaro: {
        getManager: () => manager,
      },
    };
    let importerCalls = 0;

    const bootstrap = new KlaroBootstrapManager({
      host,
      config: { elementID: "klaro" },
      importKlaro: async () => {
        importerCalls += 1;
      },
    });

    await expect(bootstrap.start()).resolves.toBe(manager);
    expect(importerCalls).toBe(0);
    await expect(host.__klaroReady).resolves.toBe(manager);
  });

  it("imports Klaro and resolves when setup provides a manager", async () => {
    const manager = buildManager();
    const host: KlaroWindowLike = {};
    let setupConfig: unknown = null;
    let importerCalls = 0;

    const bootstrap = new KlaroBootstrapManager({
      host,
      config: { elementID: "klaro", storageName: "test" },
      importKlaro: async () => {
        importerCalls += 1;
        host.klaro = {
          setup: (config) => {
            setupConfig = config;
          },
          getManager: () => manager,
        };
      },
    });

    await expect(bootstrap.start()).resolves.toBe(manager);
    expect(importerCalls).toBe(1);
    expect(setupConfig).toEqual({ elementID: "klaro", storageName: "test" });
    await expect(host.__klaroReady).resolves.toBe(manager);
  });

  it("rejects when Klaro fails to load or initialize", async () => {
    const host: KlaroWindowLike = {};
    const error = new Error("load failed");

    const bootstrap = new KlaroBootstrapManager({
      host,
      config: { elementID: "klaro" },
      importKlaro: async () => {
        throw error;
      },
      logger: { error: () => undefined },
    });

    await expect(bootstrap.start()).rejects.toBe(error);
    await expect(host.__klaroReady).rejects.toBe(error);
  });

  it("rejects when aborted before starting", async () => {
    const host: KlaroWindowLike = {};
    const controller = new AbortController();
    controller.abort();

    const bootstrap = new KlaroBootstrapManager({
      host,
      config: { elementID: "klaro" },
      importKlaro: async () => undefined,
      logger: { error: () => undefined },
    });

    await expect(bootstrap.start({ signal: controller.signal })).rejects.toThrow(
      "aborted",
    );
    await expect(host.__klaroReady).rejects.toThrow("aborted");
  });
});

