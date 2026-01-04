export interface KlaroManager {
  getConsent: (name: string) => boolean | null;
  updateConsent: (name: string, value: boolean) => void;
  saveAndApplyConsents: () => void;
  applyConsents?: (value: boolean) => void;
}

export interface KlaroGlobalApi {
  setup?: (config: unknown) => void;
  config?: unknown;
  show?: (app?: string, force?: boolean) => void;
  getManager?: () => KlaroManager;
}

export interface KlaroWindowLike {
  klaro?: KlaroGlobalApi;
  klaroConfig?: unknown;
  __klaroReady?: Promise<KlaroManager>;
  __resolveKlaroReady?: (manager: KlaroManager) => void;
  __rejectKlaroReady?: (reason?: unknown) => void;
  __klaroReadySettled?: boolean;
  dispatchEvent?: (event: Event) => boolean;
}

