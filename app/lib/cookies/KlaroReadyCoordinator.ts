import type { KlaroManager, KlaroWindowLike } from "@/app/lib/cookies/KlaroManager";

export class KlaroReadyCoordinator {
  static readonly readyEventName = "klaro:ready";
  static readonly failedEventName = "klaro:failed";

  constructor(private readonly host: KlaroWindowLike) {}

  ensurePromise(): Promise<KlaroManager> {
    if (this.host.__klaroReady) {
      return this.host.__klaroReady;
    }

    this.host.__klaroReadySettled = false;

    this.host.__klaroReady = new Promise<KlaroManager>((resolve, reject) => {
      this.host.__resolveKlaroReady = (manager) => {
        if (this.host.__klaroReadySettled) {
          return;
        }
        this.host.__klaroReadySettled = true;
        resolve(manager);
      };

      this.host.__rejectKlaroReady = (reason) => {
        if (this.host.__klaroReadySettled) {
          return;
        }
        this.host.__klaroReadySettled = true;
        reject(reason);
      };
    });

    return this.host.__klaroReady;
  }

  resolve(manager: KlaroManager) {
    this.ensurePromise();
    const wasSettled = Boolean(this.host.__klaroReadySettled);
    this.host.__resolveKlaroReady?.(manager);
    if (!wasSettled && this.host.__klaroReadySettled) {
      this.host.__resolveKlaroReady = undefined;
      this.host.__rejectKlaroReady = undefined;
      this.dispatch(KlaroReadyCoordinator.readyEventName, { manager });
    }
  }

  reject(reason: unknown) {
    this.ensurePromise();
    const wasSettled = Boolean(this.host.__klaroReadySettled);
    this.host.__rejectKlaroReady?.(reason);
    if (!wasSettled && this.host.__klaroReadySettled) {
      this.host.__resolveKlaroReady = undefined;
      this.host.__rejectKlaroReady = undefined;
      this.dispatch(KlaroReadyCoordinator.failedEventName, { reason });
    }
  }

  private dispatch(name: string, detail: unknown) {
    if (typeof this.host.dispatchEvent !== "function") {
      return;
    }

    const CustomEventConstructor =
      (this.host as unknown as { CustomEvent?: typeof CustomEvent }).CustomEvent ??
      (globalThis as unknown as { CustomEvent?: typeof CustomEvent }).CustomEvent;

    if (typeof CustomEventConstructor !== "function") {
      return;
    }

    this.host.dispatchEvent(new CustomEventConstructor(name, { detail }));
  }
}
