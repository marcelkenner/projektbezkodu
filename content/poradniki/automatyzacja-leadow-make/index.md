---
title: "Automatyzacja leadów w Make"
slug: "automatyzacja-leadow-make"
path: "/poradniki/automatyzacja-leadow-make/"
draft: false
template: "tutorial"
hero:
  heading: "Automatyzacja leadów w Make"
  subheading: "Od formularza po CRM – prosty scenariusz w Make.com."
seo:
  title: "Automatyzacja leadów w Make"
  description: "Instrukcja tworzenia scenariusza Make do zbierania i kwalifikacji leadów ze strony no-code."
  keywords:
    - make
    - automatyzacja
    - tutorial
meta:
  difficulty: "Zaawansowany"
  duration: "3 godziny"
  tools:
    - make
    - mailerlite
taxonomy:
  categories:
    - automation
  tags:
    - make
    - lead-generation
---

## Cel scenariusza

Zbudujesz automatyzację, która:

- Zbiera leady z formularza (Webflow/Typeform).
- Wzbogaca dane o firmę i stanowisko (Clearbit/Algolia).
- Wysyła lead do CRM (HubSpot/Pipedrive) i marketing automation (MailerLite).
- Powiadamia sprzedaż na Slacku i tworzy zadanie follow-up.

## Architektura scenariusza w Make

1. **Webhook** – przyjmuje dane z formularza. Zaplanuj strukturę JSON (imie, e-mail, źródło, kampania).
2. **Enrichment** – moduł HTTP/Clearbit, fallback do manualnego przypisania branży.
3. **Routing** – na podstawie pola `budget` kierujemy lead do nurtu A lub B.
4. **CRM** – HubSpot Create/Update Contact + Deal, Pipedrive/Notion zależnie od firmy.
5. **Powiadomienia** – Slack/Email + log w Airtable.

## Konfiguracja krok po kroku

### Webhook i walidacja

- Utwórz webhook „Catch hook” w Make, skopiuj URL do formularza.
- Dodaj moduł `Iterator`, aby obsłużyć pola wielokrotne (np. zainteresowane produkty).
- Wprowadź walidację – jeśli `email` kończy się na domenie disposable, wyślij do nurtu nurturing.

### Wzbogacanie danych

- Clearbit: endpoint `Person + Company`, fallback `domain lookup`.
- Jeśli API zwróci status 404, ustaw `companySize = unknown`.
- Zapisz enrichment w Airtable (tabela `lead_enrichment`) – łatwiej debugować.

### CRM i marketing

- HubSpot: upsert kontaktu, utwórz deal z pipeline „Marketing Qualified”.
- MailerLite: dodaj kontakt do grupy `no-code-pl`, ustaw custom fields (persona, kampania).
- Slack: wiadomość do kanału `#leads` z przyciskiem „Przypisz sobie” (Slack shortcut).

## Testowanie scenariusza

- Użyj trybu `Run once` – prześlij testowy lead i sprawdź logi każdego modułu.
- Dodaj moduł `Error handler` → `Notify admin` – otrzymasz e-mail, gdy scenariusz się wysypie.
- Włącz `Data store` w Make – przechowasz leady offline, gdy CRM nie odpowie.

## Utrzymanie

- Dokumentuj wersje – w komentarzu scenariusza wpisz changelog.
- Monitoruj liczbę operacji Make – ustaw alert na 80% limitu.
- Raz w miesiącu przetestuj fallback (CRM offline) – upewnij się, że ledy trafiają do bufora.

## Co dalej

- Dodaj scoring leadów (np. +5 za branżę SaaS, +3 za budżet > 5k).
- Wykorzystaj scenariusz do zasilania kampanii remarketingowej – listy w Meta/LinkedIn.
- Zintegruj z offline fallback (`/offline`) – leady są zapisywane i wysyłane po powrocie sieci.
