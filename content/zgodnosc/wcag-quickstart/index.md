---
title: WCAG quickstart – 30-punktowa checklista
slug: wcag-quickstart
path: /zgodnosc/wcag-quickstart/
type: checklist
tags:
  - evergreen
  - zgodnosc
  - wcag
draft: true
date: '2025-11-05'
---

# WCAG quickstart: 30-punktowa checklista dla małych zespołów

> To jest skrócona, praktyczna checklista pod WCAG 2.1/2.2 na poziomie AA – pod realne strony firmowe, SaaS i kursy, a nie pod audyty korporacyjne.  
> **Uwaga:** to nie jest porada prawna, tylko pomoc w pracy z projektami.

WCAG 2.2 jest aktualną wersją wytycznych dostępności. Buduje na WCAG 2.1, zachowuje kompatybilność wsteczną i dodaje 9 nowych kryteriów (m.in. dot. focusu, target size, drag&drop, pomocy w procesach i logowania).:contentReference[oaicite:0]{index=0}  
Najczęściej celem jest poziom **AA** – właśnie tego poziomu dotyczy poniższa lista.:contentReference[oaicite:1]{index=1}

---

## Jak używać tej checklisty

- traktuj to jako **minimum** – jeśli coś jest „na granicy”, projektuj odrobinę lepiej niż wymaga standard;
- checklistę możesz przejść:
  - przy projektowaniu (Figma),
  - przy implementacji (review frontu),
  - przy odbiorze projektu (QA z klientem).

---

## 30 punktów WCAG 2.x dla SME

### A. Struktura i treść

1. **Logiczne nagłówki (H1–H6)**  
   Na stronie jest jeden H1, niższe nagłówki nie przeskakują „dziurami” (H2 → H3 → H4), a nagłówki nie są używane tylko „bo ładne”. To wspiera kryteria nawigacji po strukturze.:contentReference[oaicite:2]{index=2}

2. **Ustawiony język strony i fragmentów**  
   Atrybut `lang` na `<html>` (np. `lang="pl"`) jest ustawiony. Jeśli w tekście są większe fragmenty w innym języku (np. stałe CTA po angielsku), używasz `lang="en"` na tych elementach.:contentReference[oaicite:3]{index=3}

3. **Alt-texty dla obrazków**
   - obrazy istotne (schematy, zdjęcia produktowe) mają sensowny `alt`,
   - obrazy czysto dekoracyjne mają `alt=""` albo są w CSS.  
     To realizuje 1.1.1 – tekst alternatywny.:contentReference[oaicite:4]{index=4}

4. **Brak ważnego tekstu „wypalonego” w grafice**  
   Nagłówki, kluczowe hasła, CTA są tekstem HTML, a nie tekstem w PNG/JPG/SVG (wyjątki: logo, print-ready grafiki). Zmniejsza to problemy z 1.4.5 Images of text.:contentReference[oaicite:5]{index=5}

5. **Link mówi, dokąd prowadzi**  
   Zamiast „kliknij tutaj” stosujesz np. „Zobacz cennik” lub „Pobierz PDF z ofertą”. To spełnia 2.4.4 / 2.4.9 (link purpose).:contentReference[oaicite:6]{index=6}

6. **Tabele tylko do danych i z nagłówkami**  
   Jeśli używasz tabel, to do danych (nie do layoutu) i:
   - nagłówki w `<th>`,
   - poprawnie ustawione `scope="col"` / `scope="row"`.:contentReference[oaicite:7]{index=7}

7. **Formularze mają etykiety, nie tylko placeholdery**  
   Każde pole ma `<label for="">` połączone z `id` pola. Placeholder może być dodatkiem, ale nie jedynym opisem. To wspiera 1.3.1 i 3.3.x.:contentReference[oaicite:8]{index=8}

---

### B. Kolor, typografia i media

8. **Kontrast tekstu i UI elementów**
   - zwykły tekst: min. **4.5:1**,
   - duży tekst (≥18pt / 24px lub 14pt bold / 19px): min. **3:1**,
   - obramowania przycisków, ikon, focusu itp.: min. **3:1**.:contentReference[oaicite:9]{index=9}

9. **Informacja nie tylko kolorem**  
   Błędy w formularzu, zaznaczenie statusu, legendy wykresów – kolor może pomagać, ale nie może być jedynym nośnikiem (np. dodaj ikonę, tekst „Błąd”, podkreślenie).:contentReference[oaicite:10]{index=10}

10. **Tekst skalowalny min. 200% bez poziomego scrolla**  
    Użytkownik może powiększyć treść (zoom w przeglądarce, ustawienia OS) i nadal da się czytać i korzystać z serwisu (1.4.4, 1.4.10).:contentReference[oaicite:11]{index=11}

11. **Treści na hover/focus nie zasłaniają wszystkiego**  
    Tooltipy, dropdowny, megamenusy – da się je:
    - zamknąć bez dokładnego „trafiania”,
    - wyłączyć bez gubienia focusu,  
      a treść pod spodem nie jest trwale zasłonięta (1.4.13).:contentReference[oaicite:12]{index=12}

12. **Napisy i transkrypcje dla audio/wideo**
    - wideo ma napisy (minimum: dialogi + ważne komunikaty),
    - podcasty / audio mają link do transkrypcji.  
      To adresuje serię kryteriów 1.2.x.:contentReference[oaicite:13]{index=13}

13. **Autoodtwarzanie dźwięku można zatrzymać**  
    Audio grające >3 sekundy ma widoczny przycisk pauzy / wyciszenia (1.4.2).:contentReference[oaicite:14]{index=14}

---

### C. Klawiatura i focus

