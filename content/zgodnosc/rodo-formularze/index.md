---
title: "RODO w formularzach – klauzule i zgody (szablony)"
slug: "rodo-formularze"
path: "/zgodnosc/rodo-formularze/"
type: "template"
tags: ["evergreen", "zgodnosc", "rodo", "formularze"]
draft: true
date: "2025-11-05"
---

# RODO w formularzach: klauzule informacyjne i zgody (szablony)

> **Uwaga:** to są szablony robocze, oparte na wymaganiach art. 13 i 6 RODO oraz dobrych praktykach. Zanim wdrożysz je w produkcji, daj je do przejrzenia prawnikowi / IODO.

## 1. Co musi zawierać klauzula informacyjna (art. 13 RODO)

Art. 13 RODO wymaga, aby przy zbieraniu danych bezpośrednio od osoby przekazać m.in.:​:contentReference[oaicite:65]{index=65}  

- dane administratora i kontakt,  
- (jeśli jest) kontakt do inspektora ochrony danych,  
- cele przetwarzania i **podstawy prawne** (art. 6),  
- odbiorców / kategorie odbiorców,  
- informację o przekazywaniu danych poza EOG (jeśli ma miejsce),  
- okres przechowywania (lub kryteria jego ustalania),  
- informacje o prawach osoby (dostęp, sprostowanie, usunięcie, ograniczenie, sprzeciw, przenoszenie),  
- prawo wniesienia skargi do organu nadzorczego (PUODO),  
- informację, czy podanie danych jest wymogiem i co się stanie, jeśli ich nie poda,  
- jeśli podstawą jest zgoda – informację o możliwości jej wycofania.

Art. 6 RODO z kolei wskazuje 6 podstaw przetwarzania, z których w praktyce przy formularzach najczęściej korzystasz z: zgody, wykonania umowy lub uzasadnionego interesu.:contentReference[oaicite:66]{index=66}  

---

## 2. Formularz kontaktowy – przykładowa klauzula

### 2.1. Minimalny formularz kontaktowy

Pola: Imię, e-mail, treść wiadomości.

**Propozycja klauzuli pod formularzem:**

> Administratorem Twoich danych osobowych jest [NAZWA FIRMY] z siedzibą w [ADRES] („Administrator”).  
>  
> Będziemy przetwarzać Twoje dane w celu:  
> – udzielenia odpowiedzi na przesłane zapytanie – na podstawie naszego prawnie uzasadnionego interesu (art. 6 ust. 1 lit. f RODO) polegającego na obsłudze korespondencji oraz budowaniu relacji z osobami zainteresowanymi naszą ofertą,  
> – ewentualnego ustalenia, dochodzenia lub obrony przed roszczeniami – na tej samej podstawie prawnej.  
>  
> Twoje dane mogą być przekazywane dostawcom usług IT, hostingodawcom, dostawcom systemów CRM i narzędzi komunikacji, którzy przetwarzają je na podstawie umów powierzenia przetwarzania danych.  
>  
> Dane będziemy przechowywać przez okres niezbędny do obsługi korespondencji, a następnie przez czas przedawnienia ewentualnych roszczeń.  
>  
> Przysługuje Ci prawo żądania dostępu do swoich danych, ich sprostowania, usunięcia, ograniczenia przetwarzania oraz wniesienia sprzeciwu, a także prawo wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych.  
>  
> Podanie danych jest dobrowolne, ale niezbędne do obsługi zapytania.

Taki model często opiera się na **uzasadnionym interesie** zamiast na zgodzie – pod warunkiem, że nie używasz tych danych od razu do marketingu bezpośredniego wykraczającego poza odpowiedź na zapytanie.:contentReference[oaicite:67]{index=67}  

### 2.2. Jeśli chcesz dodać newsletter / marketing

Wtedy dane z formularza kontaktowego nie powinny być „domyślnie” używane do marketingu mailowego. Dodaj osobne, opcjonalne checkboxy:

> [ ] Chcę otrzymywać od [NAZWA FIRMY] informacje marketingowe dotyczące produktów i usług drogą e-mail.  
>  
> [ ] Chcę otrzymywać od [NAZWA FIRMY] informacje marketingowe dotyczące produktów i usług drogą telefoniczną / SMS (jeśli zbierasz telefon).

