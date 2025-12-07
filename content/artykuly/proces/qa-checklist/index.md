---
title: QA checklist – treści, linki, wydajność i dostępność
slug: qa-checklist
path: /artykuly/proces/qa-checklist/
type: checklist
tags:
  - evergreen
  - proces
  - qa
draft: true
date: "2025-11-05"
hero:
  heading: QA checklist – treści, linki, wydajność i dostępność
  subheading: Wpis roboczy — uzupełnij krótki opis, żeby nagłówek nie był pusty.
---

# QA checklist – treści, linki, wydajność i dostępność

To jest checklist, z którą możesz przejść cały serwis **przed wdrożeniem**.  
Podzieliłem ją na obszary – możesz wkleić ją do Notion / Excela i odhaczać pole po polu.

---

## 1. Treść i język

- [ ] Na żadnej stronie nie ma **lorem ipsum** ani tekstów testowych.
- [ ] Nagłówki H1–H3 mają sens i **oddają strukturę treści**, nie tylko wygląd.
- [ ] Wszystkie kluczowe CTA są **jasne i konkretne** („Umów konsultację”, „Zacznij trial”), a nie ogólne („Wyślij”, „Dowiedz się więcej”).
- [ ] Copy jest spójne pod względem **tonu** (Ty / Państwo, styl marki).
- [ ] Brak rażących błędów językowych (warto puścić przez kogoś, kto nie widział projektu).
- [ ] Teksty są zweryfikowane pod kątem **zgodności z ofertą** (ceny, zakres, warunki).

---

## 2. Linki i nawigacja

- [ ] Brak linków prowadzących do **404** (sprawdzone np. Screaming Frog / inny crawler). :contentReference[oaicite:2]{index=2}
- [ ] Linki do zewnętrznych serwisów otwierają się tam, gdzie trzeba (nowa karta / ta sama – według świadomej decyzji).
- [ ] Menu główne działa poprawnie na **desktopie i mobile** (rozwijane pozycje, hamburger).
- [ ] Breadcrumby (jeśli są) prawidłowo odzwierciedlają strukturę serwisu.
- [ ] Linki w stopce są aktualne (polityka prywatności, regulamin, social media).

---

## 3. Formularze, koszyki, funkcje krytyczne

- [ ] Wszystkie formularze **wysyłają się poprawnie** i trafiają w odpowiednie miejsce (email, CRM, narzędzie marketing automation).
- [ ] Walidacja pól działa (np. email, pola wymagane) i ma **czytelne komunikaty błędów**.
- [ ] Po poprawnym wysłaniu formularza jest **jasny komunikat sukcesu** i/lub redirect.
- [ ] Jeżeli jest koszyk / checkout:
  - [ ] poprawnie liczy sumę, podatki, rabaty,
  - [ ] obsługuje główne ścieżki płatności,
  - [ ] ma czytelny komunikat w przypadku problemów z płatnością.
- [ ] Logowanie, rejestracja, reset hasła działają w pełnym flow (email, linki resetujące itd.).

---

## 4. Responsywność i UI

- [ ] Kluczowe strony wyglądają dobrze na najpopularniejszych szerokościach (ok. 320–1440 px).
- [ ] Nie ma poziomego scrolla na żadnym z widoków.
- [ ] Elementy klikalne mają wystarczającą **strefę dotyku** na mobile.
- [ ] Zdjęcia i grafiki nie przycinają ważnych części na małych ekranach.
- [ ] Sticky nagłówki / popupy nie zasłaniają treści (szczególnie na mobile).
- [ ] Stany hover/focus są spójne i widoczne, tak samo jak stany „disabled”.

---

## 5. Wydajność i technikalia

- [ ] Test wydajności (np. PageSpeed / Lighthouse) nie pokazuje krytycznych problemów na kluczowych widokach. :contentReference[oaicite:3]{index=3}
- [ ] Obrazy są skompresowane i serwowane w nowoczesnych formatach (WebP/AVIF tam, gdzie ma sens).
- [ ] Jest włączone cache (HTTP headers / CDN) dla statycznych zasobów.
- [ ] Brak blokujących render skryptów / stylów (krytyczny CSS, async/defer).
- [ ] Nie ma jawnych błędów JavaScript w konsoli na kluczowych ścieżkach.
- [ ] Strona działa poprawnie przy wolniejszym łączu (np. throttling w devtools).

---

## 6. SEO i podgląd w social media

- [ ] Każda kluczowa strona ma **unikalny title i meta description**.
- [ ] Jest dokładnie **jeden H1** na stronę.
- [ ] Adresy URL są czytelne i stabilne (`/blog/seo-checklist`, a nie `/?p=123`).
- [ ] Jest sitemap.xml oraz poprawnie skonfigurowany robots.txt.
- [ ] Dla kluczowych stron ustawione są tagi **Open Graph** (tytuł, opis, obrazek).
- [ ] 404 i inne błędy mają sensowne treści i link do strony głównej / ważnych sekcji.

---

## 7. Analityka, tagi, zgody

- [ ] Działa podstawowa analityka (GA4 / inne) – sprawdzone w realnym ruchu.
- [ ] Kluczowe eventy (np. form_submit, checkout_complete) są odpalane dokładnie raz na zdarzenie.
- [ ] Narzędzia marketingowe (Pixel, Ads, MA) są zaimplementowane zgodnie z polityką cookies / RODO.
- [ ] Consent manager prawidłowo **blokuje / odblokowuje** skrypty marketingowe.
- [ ] Istnieje dokument (choćby w Notion), który opisuje **co** jest mierzone i **czemu**.

---

## 8. Dostępność (a11y)

- [ ] Kontrast tekstu i tła spełnia minimum WCAG (AA) dla standardowych rozmiarów fontu. :contentReference[oaicite:4]{index=4}
- [ ] Wszystkie interaktywne elementy są dostępne z klawiatury (Tab, Shift+Tab, Enter, Space).
- [ ] Focus ring jest widoczny i nie znika „dla estetyki”.
- [ ] Obrazki mają sensowne alt teksty (lub puste `alt=""`, jeśli są czysto dekoracyjne).
- [ ] Nagłówki H1–H3 odzwierciedlają hierarchię treści.
- [ ] Formularze mają powiązane labelki z polami (`for` / `id`).

---

## 9. Bezpieczeństwo i prawo

- [ ] Certyfikat SSL jest poprawnie zainstalowany, brak mieszanego contentu HTTP/HTTPS.
- [ ] Brak w kodzie testowych endpointów, kluczy API itp.
- [ ] Polityka prywatności i regulaminy są aktualne i odwołują się do faktycznie używanych narzędzi.
- [ ] Strona ma prosty sposób kontaktu (email, formularz) i dane firmy zgodne ze stanem faktycznym.

---

## Jak z tego korzystać

1. Skopiuj checklist do Notion / arkusza.
2. Dodaj kolumny: **Odpowiedzialny**, **Status**, **Komentarz**, **Data sprawdzenia**.
3. Traktuj to jak „Definition of Done” dla wdrożenia – dopóki najważniejsze punkty nie są na zielono, nie ma launchu.

To nie jest „idealna” lista na każdą sytuację – to **minimum**, które powinno przejść każde wdrożenie, nawet MVP.
