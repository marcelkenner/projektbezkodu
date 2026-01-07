---
title: Convert.com – FAQ
slug: convert-com-faq
path: /narzedzia/convert-com/faq/
template: default
seo:
  title: Convert.com – FAQ. Najczęstsze pytania o MTU, cennik, GA4, bezpieczeństwo i wdrożenie
  description: Odpowiedzi na najczęstsze pytania o Convert.com (Convert Experiences): co to jest MTU/tested users, co przy przekroczeniu limitu, jak działa trial, GA4, wiele domen, bezpieczeństwo i anulowanie.
  keywords:
    - convert.com faq
    - convert experiences faq
    - MTU tested users
    - convert cennik
    - convert ga4
    - convert bezpieczeństwo
meta:
  format: faq
  hasAffiliateLinks: false
  updatedAt: "2026-01-07"
  summaryBullets:
    - MTU to unikalni użytkownicy, którzy weszli do testów w danym miesiącu; overlap między testami nie jest liczony podwójnie.
    - Limit MTU możesz traktować jak „bezpiecznik kosztów” i zdecydować, czy dopuszczasz dopłaty, czy wolisz automatyczne pauzowanie.
    - Convert jest dla zespołów, które dowożą testy, a nie tylko o nich mówią.
  primaryCta:
    label: Uruchom 15-dniowy trial Convert (bez karty)
    href: https://www.convert.com/free-trial/
  secondaryCta:
    label: Zobacz cennik i limity MTU
    href: /narzedzia/convert-com/cennik/
taxonomy:
  categories:
    - Narzędzia
  tags:
    - FAQ
    - A/B testing
    - CRO
    - GA4
    - bezpieczeństwo
---

# Convert.com – FAQ

Jeśli rozważasz Convert.com, to nie potrzebujesz kolejnego opisu funkcji. Potrzebujesz jasnych odpowiedzi: ile to kosztuje w praktyce, jak liczą MTU, co się dzieje po przekroczeniu limitu i czy przejdziesz przez compliance.

Werdykt: Convert jest najlepszy dla zespołów i agencji, które testują regularnie i chcą przewidywalnego modelu kosztów. Jeśli nie masz rytmu eksperymentów, Convert nie „naprawi” CRO — tylko pokaże, że problem jest w procesie.

## Czy Convert ma darmowy trial i czy trzeba podawać kartę?

