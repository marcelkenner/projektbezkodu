---
title: "Dokumentacja wdrożenia – karta zgodności projektu"
slug: "dokumentacja-wdrozenia"
path: "/zgodnosc/dokumentacja-wdrozenia/"
type: "template"
tags: ["evergreen", "zgodnosc", "rodo", "proces"]
draft: true
date: "2025-11-05"
---

# Dokumentacja wdrożenia: „karta zgodności” dla projektu WWW

RODO opiera się m.in. na zasadzie **rozliczalności** – administrator musi być w stanie wykazać, że przetwarza dane zgodnie z przepisami.:contentReference[oaicite:72]{index=72}  

Jednym z praktycznych narzędzi jest **karta zgodności projektu** – krótki dokument, który podsumowuje:

- jakie dane zbierasz przez stronę,  
- w jakich celach i na jakiej podstawie,  
- jakie masz zabezpieczenia i procesy.

To nie zastępuje formalnego rejestru czynności przetwarzania z art. 30 RODO, ale bardzo pomaga go wypełnić lub uzupełnić.:contentReference[oaicite:73]{index=73}  

## 1. Struktura „karty zgodności”

Propozycja sekcji:

1. Dane projektu  
2. Mapowanie danych i procesów  
3. Podstawy prawne  
4. Podmioty przetwarzające (procesorzy)  
5. Prawa osób, których dane dotyczą  
6. Bezpieczeństwo techniczne i organizacyjne  
7. Cookies i narzędzia śledzące  
8. Ocena ryzyka / DPIA (jeśli dotyczy)  
9. Podsumowanie i zakres odpowiedzialności

---

## 2. Dane projektu

Przykładowy szablon:

- **Nazwa projektu:**  
- **Adres(y) URL:**  
- **Administrator danych:** [Nazwa, forma prawna, adres]  
- **Osoba odpowiedzialna po stronie klienta:** [Imię i nazwisko, funkcja, kontakt]  
- **Dostawca / wykonawca strony:** [Twoja firma] (rola procesora lub współadmina – do ustalenia umową):contentReference[oaicite:74]{index=74}  

---

## 3. Mapowanie danych i procesów

Tabela:

| Proces                           | Skąd dane?                | Kategorie danych                       | Kategorie osób              |
|----------------------------------|---------------------------|----------------------------------------|-----------------------------|
| Formularz kontaktowy             | Formularz www             | imię, e-mail, treść wiadomości         | potencjalni klienci         |
| Newsletter                       | Formularz zapisu          | e-mail, preferencje                    | subskrybenci                |
| Zakupy / rejestracja w sklepie   | Formularz zamówienia      | imię, nazwisko, adres, e-mail, NIP itd | klienci                     |
| Logi serwera / bezpieczeństwo    | Infrastruktura hostingowa | adres IP, znaczniki czasu, user agent  | użytkownicy odwiedzający    |

To od razu porządkuje informacje wymagane w art. 30 (opis kategorii danych, osób, celów i odbiorców).:contentReference[oaicite:75]{index=75}  

---

## 4. Podstawy prawne

Dla każdej czynności / celu określ:

- **cel przetwarzania** (np. obsługa zapytań, realizacja zamówień, newsletter, analityka),  
- **podstawa prawna** (art. 6 ust. 1 lit. a/b/c/f),  
- czy wymagana jest **zgoda**, czy opierasz się na umowie / obowiązku prawnym / uzasadnionym interesie.

Tabela:

| Cel                                  | Podstawa prawna (art. 6 RODO)                  | Uwagi                                           |
|--------------------------------------|------------------------------------------------|------------------------------------------------|
| Odpowiedź na zapytania z formularza  | Uzasadniony interes (f)                        | obsługa korespondencji                         |
| Realizacja zamówień                  | Wykonanie umowy (b)                            |                                               |
| Newsletter                          | Zgoda (a)                                      | dobrowolna, możliwość wycofania                |
| Analityka ruchu na stronie           | Zgoda (a)                                      | powiązana z polityką cookies                   |

:contentReference[oaicite:76]{index=76}  

---

## 5. Podmioty przetwarzające (procesorzy)

Wypisz wszystkie podmioty, które przetwarzają dane w imieniu administratora:

