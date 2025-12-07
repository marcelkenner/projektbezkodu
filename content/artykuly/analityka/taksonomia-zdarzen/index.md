---
title: Taksonomia zdarzeń (słownik)
slug: taksonomia-zdarzen
path: /artykuly/analityka/taksonomia-zdarzen/
type: template
tags:
  - evergreen
  - analityka
draft: true
date: '2025-11-05'
hero:
  heading: Taksonomia zdarzeń (słownik)
  subheading: Wpis roboczy — uzupełnij krótki opis, żeby nagłówek nie był pusty.
---

# Taksonomia zdarzeń (słownik)

Dobra taksonomia zdarzeń to różnica między analityką, która naprawdę pomaga podejmować decyzje, a zbiorem losowych eventów o nazwach w stylu `klik123`.  
To jest Twój słownik – punkt odniesienia dla devów, marketerów i productu.

## Po co Ci taksonomia zdarzeń

- wszyscy mówią tym samym językiem („lead_qualified” znaczy to samo dla sales i marketingu),
- łatwiej migrować między narzędziami (GA4, Amplitude, Mixpanel, własne eventy w DB),
- można szybko dodać nowe eventy bez wymyślania nazwy za każdym razem,
- mniej śmieci w raportach („Button Click”, „btn_click”, „klik_przycisku” – to dalej jedno zachowanie, nie trzy).

Myślenie jest proste: **jedno zachowanie = jeden event biznesowy + parametry**, zamiast tysiąca lekko innych nazw.

---

## Zasady nazewnictwa (prosty system, który da się utrzymać)

Proponowany format:

`kategoria_akcja_kontekst`

**Zasady:**

1. **małe litery, bez polskich znaków**, separator: `_`  
   `form_submit_kontakt`, `cta_click_hero`, `video_play_lekcja`.

2. **kategoria** – typ elementu lub obszar:
   - `page`, `cta`, `form`, `video`, `pricing`, `nav`, `account`.

3. **akcja** – co faktycznie się dzieje:
   - `view`, `click`, `submit`, `start`, `complete`, `open`, `close`.

4. **kontekst** – gdzie / do czego:
   - `hero`, `footer`, `leadmagnet`, `plan_pro`, `checkout`, `lesson_1`.

5. **Parametry > kolejne eventy**  
   Zamiast mieć osobne eventy `cta_click_hero`, `cta_click_footer`, `cta_click_popup`,
   możesz mieć **jeden event** `cta_click` z parametrem `position = hero/footer/popup`.  
   Tu w słowniku decydujesz, gdzie kończy się nazwa eventu, a zaczynają parametry.

---

## Core eventy – fundament pod każdy projekt

Poniżej baza, na której zbudujesz własny słownik.

| Event                    | Opis                                                | Przykładowe parametry                        |
| ------------------------ | --------------------------------------------------- | -------------------------------------------- |
| `page_view`              | Wyświetlenie strony                                 | `path`, `title`, `template_type`             |
| `scroll_depth`           | Osiągnięcie progu scrolla                           | `percent`, `path`                            |
| `cta_click`              | Klik w kluczowe CTA                                 | `label`, `position`, `path`, `variant`       |
| `nav_click`              | Klik w nawigację                                    | `label`, `nav_type` (top/footer/mobile)      |
| `form_start`             | Użytkownik zaczął wypełniać formularz               | `form_id`, `path`                            |
| `form_submit`            | Wysłanie formularza                                 | `form_id`, `path`, `status` (success/error)  |
| `lead_created`           | Powstał lead (kontakt w CRM / marketing automation) | `source`, `medium`, `campaign`, `lead_type`  |
| `lead_qualified`         | Lead zakwalifikowany (SQL/MQL)                      | `qualification_stage`, `deal_value`          |
| `signup_start`           | Start rejestracji                                   | `plan_selected`, `source`                    |
| `signup_complete`        | Rejestracja zakończona                              | `plan`, `source`, `referrer`                 |
| `checkout_start`         | Start procesu zakupu                                | `cart_value`, `items_count`, `product_type`  |
| `checkout_complete`      | Ukończony zakup                                     | `order_value`, `items_count`, `product_type` |
| `subscription_started`   | Subskrypcja włączona                                | `plan`, `billing_cycle`                      |
| `subscription_cancelled` | Subskrypcja anulowana                               | `plan`, `tenure_days`, `reason`              |
| `feature_used`           | Użycie kluczowej funkcji (SaaS)                     | `feature_name`, `intensity`, `plan`          |
| `lesson_complete`        | Ukończenie lekcji (kurs)                            | `course_id`, `lesson_id`, `progress_percent` |
| `course_complete`        | Ukończenie kursu                                    | `course_id`, `completion_time_days`          |

