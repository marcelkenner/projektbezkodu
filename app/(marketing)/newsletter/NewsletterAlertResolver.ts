import { SearchParamParser } from "@/app/lib/url/SearchParamParser";

type NewsletterAlertVariant = "info" | "success" | "warning" | "danger";

export interface NewsletterAlertModel {
  variant: NewsletterAlertVariant;
  title: string;
  message: string;
}

interface AlertCopyEntry {
  title: string;
  message: string;
}

export interface NewsletterSubscribeAlertsCopy {
  success: AlertCopyEntry;
  invalidEmail: AlertCopyEntry;
  consentRequired: AlertCopyEntry;
  rateLimited: AlertCopyEntry;
  timeout: AlertCopyEntry;
  serviceUnavailable: AlertCopyEntry;
  serviceMisconfigured: AlertCopyEntry;
  listmonkError: AlertCopyEntry;
  unexpected: AlertCopyEntry;
}

export interface NewsletterConfirmAlertsCopy {
  success: AlertCopyEntry;
  resent: AlertCopyEntry;
  missingContext: AlertCopyEntry;
  optinDelayed: AlertCopyEntry;
  rateLimited: AlertCopyEntry;
  timeout: AlertCopyEntry;
  serviceUnavailable: AlertCopyEntry;
  serviceMisconfigured: AlertCopyEntry;
  listmonkError: AlertCopyEntry;
  unexpected: AlertCopyEntry;
}

export interface NewsletterPreferencesAlertsCopy {
  preferencesSaved: AlertCopyEntry;
  missingSubscriber: AlertCopyEntry;
  topicsRequired: AlertCopyEntry;
  rateLimited: AlertCopyEntry;
  timeout: AlertCopyEntry;
  serviceUnavailable: AlertCopyEntry;
  serviceMisconfigured: AlertCopyEntry;
  listmonkError: AlertCopyEntry;
  unexpected: AlertCopyEntry;
}

export interface NewsletterUnsubscribeAlertsCopy {
  unsubscribed: AlertCopyEntry;
  missingSubscriber: AlertCopyEntry;
  rateLimited: AlertCopyEntry;
  timeout: AlertCopyEntry;
  serviceUnavailable: AlertCopyEntry;
  serviceMisconfigured: AlertCopyEntry;
  listmonkError: AlertCopyEntry;
  unexpected: AlertCopyEntry;
}

export class NewsletterAlertResolver {
  constructor(
    private readonly alerts: {
      subscribe: NewsletterSubscribeAlertsCopy;
      confirm: NewsletterConfirmAlertsCopy;
      preferences: NewsletterPreferencesAlertsCopy;
      unsubscribe: NewsletterUnsubscribeAlertsCopy;
    },
  ) {}

  resolveSubscribe(parser: SearchParamParser): NewsletterAlertModel | null {
    const status = parser.getSingle("status");
    const error = parser.getSingle("error");

    if (!status && !error) {
      return null;
    }

    if (status === "success") {
      return { variant: "success", ...this.alerts.subscribe.success };
    }

    switch (error) {
      case "invalid-email":
        return { variant: "warning", ...this.alerts.subscribe.invalidEmail };
      case "consent-required":
        return {
          variant: "warning",
          ...this.alerts.subscribe.consentRequired,
        };
      case "rate-limited":
        return { variant: "warning", ...this.alerts.subscribe.rateLimited };
      case "timeout":
        return { variant: "danger", ...this.alerts.subscribe.timeout };
      case "service-unavailable":
        return {
          variant: "danger",
          ...this.alerts.subscribe.serviceUnavailable,
        };
      case "service-misconfigured":
        return {
          variant: "danger",
          ...this.alerts.subscribe.serviceMisconfigured,
        };
      case "listmonk-error":
        return { variant: "danger", ...this.alerts.subscribe.listmonkError };
      case "unexpected":
        return { variant: "danger", ...this.alerts.subscribe.unexpected };
      default:
        return null;
    }
  }