- hosting / serwer / CDN,  
- system mailingowy,  
- CRM,  
- narzędzia analityczne i marketingowe, jeśli dochodzi do przekazywania danych,  
- software house / freelancerzy, jeśli mają dostęp do produkcji z danymi.

Przy każdym:

- **nazwa i kraj**,  
- **zakres danych / cel**,  
- informacja, czy zawarta jest **umowa powierzenia przetwarzania** (art. 28 RODO).:contentReference[oaicite:77]{index=77}  

---

## 6. Prawa osób, których dane dotyczą

Krótko opisz, jak organizacja realizuje prawa z art. 15–22 RODO (dostęp, sprostowanie, usunięcie, ograniczenie, przenoszenie, sprzeciw, brak zautomatyzowanego profilowania):​:contentReference[oaicite:78]{index=78}  

- kanały zgłoszeń (e-mail, formularz RODO),  
- procedurę obsługi (np. kto przyjmuje zgłoszenie, w jakim czasie odpowiada, w jaki sposób weryfikuje tożsamość),  
- sposób dokumentowania zgłoszeń.

W karcie możesz mieć sekcję:

> **Obsługa praw osób, których dane dotyczą**  
> – Wniosek można złożyć poprzez: [adres e-mail, link do formularza].  
> – Osoba odpowiedzialna po stronie [NAZWA FIRMY]: [Imię, rola].  
> – Standardowy czas odpowiedzi: do 1 miesiąca, z możliwością przedłużenia do 3 miesięcy w przypadku skomplikowanych wniosków (zgodnie z art. 12 ust. 3 RODO).:contentReference[oaicite:79]{index=79}  

---

## 7. Bezpieczeństwo techniczne i organizacyjne

W skrócie:

- **techniczne:** HTTPS, backupy, kontrola dostępu, szyfrowanie haseł, logowanie błędów bez zbędnych danych osobowych;  
- **organizacyjne:** dostęp do paneli tylko dla upoważnionych osób, polityka haseł, umowy powierzenia, szkolenia.:contentReference[oaicite:80]{index=80}  

Możesz wypunktować:

> – Dostęp do panelu administracyjnego strony mają wyłącznie: [role].  
> – Hasła przechowywane są z wykorzystaniem algorytmów kryptograficznych zgodnych z aktualnymi rekomendacjami.  
> – Komunikacja z serwisem jest zabezpieczona protokołem HTTPS.  
> – Wdrożono regularne aktualizacje systemu CMS i wtyczek.

---

## 8. Cookies i narzędzia śledzące

Odwołaj się do:

- przyjętego **mechanizmu zgód** (baner, CMP),  
- kategorii cookies oraz narzędzi zewnętrznych,  
- linku do Polityki cookies.

Możesz mieć w karcie prostą listę:

> – Mechanizm zgód: [nazwa narzędzia / autorskie].  
> – Kategorie cookies: niezbędne, analityczne, marketingowe.  
> – Narzędzia: Google Analytics 4, Meta Pixel, [inne].  
> – Link do Polityki cookies: [URL].

:contentReference[oaicite:81]{index=81}  

---

## 9. Ocena ryzyka / DPIA

Jeśli projekt:

- przetwarza dane w sposób, który może stwarzać **wysokie ryzyko** (np. dane szczególne, profilowanie na dużą skalę),  
- łączy wiele źródeł danych,  
- jest skierowany w szczególności do dzieci,

warto dodać sekcję:

- czy przeprowadzono DPIA (Data Protection Impact Assessment),  
- główne wnioski i zastosowane środki.

W wielu klasycznych stronach firmowych DPIA nie będzie wymagana, ale dobrze jest udokumentować, że **ktoś to świadomie ocenił**.:contentReference[oaicite:82]{index=82}  

---

## 10. Podsumowanie i zakres odpowiedzialności

Na końcu „karty zgodności” warto jasno zapisać:

- co leży po stronie administratora (polityki, umowy, decyzje co do podstaw prawnych),  
- co leży po stronie wykonawcy strony (bezpieczeństwo techniczne, implementacja mechanizmów zgód, konfiguracja narzędzi zgodnie z wytycznymi klienta).

Taki dokument:

- ułatwia przejście przez audyt RODO,  
- pomaga uporządkować relację administrator–procesor,  
- stanowi szybki „snapshot” zgodności konkretnego projektu w czasie.

