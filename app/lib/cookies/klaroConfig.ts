import type { KlaroConfig } from "klaro/dist/config";

const klaroConfig: KlaroConfig = {
  version: 1,
  elementID: "klaro",
  styling: {
    theme: ["dark", "bottom", "left"],
  },
  lang: "pl",
  htmlTexts: true,
  default: false,
  mustConsent: false,
  acceptAll: true,
  storageMethod: "cookie",
  cookieExpiresAfterDays: 180,
  translations: {
    pl: {
      privacyPolicyUrl: "/polityka-prywatnosci/",
      consentModal: {
        title: "Zarządzaj zgodą",
        description:
          "Wykorzystujemy pliki cookies, aby zapewnić działanie serwisu i mierzyć anonimowo jego wydajność. W każdej chwili możesz zmienić decyzję – kliknij poniżej, aby wybrać kategorie.",
      },
      consentNotice: {
        description:
          "ProjektBezKodu korzysta z niezbędnych cookies oraz – po Twojej zgodzie – z analitycznych i marketingowych. Możesz je zmienić w dowolnym momencie.",
        learnMore: "Ustawienia cookies",
      },
      purposes: {
        necessary: "Niezbędne",
        preferences: "Preferencje",
        analytics: "Analityczne",
        marketing: "Marketingowe",
      },
      ok: "Akceptuję",
      save: "Zapisz preferencje",
      decline: "Odrzuć",
      close: "Zamknij",
      acceptAll: "Akceptuj wszystkie",
    },
  },
  purposes: ["necessary", "preferences", "analytics", "marketing"],
  services: [
    {
      name: "necessary",
      title: "Niezbędne cookies",
      purposes: ["necessary"],
      description:
        "Umożliwiają podstawowe działanie serwisu i zapis Twoich preferencji dotyczących prywatności. Nie możesz ich wyłączyć.",
      default: true,
      required: true,
    },
    {
      name: "preferences",
      title: "Preferencje",
      purposes: ["preferences"],
      description:
        "Zapamiętują dodatkowe ustawienia (np. wybraną wersję językową) i poprawiają wygodę korzystania z serwisu.",
      default: false,
      onlyOnce: false,
    },
    {
      name: "analytics",
      title: "Analityka",
      purposes: ["analytics"],
      description:
        "Pozwalają nam anonimowo mierzyć ruch i ulepszać treści. Dane są agregowane i nie służą identyfikacji konkretnej osoby.",
      default: false,
    },
    {
      name: "marketing",
      title: "Marketing",
      purposes: ["marketing"],
      description:
        "Pomagają dopasować komunikację marketingową, np. wyświetlane kampanie lub wiadomości o nowych materiałach.",
      default: false,
    },
  ],
};

export default klaroConfig;