Do checkboxów powinna odnosić się dodatkowa część klauzuli:

> Dane przetwarzane w celach marketingu bezpośredniego będą przetwarzane na podstawie Twojej zgody (art. 6 ust. 1 lit. a RODO), którą możesz w każdej chwili wycofać, kontaktując się z nami na [ADRES E-MAIL] lub klikając link rezygnacji w otrzymanej wiadomości. Wycofanie zgody nie wpływa na zgodność z prawem przetwarzania, którego dokonano przed jej wycofaniem.:contentReference[oaicite:68]{index=68}  

---

## 3. Formularz zapisu na newsletter

Tutaj podstawa prawna to klasycznie **zgoda**.

**Propozycja klauzuli:**

> Administratorem Twoich danych osobowych jest [NAZWA FIRMY] z siedzibą w [ADRES] („Administrator”).  
>  
> Będziemy przetwarzać Twój adres e-mail w celu wysyłki newslettera zawierającego [krótki opis treści: np. artykuły edukacyjne, informacje o nowych usługach, oferty specjalne] – na podstawie Twojej zgody (art. 6 ust. 1 lit. a RODO).  
>  
> Twoje dane mogą być przekazywane dostawcom systemów mailingowych oraz narzędzi analitycznych, którzy przetwarzają je na podstawie umów powierzenia przetwarzania danych.  
>  
> Dane będą przetwarzane do czasu wycofania zgody (np. poprzez kliknięcie linku rezygnacji w każdej wiadomości newslettera) lub do zakończenia wysyłki newslettera.  
>  
> Przysługuje Ci prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, prawo do przenoszenia danych oraz prawo wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych.  
>  
> Podanie danych jest dobrowolne, ale niezbędne, abyśmy mogli wysyłać Ci newsletter.

Checkbox:

> [ ] Zgadzam się na przetwarzanie mojego adresu e-mail w celu wysyłki newslettera zgodnie z powyższą klauzulą.

---

## 4. Formularze sprzedażowe / rejestracja na kurs

Często łączą dwa cele:

1. **realizacja umowy** (np. dostęp do kursu, realizacja zamówienia),  
2. **marketing własny** (newsletter, cross-selling).

Prosta konstrukcja:

- dane do realizacji zamówienia → podstawa: **art. 6 ust. 1 lit. b** (umowa),  
- dodatkowe zgody marketingowe → **art. 6 ust. 1 lit. a** (zgoda).

Fragment klauzuli:

> Dane podane w formularzu rejestracyjnym będziemy przetwarzać w celu:  
> – założenia i obsługi konta użytkownika w serwisie oraz realizacji zamówienia – na podstawie niezbędności do wykonania umowy (art. 6 ust. 1 lit. b RODO),  
> – prowadzenia rozliczeń i archiwizacji dokumentacji księgowej – na podstawie obowiązku prawnego (art. 6 ust. 1 lit. c RODO),  
> – (opcjonalnie, jeśli zaznaczysz checkbox) przesyłania informacji marketingowych – na podstawie Twojej zgody (art. 6 ust. 1 lit. a RODO).

---

## 5. Dobre praktyki UX dla klauzul i zgód

- **Krótka wersja przy formularzu, pełna w polityce** – pod formularzem pokazujesz skróconą klauzulę + link „Zobacz pełną informację o przetwarzaniu danych”.:contentReference[oaicite:69]{index=69}  
- **Brak wstępnie zaznaczonych checkboxów** – zgoda wymaga aktywnego działania (dotyczy też komunikatu Planet49 o pre-zaznaczonych polach).:contentReference[oaicite:70]{index=70}  
- **Rozdzielenie zgód** – osobno zgoda na newsletter, osobno na telefon/SMS, osobno np. na profilowanie.  
- **Język ludzki, nie „prawniczy beton”** – RODO wymaga, by informacje były przekazywane jasno, zrozumiale i w przystępnej formie.:contentReference[oaicite:71]{index=71}  

Te szablony powinny dać Ci solidną bazę do przygotowania realnych klauzul w projektach – ale traktuj je jako punkt startu do rozmowy z prawnikiem, a nie ostateczną wersję.

