---
title: "Dorik – formularze i płatności"
slug: "formularze-platnosci"
path: "/narzedzia/dorik/formularze-platnosci/"
template: "default"
type: "guide"
date: "2026-01-08"
hero:
  heading: "Formularze i płatności w Dorik: leady, newsletter i sprzedaż bez sklepu"
  subheading: "Dorik jest świetny, gdy chcesz zbierać zapytania i zapisy oraz przyjąć prostą płatność ‘na przycisk’. Jeśli potrzebujesz pełnego checkoutu e-commerce, fakturowania i rozbudowanych metod płatności — Dorik ma być stroną sprzedażową, a silnik sprzedaży robisz gdzie indziej."
  primaryCta: "Sprawdź cennik"
  secondaryCta: "Przeczytaj recenzję"
seo:
  title: "Dorik: formularze i płatności – jak zbierać leady i sprzedawać (Stripe, PayPal, webhooks)"
  description: "Praktyczny przewodnik: Contact Form, Custom Form, Subscription Form oraz płatności w Dorik (Payment Button, Stripe membership). Jak podpiąć Zapier/Make, Mailchimp, GetResponse i Brevo."
  keywords:
    - dorik formularz kontaktowy
    - dorik custom form
    - dorik subscription form
    - dorik make integromat webhook
    - dorik payment button
    - dorik stripe membership
meta:
  updatedAt: "2026-01-08"
  author: "Redakcja"
  hasAffiliateLinks: false
  format: "guide"
  topics:
    - "formularze"
    - "płatności"
    - "no-code"
    - "integracje"
    - "membership"
  summaryBullets:
    - "Najprościej: Contact Form do zapytań, Subscription Form do zapisów, Custom Form do wszystkiego ‘niestandardowego’."
    - "Automatyzacje: Dorik wspiera webhooks pod Make.com (Integromat) i Zapier, więc szybko wyślesz dane do CRM lub mailingu."
    - "Płatności: Payment Button działa z Stripe/PayPal/Gumroad/Paddle; członkostwo i paywall opiera się o Stripe."
taxonomy:
  categories: ["Narzędzia", "Kreatory stron"]
  tags: ["formularze", "płatności", "webhook", "zapier", "make.com", "stripe"]
---

Dorik daje Ci dwa szybkie klocki do zarabiania: formularze (żeby nie tracić leadów) i płatności (żeby nie odkładać sprzedaży “na później”). Najważniejsze jest to, że Dorik nie próbuje być pełnym systemem e-commerce. I to jest zaleta, jeśli sprzedajesz usługi, konsultacje albo produkty cyfrowe.

Werdykt na start: jeśli Twoim celem jest lead, zapis lub płatność za jedną ofertę, Dorik wystarczy. Jeśli Twoim celem jest sklep z koszykiem i logistyką, Dorik ma być tylko frontem, a sprzedaż robisz w narzędziu do sprzedaży.

## Jakie formularze masz w Dorik i który wybrać

Dorik ma trzy praktyczne typy formularzy, które pokrywają większość scenariuszy.