  resolveConfirm(parser: SearchParamParser): NewsletterAlertModel | null {
    const status = parser.getSingle("status");
    const error = parser.getSingle("error");
    const warning = parser.getSingle("warning");

    if (!status && !error && !warning) {
      return null;
    }

    if (warning === "optin-delayed") {
      return { variant: "warning", ...this.alerts.confirm.optinDelayed };
    }

    if (status === "success") {
      return { variant: "success", ...this.alerts.confirm.success };
    }
    if (status === "resent") {
      return { variant: "success", ...this.alerts.confirm.resent };
    }

    switch (error) {
      case "missing-context":
        return { variant: "warning", ...this.alerts.confirm.missingContext };
      case "rate-limited":
        return { variant: "warning", ...this.alerts.confirm.rateLimited };
      case "timeout":
        return { variant: "danger", ...this.alerts.confirm.timeout };
      case "service-unavailable":
        return {
          variant: "danger",
          ...this.alerts.confirm.serviceUnavailable,
        };
      case "service-misconfigured":
        return {
          variant: "danger",
          ...this.alerts.confirm.serviceMisconfigured,
        };
      case "listmonk-error":
        return { variant: "danger", ...this.alerts.confirm.listmonkError };
      case "unexpected":
        return { variant: "danger", ...this.alerts.confirm.unexpected };
      default:
        return null;
    }
  }

  resolvePreferences(parser: SearchParamParser): NewsletterAlertModel | null {
    const status = parser.getSingle("status");
    const error = parser.getSingle("error");

    if (!status && !error) {
      return null;
    }

    if (status === "preferences-saved") {
      return {
        variant: "success",
        ...this.alerts.preferences.preferencesSaved,
      };
    }

    switch (error) {
      case "missing-subscriber":
        return {
          variant: "warning",
          ...this.alerts.preferences.missingSubscriber,
        };
      case "topics-required":
        return { variant: "warning", ...this.alerts.preferences.topicsRequired };
      case "rate-limited":
        return { variant: "warning", ...this.alerts.preferences.rateLimited };
      case "timeout":
        return { variant: "danger", ...this.alerts.preferences.timeout };
      case "service-unavailable":
        return {
          variant: "danger",
          ...this.alerts.preferences.serviceUnavailable,
        };
      case "service-misconfigured":
        return {
          variant: "danger",
          ...this.alerts.preferences.serviceMisconfigured,
        };
      case "listmonk-error":
        return { variant: "danger", ...this.alerts.preferences.listmonkError };
      case "unexpected":
        return { variant: "danger", ...this.alerts.preferences.unexpected };
      default:
        return null;
    }
  }

  resolveUnsubscribe(parser: SearchParamParser): NewsletterAlertModel | null {
    const status = parser.getSingle("status");
    const error = parser.getSingle("error");

    if (!status && !error) {
      return null;
    }

    if (status === "unsubscribed") {
      return { variant: "success", ...this.alerts.unsubscribe.unsubscribed };
    }

    switch (error) {
      case "missing-subscriber":
        return {
          variant: "warning",
          ...this.alerts.unsubscribe.missingSubscriber,
        };
      case "rate-limited":
        return { variant: "warning", ...this.alerts.unsubscribe.rateLimited };
      case "timeout":
        return { variant: "danger", ...this.alerts.unsubscribe.timeout };
      case "service-unavailable":
        return {
          variant: "danger",
          ...this.alerts.unsubscribe.serviceUnavailable,
        };
      case "service-misconfigured":
        return {
          variant: "danger",
          ...this.alerts.unsubscribe.serviceMisconfigured,
        };
      case "listmonk-error":
        return { variant: "danger", ...this.alerts.unsubscribe.listmonkError };
      case "unexpected":
        return { variant: "danger", ...this.alerts.unsubscribe.unexpected };
      default:
        return null;
    }
  }
}
