---
title: Standaryzacja UTM (nazewnictwo kampanii)
slug: utmy-standaryzacja
path: /artykuly/analityka/utmy-standaryzacja/
type: template
tags:
  - evergreen
  - analityka
  - utm
draft: true
date: '2025-11-05'
hero:
  heading: Standaryzacja UTM (nazewnictwo kampanii)
  subheading: Wpis roboczy — uzupełnij krótki opis, żeby nagłówek nie był pusty.
---

# Standaryzacja UTM (nazewnictwo kampanii)

Jeśli w raportach widzisz `facebook / cpc`, `fb / ads`, `MetaAds`, `meta_paid` – to znaczy, że przyda Ci się ten szablon.  
Celem jest prosty system UTM, który:

- każdy potrafi poprawnie uzupełnić,
- pozwala raportować **kanały, kampanie i kreacje** bez ręcznego sprzątania,
- działa zarówno dla stron usługowych, SaaS, jak i kampanii kursów.

---

## 1. 5 zasad sensownego używania UTM

1. **Bez spacji i polskich znaków**  
   Używamy `-` albo `_`: `newsletter_q1_2025`, `kurs-analytics_launch`.

2. **Stały słownik `utm_medium`**  
   Raz ustalone, niezmienne. Np.:
   - `cpc`, `paid_social`, `email`, `affiliate`, `display`, `social`, `referral`.

3. **`utm_source` = konkretna platforma / partner**
   - `google`, `meta`, `linkedin`, `newsletter`, `partner_xyz`.

4. **`utm_campaign` = cel + produkt + okres**
   - `leadgen_audit_2025q1`, `saas_pro_trial_2025`, `kurs_ga4_launch_kwiecien`.

5. **`utm_content` i `utm_term` – tylko gdy faktycznie używasz**
   - `utm_content`: wariant kreacji (`hero_a`, `video_ugly`, `copy_benefit`),
   - `utm_term`: fraza (głównie dla searcha) lub segment (np. `remarketing`).

---

## 2. Słownik `utm_medium`

Minimalny, ale stabilny zestaw:

| Medium        | Kiedy używać                                               |
| ------------- | ---------------------------------------------------------- |
| `cpc`         | płatne wyszukiwanie (Google Ads Search, Bing Ads)          |
| `paid_social` | płatne social (Meta Ads, LinkedIn Ads, TikTok Ads)         |
| `display`     | banery, programmatic, GDN bez search                       |
| `email`       | newslettery, kampanie mailowe                              |
| `social`      | organiczne social (posty, bio linki)                       |
| `affiliate`   | program partnerski, ref linki                              |
| `influencer`  | kampanie z twórcami, indywidualne linki                    |
| `referral`    | ręczne linki z innych stron/artykułów, gdzie masz kontrolę |
| `offline`     | QR kody, druk, prezentacje                                 |

---

## 3. Słownik `utm_source`

Standardowe źródła:

| Source       | Opis                        |
| ------------ | --------------------------- |
| `google`     | Google (search / display)   |
| `meta`       | Facebook + Instagram        |
| `linkedin`   | LinkedIn                    |
| `tiktok`     | TikTok                      |
| `newsletter` | Twój główny newsletter      |
| `beehiiv`    | jeśli masz osobną platformę |
| `youtube`    | linki z YouTube             |
| `partner_x`  | konkretni partnerzy         |

Zasada: **nie używaj 10 wariantów na tę samą platformę** (`facebook`, `fb`, `Meta`, `metaads`…), tylko jednego.

---

## 4. Wzór dla `utm_campaign`

Rekomendowany format:

`[typ_celu]-[produkt]-[okres]-[rynek opcjonalnie]`

Przykłady:

- `leadgen-audit-2025q1`,
- `acquisition-saaspro-2025`,
- `launch-kurs-analityka-2025-PL`,
- `retention-kursy-bundle-2025q2`.

Dzięki temu po samym `utm_campaign` wiesz:

- czy to kampania na nowe osoby (`acquisition`),
- co promujesz (`audit`, `saaspro`, `kurs-analityka`),
- w jakim okresie (łatwe filtrowanie kampanii historycznych).

---

## 5. `utm_content` i `utm_term`

**`utm_content`** – wariant kreacji / placement:

- `creative-video-testimonials`,
- `creative-static-benefits`,
- `hero-link`,
- `footer-link`,
- `sidebar-cta`.

**`utm_term`** – dla searcha: konkretna fraza lub grupa fraz:

- `crm_software`,
- `kurs_analityka_online`,
- `remarketing`, `competitor`, `brand`.

Jeśli nie masz procesu raportowania po `utm_content` i `utm_term` – lepiej używać ich rzadko, ale konsekwentnie, niż wszędzie „po trochu”.

---

## 6. Template arkusza UTM

Proste, ale skuteczne: jeden arkusz, w którym **każda kampania ma swój wiersz**.

| Kanał      | utm_source | utm_medium  | utm_campaign                  | utm_content                 | utm_term              | Landing page     | Właściciel | Status  |
| ---------- | ---------- | ----------- | ----------------------------- | --------------------------- | --------------------- | ---------------- | ---------- | ------- |
| Google Ads | google     | cpc         | acquisition-saaspro-2025      | headline_benefits           | crm_software          | /saas/           | Growth     | live    |
| Meta Ads   | meta       | paid_social | launch-kurs-analityka-2025-PL | creative-video-testimonials | kurs_analityka_online | /kurs/analityka/ | Marketing  | paused  |
| Newsletter | newsletter | email       | launch-kurs-analityka-2025-PL | newsletter-1-announcement   |                       | /kurs/analityka/ | Marketing  | planned |
| Partner X  | partner_x  | affiliate   | acquisition-audit-2025q1      | partner-landing             |                       | /audyt/          | BizDev     | live    |

Arkusz pełni rolę:

- **dokumentu referencyjnego** (każdy widzi, jak ma tagować kampanie),
- **listy inwentarzowej kampanii** (co jest live / planned / finished).

---

## 7. Gotowe reguły do przekazania zespołowi

Do skopiowania do wiki / Notion dla całego zespołu:

1. **Medium** wybieramy z listy: `cpc`, `paid_social`, `display`, `email`, `social`, `affiliate`, `influencer`, `referral`, `offline`.
2. **Source** = nazwa platformy / partnera (np. `google`, `meta`, `linkedin`, `newsletter`, `partner_xyz`).
3. **Campaign** = `[typ_celu]-[produkt]-[okres]`, np. `leadgen-audit-2025q1`.
4. **Content / Term** – używamy tylko wtedy, gdy będziemy raportować wyniki wg kreacji / fraz.
5. **Nie tworzymy nowych wartości medium / source bez wpisania ich do słownika** w tym dokumencie.

To jest mała rzecz, która po roku robi ogromną różnicę w jakości raportów.