14. **Wszystko da się obsłużyć samą klawiaturą**  
    Każda funkcja dostępna myszą jest dostępna również z klawiatury – bez wymagania „idealnego timingu” (2.1.1 Keyboard).:contentReference[oaicite:15]{index=15}

15. **Brak pułapek klawiatury**  
    Po wejściu np. w modal, widget chatu czy menu da się:
    - przejść dalej do kolejnych elementów,
    - zamknąć komponent (np. ESC, przycisk „Zamknij”).  
      WCAG wymaga, by dało się „uciec” z każdego elementu (2.1.2).:contentReference[oaicite:16]{index=16}

16. **Logiczna kolejność focusu**  
    Tabbing idzie w kolejności zgodnej z sensem treści (zwykle z góry na dół, lewa → prawa kolumna) – nie skacze między headerem, footerem a środkiem strony (2.4.3).:contentReference[oaicite:17]{index=17}

17. **Wyraźny focus widoczny wizualnie**  
    Element z fokusem ma widoczny wskaźnik (np. outline, zmiana tła, podkreślenie), którego **nie usuwasz** w CSS bez zastąpienia lepszym. To realizuje 2.4.7 / 2.4.11 / 2.4.13.:contentReference[oaicite:18]{index=18}

18. **Skip link „Przejdź do treści”**  
    Na początku strony (najlepiej jako pierwszy link) jest odnośnik pozwalający pominąć menu i przejść do głównej treści (2.4.1 Bypass Blocks).:contentReference[oaicite:19]{index=19}

19. **Zarządzanie focusem w modalach i overlayach**  
    Po otwarciu modala focus ląduje w środku (np. na nagłówku lub zamknięciu), a po zamknięciu wraca do elementu, który modal otworzył. To łączy wymagania 2.4.3 i 2.4.7.:contentReference[oaicite:20]{index=20}

---

### D. Formularze i procesy

20. **Pola wymagane są jasno oznaczone**
    - używasz tekstu „(wymagane)” albo legendy wyjaśniającej \*,
    - różnicę widać nie tylko kolorem.:contentReference[oaicite:21]{index=21}

21. **Błędy „przyklejone” do pól i czytelne**  
    Komunikaty błędów:
    - są przy konkretnym polu (i najlepiej powiązane np. przez `aria-describedby`),
    - mówią, _co_ poprawić („Podaj poprawny adres e-mail w formacie…”, a nie „Błąd 123”).:contentReference[oaicite:22]{index=22}

22. **Formularz nie kasuje wszystkiego po jednym błędzie**  
    Po odrzuceniu walidacji wpisane dane pozostają. To wspiera m.in. 3.3.1 i nowsze 3.3.7 (Redundant Entry) w WCAG 2.2, które zniechęca do ponownego wprowadzania tych samych danych.:contentReference[oaicite:23]{index=23}

23. **Wieloetapowe procesy mają widoczne kroki**  
    Checkout, onboarding czy zapis na kurs pokazuje „krok 1 z 3” itp. – to pomaga spełnić 2.4.8 Location (poczucie „gdzie jestem”).:contentReference[oaicite:24]{index=24}

24. **Pomoc jest w stałym miejscu (Consistent Help)**  
    Link do FAQ, chatu lub kontaktu jest konsekwentnie w tym samym miejscu interfejsu na wszystkich stronach procesu (3.2.6 – nowe kryterium w 2.2).:contentReference[oaicite:25]{index=25}

25. **Logowanie i weryfikacja bez „łamigłówek”**  
    Użytkownik może się zalogować / potwierdzić konto bez przepisywania trudnego tekstu z obrazków; jeśli stosujesz CAPTCHA, jest dostępna alternatywa (np. audio, reCAPTCHA v3). To wspiera 3.3.8 Accessible Authentication.:contentReference[oaicite:26]{index=26}

---

### E. RWD, ruch i interakcje

26. **Brak poziomego scrolla przy typowych szerokościach**  
    Na telefonie przy szerokości ~320–375 px treść się zawija i jest czytelna bez konieczności ciągłego scrollowania w bok (1.4.10 Reflow).:contentReference[oaicite:27]{index=27}

27. **Drag & drop ma alternatywę**  
    Tam, gdzie przeciągasz elementy (np. sortowanie, upload), jest alternatywa typu „przenieś w górę / dół” jednym kliknięciem (2.5.7 Dragging Movements).:contentReference[oaicite:28]{index=28}

28. **Wielkość celu dotykowego**  
    Przycisk / link ma ok. **24×24 px** lub odpowiedni bufor od innych elementów – to wspiera 2.5.5 Target Size (2.1) i 2.5.8 Target Size (Minimum) (2.2).:contentReference[oaicite:29]{index=29}

29. **Kontrola nad animacjami i ruchem**
    - animacje nie są wymagane, żeby coś zrozumieć,
    - szanujesz preferencje `prefers-reduced-motion` i/lub dajesz przełącznik „wyłącz animacje”.:contentReference[oaicite:30]{index=30}

30. **Brak migotania powyżej 3 razy na sekundę**  
    Elementy nie mrugają / nie błyskają szybciej niż 3 razy na sekundę (2.3.1 Three Flashes), co zmniejsza ryzyko ataku padaczki fotogennej.:contentReference[oaicite:31]{index=31}

---

> **Sugestia:** jeśli większość z powyższych punktów jest „na zielono”, jesteś bliżej praktycznej zgodności z WCAG 2.1/2.2 AA niż większość rynku. Formalne potwierdzenie zgodności wymaga jednak pełnego audytu według oficjalnych kryteriów W3C i – jeśli strona podlega takim wymogom – konsultacji prawnej.