Contact Form
To klasyczny formularz “Napisz do nas”. Dodajesz go jako element na stronie i konfigurujesz pod zapytania. Dorik opisuje dodawanie i edycję formularza w dokumentacji [Contact Form](https://help.dorik.com/en/article/contact-form-9elant/).  
W praktyce: używaj go do leadów usługowych i zapytań ofertowych.

Subscription Form
To formularz do zapisów (newsletter, lista oczekujących, lead magnet). Dorik pokazuje, że w edytorze masz konfigurację formularza, pola i style oraz integracje pod mailing ([Subscription Form](https://help.dorik.com/en/article/subscription-form-ohxxza/)).  
W praktyce: jeśli chcesz zbierać zapisy “do listy”, bierz Subscription Form, bo jest pod to zrobiony.

Custom Form
To formularz “zrób jak chcesz”: własne pola, własna logika wysyłki i integracje. Dorik ma osobny opis funkcji i kroków w [Custom Form](https://help.dorik.com/en/article/custom-form-1om8yc8/).  
W praktyce: używaj go do briefów, ankiet, formularzy rekrutacyjnych, zamówień na usługę, zapisów na konsultację.

## Gdzie trafiają dane z formularzy: na maila, do CRM, do mailingu

Tu Dorik jest bardzo pragmatyczny: zamiast udawać rozbudowany CRM, daje Ci integracje i webhooki, żebyś wysłał dane tam, gdzie naprawdę nimi pracujesz.

Automatyzacje przez Make.com (Integromat)
Jeśli chcesz przepuścić dane przez scenariusz (np. “formularz → Airtable → Slack → e-mail do klienta”), Dorik prowadzi to przez webhook. W instrukcji Dorik pokazuje wybór “Integromat” i wklejenie webhook URL w konfiguracji formularza ([Make.com / Integromat](https://help.dorik.com/en/article/integromat-makecom-integration-on-custom-form-1ll0lrm/)).  
W praktyce: to jest najprostsza droga, gdy Twoje procesy są “polskie i niestandardowe”, bo Make spina praktycznie wszystko.

Automatyzacje przez Zapier
Jeśli pracujesz w ekosystemie Zapiera, Dorik ma dedykowany opis integracji pod Custom Form, również przez webhook ([Zapier + Custom Form](https://help.dorik.com/en/article/zapier-integration-custom-form-a386qs/)).  
W praktyce: Zapier jest wygodny, jeśli Twoje narzędzia to popularne SaaS-y i chcesz gotowe integracje bez dłubania.

Integracje mailingowe “po API”
Jeśli Twoim celem jest newsletter i segmentacja, Dorik ma gotowe ścieżki integracji dla Subscription Form, m.in. z:
Mailchimp ([Mailchimp](https://help.dorik.com/en/article/mailchimp-integration-subscription-form-1t06xhr/)),
GetResponse ([GetResponse](https://help.dorik.com/en/article/getresponse-integration-subscription-form-15wkm2p/)),
Brevo (dawniej Sendinblue) ([Brevo/Sendinblue](https://help.dorik.com/en/article/sendinblue-integration-subscription-form-mmjoz4/)).  
W praktyce: jeśli już masz listę w GetResponse/Brevo, to jest najszybsza, “bezpieczna” ścieżka, bo nie budujesz automatyzacji od zera.

## Szybki proces wdrożenia formularza, który nie wycieka leadów

Najlepszy układ jest prosty: najpierw dowiezienie, potem optymalizacja.

Najpierw dodaj formularz i zdefiniuj pola, które naprawdę są potrzebne. Jeśli zbierasz lead na usługę, często wystarczy imię, e-mail i jedno pole “Z czym przychodzisz?”. Każde dodatkowe pole to mniej wysłanych formularzy.

Potem podepnij wysyłkę. Jeśli Twoim “systemem” jest skrzynka mailowa, ustaw to najszybciej jak się da. Jeśli Twoim systemem jest CRM lub arkusz, idź od razu w Make.com albo Zapier, bo ręczne przepisywanie danych kończy się tym, że leady gniją.

Na końcu dodaj zgodę i higienę danych. Dorik da Ci pola i konfigurację formularza, ale to Ty odpowiadasz za sens: checkbox zgody marketingowej tylko tam, gdzie faktycznie robisz marketing, i jasna informacja, co stanie się z danymi.

## Płatności w Dorik: kiedy Payment Button wystarczy

Dorik ma element Payment Button i oficjalnie opisuje integrację z czterema platformami: Stripe, PayPal, Gumroad i Paddle ([Payment Button – integracje](https://help.dorik.com/en/article/integration-of-payment-button-12kgzpz/)).  

W praktyce Payment Button wygrywa w tych scenariuszach:
sprzedajesz konsultację, audit, usługę “z góry”, bilet, ebooka albo dostęp do czegoś i chcesz zapłaty bez stawiania sklepu.

Wniosek jest brutalnie prosty: jeśli Twoja oferta to jedna rzecz, Payment Button jest wystarczający. Jeśli Twoja oferta to katalog produktów i koszyk, to nie jest teren Dorik.

## Członkostwo i płatne treści: Stripe jako “silnik” paywalla

Jeśli sprzedajesz dostęp (treści, społeczność, materiały), Dorik ma membership z opcją płatnego członkostwa. Dorik opisuje model dostępu i “gated content” w przewodniku [Membership Feature](https://help.dorik.com/en/article/guide-to-the-membership-feature-for-your-clients-fpcbw3/), a płatności członkowskie podpinasz przez Stripe ([Stripe membership](https://help.dorik.com/en/article/integrate-stripe-membership-19tzyk4/)).

Dorik pozwala ustawić typ płatności jako cykliczny (miesięczny/roczny) albo jednorazowy w konfiguracji Stripe w panelu membership ([konfiguracja](https://help.dorik.com/en/article/membership-configuration-onsact/)).  
W praktyce: to jest sensowny zestaw do prostego paywalla i subskrypcji bez kupowania osobnej platformy członkowskiej.

## Najczęstsze błędy i jak ich nie powtórzyć

Najczęstszy błąd to mieszanie celów: ludzie próbują upchnąć w jednym formularzu lead, onboarding i ofertowanie. To zabija konwersję. W Dorik wygrywa prostota: osobny formularz do zapytań, osobny do zapisów, osobny do briefu.

Drugi błąd to “brak ścieżki po wysyłce”. Użytkownik wysyła formularz i… nic nie wie. Ustaw jasny komunikat, co będzie dalej (np. “odpiszemy w 24h”), i jeśli możesz, automatyzuj potwierdzenie w Twoim systemie mailowym/CRM.

Trzeci błąd to zbyt ambitna sprzedaż w Dorik, gdy tak naprawdę potrzebujesz checkoutu e-commerce. Dorik ma działać szybko i stabilnie w prostych scenariuszach. Jeśli dorzucasz koszyk “na siłę”, tracisz to, co w Dorik jest najlepsze: tempo.

## Podsumowanie i następny krok

Jeśli chcesz, żeby strona wreszcie zaczęła pracować na Ciebie, Dorik daje prostą receptę: formularz do leadów + automatyzacja do Twojego systemu + płatność przyciskiem albo membership na Stripe.

Następny krok: wybierz jeden cel strony (lead albo płatność), wdroż go dziś i dopiero potem rozbudowuj. Dorik jest świetny, gdy zaczynasz od działania, a nie od “idealnej architektury”.