Tak, jest [15-dniowy trial](https://www.convert.com/free-trial/) i Convert komunikuje wprost „no credit card needed”. To jest najuczciwszy sposób na decyzję: nie wierz w opinie, zobacz narzędzie na własnym ruchu.

## Czy trial obejmuje premium funkcje?

Convert deklaruje, że trial daje dostęp do „premium features” w ramach wybranego planu i po prostu pozwala przetestować narzędzie przed płatnością ([trial](https://www.convert.com/free-trial/)). W praktyce: jeśli narzędzie nie siada Ci w pierwszych dniach pracy, nie uratuje tego „lepszy onboarding”.

## Co to jest MTU/tested users i jak Convert to liczy?

MTU (Monthly Tested Users) to unikalni użytkownicy, którzy w danym miesiącu zostali „wpuszczeni” do co najmniej jednego eksperymentu lub personalizacji. Convert definiuje to wprost w swoim [FAQ](https://www.convert.com/frequently-asked-questions/) oraz na stronie [pricing](https://www.convert.com/pricing/).

Najważniejsza konsekwencja: jeśli ktoś wejdzie do kilku testów w tym samym miesiącu, nadal liczy się jako jeden tested user.

## Czy overlap między testami zjada limit MTU podwójnie?

Nie. Convert mówi wprost, że przy liczeniu tested users „disregard overlaps”, czyli nie dolicza Ci podwójnie tych samych osób, które trafiły do kilku doświadczeń ([pricing](https://www.convert.com/pricing/)). To jest realna przewaga, jeśli prowadzisz równoległe testy, bo koszt przestaje być karą za dojrzały program eksperymentów.

## Co się stanie, gdy przekroczę limit MTU?

To zależy od ustawienia, ale Convert opisuje podejście bez straszenia: nie „ucina” konta za nagły wzrost. Na stronie [pricing](https://www.convert.com/pricing/) deklarują, że sygnalizują poziomy 90% i 100% wykorzystania, a potem możesz dokupić dodatkowe pakiety MTU.

Jeśli chcesz konkrety cenowe dopłat i przykłady, masz to rozpisane w naszej analizie: [/narzedzia/convert-com/cennik/](/narzedzia/convert-com/cennik/).

## Czy mogę zablokować dopłaty za over-quota?

Tak. Convert ma osobne ustawienie „over-quota charges” i opisuje, że domyślnie doświadczenia mogą zostać spauzowane po osiągnięciu limitu, a dopłaty włączasz tylko wtedy, gdy świadomie na to pozwolisz ([over-quota](https://support.convert.com/hc/en-us/articles/204494279-allow-disable-over-quota-usage)).

W praktyce: to jest dobre dla polskich zespołów, które chcą mieć twardą kontrolę budżetu i nie lubią „niespodzianek na fakturze”.

## Czy da się łatwo anulować subskrypcję? I co z danymi?

Tak. Convert pisze, że przy planie miesięcznym możesz anulować w trakcie miesiąca, żeby zatrzymać kolejne naliczanie, a dane mają pozostać dostępne przez trzy miesiące na wypadek powrotu ([pricing FAQ](https://support.convert.com/hc/en-us/articles/115000061192-pricing-faq)). Przy planie rocznym możesz anulować w dowolnym momencie, ale umowa po prostu nie odnowi się po okresie rozliczeniowym ([pricing FAQ](https://support.convert.com/hc/en-us/articles/115000061192-pricing-faq)).

## Czy Convert działa z GA4?

Tak. Convert ma opisaną integrację GA4 w dokumentacji wsparcia i wskazuje, że jest to konfiguracja na poziomie projektu (jednorazowa, nie dla każdego testu osobno) ([GA4](https://support.convert.com/hc/en-us/articles/15577127776141-integrate-convert-experiences-with-google-analytics-4)).

Jeśli Twoim standardem jest raportowanie w GA4, to jest temat, który warto ogarnąć na początku, bo oszczędza masę „ręcznego klejenia” danych.

## Czy wdrożę Convert przez Google Tag Manager?

Convert oficjalnie prowadzi centrum wsparcia i opisuje integracje krok po kroku, ale najuczciwsze podejście jest proste: jeśli Twój zespół i tak trzyma tagi w GTM, idź tą ścieżką i sprawdź w trialu, czy performance i QA są stabilne. Na start i tak najważniejsze jest jedno: czy potrafisz przejść cały cykl od hipotezy do wyniku.

Jeśli chcesz „zero ryzyka”, wdrożenie snippet + QA overlay zwykle daje większą kontrolę niż skomplikowane łańcuchy tagów.

## Czy Convert obsługuje testy multi-page i MVT?

Tak. Convert pokazuje wprost, że wyższe plany obejmują multivariate i multi-page testing ([pricing](https://www.convert.com/pricing/)). Jeśli Twoje testy obejmują całe lejki (np. landing → koszyk → checkout), to nie jest „miły dodatek”. To często warunek sensownego testowania.

## Czy Convert ma full-stack i feature flags?

Tak. Convert komunikuje „Full Stack & Feature Flags” jako element planów (np. Pro) na stronie [pricing](https://www.convert.com/pricing/). W praktyce oznacza to, że narzędzie nie kończy się na wizualnych zmianach na stronie, jeśli dojrzewasz do eksperymentów w produkcie.

Uczciwy filtr: jeśli Twoje testy mają żyć w repo i pipeline’ach release, patrz też na narzędzia stricte produktowe. Jeśli testujesz głównie UX/treści w webie, Convert zwykle jest prostszy.

## Czy Convert obsługuje wiele domen i cross-domain tracking?

Tak. Convert pisze, że wspiera funkcje cross-domain dla goal tracking, testów i targetowania oraz że obsługuje wiele domen out-of-the-box ([pricing](https://www.convert.com/pricing/), [pricing FAQ](https://support.convert.com/hc/en-us/articles/115000061192-pricing-faq)).

Jeśli masz e-commerce na kilku domenach albo osobny checkout, to jest temat krytyczny, nie „opcjonalny”.

## Gdzie Convert trzyma dane i czy to sensowne dla firm z UE?

Convert opisuje, że produkcja (serwery i bazy) działa na AWS, a „login site” jest na Hetzner „dla zgodności z GDPR” ([security](https://www.convert.com/security/)). Dodatkowo podają, że produkcja jest rozłożona na dwie strefy dostępności w regionie AWS eu-west-1 ([security](https://www.convert.com/security/)).

W praktyce: dla większości firm z Polski to brzmi rozsądnie, ale jeśli masz bardzo restrykcyjne wymagania dot. lokalizacji danych, po prostu zweryfikuj to z prawnikiem i wymaganiami branżowymi.

## Czy Convert jest SOC/ISO/HIPAA compliant?

Convert stawia sprawę jasno: nie deklarują własnej zgodności SOC ani ISO 27001, wskazują natomiast, że ich dostawcy centrów danych (AWS/Hetzner) mają odpowiednie raporty/certyfikacje do pozyskania bezpośrednio u dostawców ([security](https://www.convert.com/security/)). Jednocześnie Convert wprost komunikuje, że ich usługi nie są HIPAA compliant ([security](https://www.convert.com/security/)).

Werdykt: jeśli Twoje compliance wymaga „nasza firma ma SOC/ISO, kropka”, Convert może nie przejść checklista-first. Jeśli wystarcza Ci model „shared responsibility” i akceptacja certyfikacji po stronie infrastruktury, temat bywa do obrony.

## Czy Convert zbiera dane osobowe użytkowników?

Convert komunikuje, że przez ich usługi nie zbierają danych pozwalających na bezpośrednią identyfikację osoby („personally identifiable information”), nie instalują software’u na komputerach użytkowników i nie śledzą klawiszy ([opt-out](https://www.convert.com/opt-out/)). To nie zwalnia Cię z myślenia o prywatności w Twojej implementacji, ale jest ważnym sygnałem, jak platforma pozycjonuje swój model śledzenia.

## Ile czasu zajmuje uruchomienie pierwszego testu?

Jeśli masz podstawowy porządek w analityce i ktoś u Ciebie dowozi wdrożenia, pierwszy prosty test da się przygotować w dniu wdrożenia triala. Jeśli nie da się, problemem jest zwykle QA, tracking celów albo ownership, nie brak funkcji.

Najlepszy pierwszy krok: odpal trial, zrób jeden mały test na jednej stronie i domknij cykl. To buduje nawyk i od razu pokazuje, czy Convert pasuje do Twojego sposobu pracy.

## Jaki plan jest minimum: Growth czy Pro?

Jeśli testujesz 1–4 razy w miesiącu, nie robisz skomplikowanych lejków i chcesz po prostu dowozić, Growth jest sensownym minimum, bo Convert opisuje go jako pełnoprawny plan do regularnych testów ([pricing](https://www.convert.com/pricing/)).

Pro ma sens, gdy rośniesz w złożoność: multi-page/MVT, większy program testów, potrzeba rzeczy typu raw data export, SSO, phone support czy sequential testing ([pricing](https://www.convert.com/pricing/)). Jeśli czujesz, że „zaraz utopimy się w testach i kontroli”, Pro zwykle jest tym momentem.

Jeśli chcesz to policzyć po polsku, bez marketingu: [/narzedzia/convert-com/cennik/](/narzedzia/convert-com/cennik/).