---

## Eventy dla stron usługowych

Tu najważniejsza jest **droga od odwiedziny do rozmowy sprzedażowej**.

Minimalny zestaw:

- `cta_click` z `label = "Umów konsultację" / "Porozmawiajmy" / "Wyślij brief"`,
- `form_start` oraz `form_submit` dla formularzy kontaktowych i briefów,
- `call_click` / `whatsapp_click` / `mailto_click` – jeśli używasz klikanych danych kontaktowych,
- `file_download` – oferty PDF, case studies,
- `lead_created` + `lead_qualified` spięte z CRM.

Dzięki temu widzisz nie tylko ruch, ale **ile wartościowych rozmów** generuje każdy kanał i strona.

---

## Eventy dla SaaS

Tu celem nie jest tylko rejestracja, ale **aktywacja i retencja**.

Przydatny rdzeń:

- `signup_start`, `signup_complete`,
- `activation_event` – biznesowo zdefiniowany moment „użytkownik zaczął używać produktu sensownie”,
- `feature_used` – kilka kluczowych funkcji, które korelują z retencją,
- `subscription_started`, `subscription_upgraded`, `subscription_cancelled`,
- `invite_sent` / `user_added` – jeśli produkt jest zespołowy.

W słowniku koniecznie dopisz **definicję aktywacji** (np. „utworzył 1 projekt i zaprosił min. 1 członka zespołu”).

---

## Eventy dla kursów i szkoleń online

Tu liczy się zarówno **sprzedaż**, jak i **przerabianie materiału**.

Do słownika warto dodać:

- `webinar_register`, `webinar_attend` (live/odtworzenie),
- `checkout_start`, `checkout_complete` z `product_type = course/live/cohort`,
- `lesson_start`, `lesson_complete`, `video_play`, `video_50_percent`, `video_100_percent`,
- `course_complete`,
- `upsell_click`, `bundle_buy`.

To pozwala zbudować raport: **które kampanie sprzedają**, ale też **które kursy są faktycznie konsumowane**.

---

## Template słownika do skopiowania (Notion/Sheet)

Możesz skopiować ten układ jako „source of truth”:

| ID / Kod | Nazwa eventu        | Opis biznesowy                      | Parametry wymagane                        | Parametry opcjonalne           | Gdzie używany (typ strony/produktu) |
| -------- | ------------------- | ----------------------------------- | ----------------------------------------- | ------------------------------ | ----------------------------------- |
| EV001    | `page_view`         | Wejście na stronę                   | `path`, `title`                           | `template_type`                | wszystkie                           |
| EV010    | `cta_click`         | Klik w główne wezwanie do działania | `label`, `position`, `path`               | `variant`, `experiment_id`     | usługi, SaaS, kursy                 |
| EV020    | `form_submit`       | Wysłanie formularza                 | `form_id`, `path`, `status`               | `lead_type`, `source`          | usługi, leadgen                     |
| EV030    | `lead_created`      | Nowy lead w CRM / MA                | `lead_id`, `source`, `medium`, `campaign` | `lead_score`, `pipeline_stage` | usługi, B2B SaaS                    |
| EV040    | `signup_complete`   | Ukończenie rejestracji w aplikacji  | `user_id`, `plan`, `source`               | `referrer`, `utm_campaign`     | SaaS                                |
| EV050    | `activation_event`  | Użytkownik osiągnął stan „aktywny”  | `user_id`, `activation_type`              | `time_to_activation_days`      | SaaS                                |
| EV060    | `checkout_complete` | Zakończony zakup                    | `order_id`, `order_value`, `product_type` | `coupon`, `items_count`        | kursy, SaaS, produkty cyfrowe       |
| EV070    | `lesson_complete`   | Ukończona lekcja                    | `course_id`, `lesson_id`, `user_id`       | `progress_percent`             | kursy                               |

Dopisz kolejne wiersze zamiast tworzyć kolejne „kreacje” eventów w kodzie „na czuja”.  
Ten słownik to dokument, który powinien przeżyć kilka redesignów i kilka zmian narzędzi analitycznych.
