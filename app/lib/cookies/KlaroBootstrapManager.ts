import type { KlaroManager, KlaroWindowLike } from "@/app/lib/cookies/KlaroManager";
import { KlaroReadyCoordinator } from "@/app/lib/cookies/KlaroReadyCoordinator";

export type KlaroImporter = () => Promise<void>;

export class KlaroBootstrapManager {
  private readonly readyCoordinator: KlaroReadyCoordinator;
  private readonly logger: Pick<Console, "error">;

  constructor(
    private readonly deps: {
      host: KlaroWindowLike;
      config: unknown;
      importKlaro: KlaroImporter;
      logger?: Pick<Console, "error">;
    },
  ) {
    this.readyCoordinator = new KlaroReadyCoordinator(deps.host);
    this.logger = deps.logger ?? console;
  }

  async start({ signal }: { signal?: AbortSignal } = {}): Promise<KlaroManager> {
    this.readyCoordinator.ensurePromise();

    if (signal?.aborted) {
      const error = new Error("Klaro initialization aborted.");
      this.readyCoordinator.reject(error);
      throw error;
    }

    const existingManager = this.deps.host.klaro?.getManager?.();
    if (existingManager) {
      this.readyCoordinator.resolve(existingManager);
      return existingManager;
    }

    this.deps.host.klaroConfig = this.deps.config;

    try {
      await this.deps.importKlaro();

      if (signal?.aborted) {
        const error = new Error("Klaro initialization aborted.");
        this.readyCoordinator.reject(error);
        throw error;
      }

      const api = this.deps.host.klaro;
      if (!api?.setup) {
        throw new Error("Klaro loaded but window.klaro.setup is unavailable.");
      }

      api.setup(this.deps.config);

      const manager = api.getManager?.();
      if (!manager) {
        throw new Error("Klaro setup completed but manager is unavailable.");
      }

      this.readyCoordinator.resolve(manager);
      return manager;
    } catch (error) {
      this.logger.error("Failed to initialize Klaro", error);
      this.readyCoordinator.reject(error);
      throw error;
    }
  }
}

