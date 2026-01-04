declare module "klaro/dist/config" {
  export interface KlaroConfig {
    version?: number;
    testing?: boolean;
    elementID?: string;
    styling?: Record<string, unknown>;
    lang?: string;
    htmlTexts?: boolean;
    default?: boolean;
    mustConsent?: boolean;
    acceptAll?: boolean;
    hideDeclineAll?: boolean;
    hideLearnMore?: boolean;
    storageMethod?: string;
    storageName?: string;
    cookieDomain?: string;
    cookieExpiresAfterDays?: number;
    translations?: Record<string, Record<string, unknown>>;
    purposes?: string[];
    services?: Array<Record<string, unknown>>;
  }
  const config: KlaroConfig;
  export default config;
}
declare module "klaro/dist/klaro-no-css.js";
declare module "klaro/dist/klaro-no-translations.js";
declare module "klaro/dist/klaro.min.css";
