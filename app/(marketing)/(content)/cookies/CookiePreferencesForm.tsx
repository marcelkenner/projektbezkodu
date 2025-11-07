"use client";

import { useEffect, useMemo, useState } from "react";
import type { KlaroManager } from "@/app/ui/KlaroConsentManager";

type ConsentKeys = "preferences" | "analytics" | "marketing";

interface CookiePreferencesFormProps {
  labels: Record<
    ConsentKeys | "necessary",
    { label: string; description: string }
  >;
  intro: string;
  actions: {
    save: string;
    acceptAll: string;
    statusSaved: string;
    statusError: string;
  };
  privacyLink: { label: string; href: string };
}

export function CookiePreferencesForm({
  labels,
  intro,
  actions,
  privacyLink,
}: CookiePreferencesFormProps) {
  const [manager, setManager] = useState<KlaroManager | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [consents, setConsents] = useState<Record<ConsentKeys, boolean>>({
    preferences: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    let cancelled = false;
    let timeout: number | null = null;

    const init = () => {
      if (typeof window === "undefined") {
        return;
      }
      const instance = window.klaro?.getManager?.();
      if (instance) {
        if (cancelled) {
          return;
        }
        setManager(instance);
        setConsents({
          preferences: Boolean(instance.getConsent("preferences")),
          analytics: Boolean(instance.getConsent("analytics")),
          marketing: Boolean(instance.getConsent("marketing")),
        });
        setLoading(false);
        return;
      }
      timeout = window.setTimeout(init, 200);
    };

    init();

    return () => {
      cancelled = true;
      if (timeout) {
        window.clearTimeout(timeout);
      }
    };
  }, []);

  const switches = useMemo(
    () => [
      {
        key: "necessary" as const,
        label: labels.necessary.label,
        description: labels.necessary.description,
        value: true,
        disabled: true,
      },
      {
        key: "preferences" as const,
        label: labels.preferences.label,
        description: labels.preferences.description,
        value: consents.preferences,
        disabled: false,
      },
      {
        key: "analytics" as const,
        label: labels.analytics.label,
        description: labels.analytics.description,
        value: consents.analytics,
        disabled: false,
      },
      {
        key: "marketing" as const,
        label: labels.marketing.label,
        description: labels.marketing.description,
        value: consents.marketing,
        disabled: false,
      },
    ],
    [labels, consents],
  );

  const handleToggle = (key: ConsentKeys, value: boolean) => {
    setConsents((prev) => ({ ...prev, [key]: value }));
    setStatus(null);
  };

  const handleSave = () => {
    if (!manager) {
      return;
    }
    try {
      (Object.keys(consents) as ConsentKeys[]).forEach((key) => {
        manager.updateConsent(key, consents[key]);
      });
      manager.saveAndApplyConsents();
      setStatus(actions.statusSaved);
    } catch (error) {
      console.error("Failed to save consents", error);
      setStatus(actions.statusError);
    }
  };

  const handleAcceptAll = () => {
    if (!manager) {
      return;
    }
    try {
      if (manager.applyConsents) {
        manager.applyConsents(true);
        manager.saveAndApplyConsents();
      } else {
        (Object.keys(consents) as ConsentKeys[]).forEach((key) => {
          manager.updateConsent(key, true);
        });
        manager.saveAndApplyConsents();
      }
      setConsents({ preferences: true, analytics: true, marketing: true });
      setStatus(actions.statusSaved);
    } catch (error) {
      console.error("Failed to accept all consents", error);
      setStatus(actions.statusError);
    }
  };

  return (
    <form
      className="cookies-panel"
      role="form"
      aria-describedby="cookies-desc"
      onSubmit={(event) => {
        event.preventDefault();
        handleSave();
      }}
    >
      <p id="cookies-desc" className="cookies-panel__intro">
        {intro}
      </p>
      <div className="cookies-panel__group">
        {switches.map((item) => (
          <div key={item.key} className="cookies-switch">
            <div>
              <p className="cookies-switch__label">{item.label}</p>
              <p className="cookies-switch__description">{item.description}</p>
            </div>
            <div className="cookies-switch__control">
              <input
                type="checkbox"
                id={`cookie-${item.key}`}
                checked={item.value}
                onChange={(event) => {
                  if (item.key === "necessary") {
                    return;
                  }
                  handleToggle(item.key, event.target.checked);
                }}
                disabled={item.disabled || loading}
                aria-disabled={item.disabled}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="cookies-panel__actions">
        <button
          type="submit"
          className="pbk-button pbk-button--primary"
          disabled={loading}
        >
          {actions.save}
        </button>
        <button
          type="button"
          className="pbk-button pbk-button--secondary"
          onClick={handleAcceptAll}
          disabled={loading}
        >
          {actions.acceptAll}
        </button>
      </div>
      <p className="cookies-panel__link">
        <a href={privacyLink.href}>{privacyLink.label}</a>
      </p>
      <div className="cookies-panel__status" aria-live="polite">
        {status}
      </div>
      <button
        type="button"
        className="cookies-panel__openModal"
        onClick={() => window.klaro?.show?.(undefined, true)}
      >
        Otwórz pełny panel Klaro
      </button>
    </form>
  );
}
