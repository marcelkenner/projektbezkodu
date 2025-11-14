## A. Brand foundations

**Working brand name**

**ProjektBezKodu** (alternates: StudioNoCode, WebDesignPoPolsku)

**Positioning**

The Polish, step‑by‑step library of **no‑code website templates, components, and tutorials**-with practical SEO & performance guidance.

**Audience**

Freelancers, micro‑businesses, students in creative fields in Poland who want a pro website **without code**-fast.

**Value proposition**

- Get online **this weekend** with beautiful, proven layouts.
- Learn **po polsku** with clear, friendly tutorials.
- Build **fast, accessible** sites that rank and load quickly.

**Brand attributes**

Helpful · Clear · Practical · Quick · Polish‑first · Trustworthy

**Tagline options (PL)**

- „Profesjonalne strony **no-code** – po polsku.”
- „Szablony. Tutoriale. **Gotowa strona w 1 dzień**.”

---

## C. Color system (WCAG‑aware)

**Core palette (digital)**

| Role        | Token          | Hex         | Notes                                                          |
| ----------- | -------------- | ----------- | -------------------------------------------------------------- |
| Primary 700 | `--indigo-700` | **#4338CA** | AAA with white on solid fills; accessible text color on white. |
| Primary 600 | `--indigo-600` | **#4F46E5** | AA with white; primary link on white (ratio 6.29:1).           |
| Primary 500 | `--indigo-500` | **#6366F1** | Use for hovers/tints (not small white text).                   |
| Mint 700    | `--mint-700`   | **#047857** | Use with **white** text on solid.                              |
| Mint 600    | `--mint-600`   | **#059669** | Use with **ink (gray‑900)** text on solid.                     |
| Orange 700  | `--orange-700` | **#C2410C** | Use with **white** text on solid.                              |
| Orange 600  | `--orange-600` | **#EA580C** | Use with **ink** text on solid.                                |
| Ink         | `--gray-900`   | **#111827** | Primary body text.                                             |
| Slate       | `--gray-700`   | **#374151** | Secondary text.                                                |
| Border      | `--gray-300`   | **#D1D5DB** | UI borders, dividers.                                          |
| Surface     | `--gray-50`    | **#F9FAFB** | Light surface.                                                 |
| Base        | `--white`      | **#FFFFFF** | Base background.                                               |

**Semantic variants**

- **Success**: `-success-700 #047857` (white text), tints with `-success-50` via opacity.
- **Info**: `-info-700 #1D4ED8` (white text), hover `-info-600 #2563EB`.
- **Warning**: `-warning-700 #B45309` (white text) or `-warning-600 #D97706` (ink text).
- **Danger**: `-danger-700 #B91C1C` (white text), hover `-danger-600 #DC2626`.

**Accessibility pairings (small text)**

- **White on** indigo‑600/700/800 → ✅ (≥ AA).
- **White on** mint‑700/orange‑700 → ✅ (≥ AA).
- **Ink (#111827) on** mint‑600/orange‑600 → ✅ (≥ AA).
- **Avoid** white on mint‑600/orange‑600 for small text.

**Proportions (typical page)**

60–70% neutrals · 20–30% primary indigo accents · 5–10% mint/orange highlights.

**Brand gradient (for hero bands, not text)**

`linear-gradient(135deg, #4F46E5 0%, #2563EB 45%, #059669 100%)`

---

## D. Typography

**Principles**: fast to load, Polish diacritics, high legibility.

**Option 1 – Lean (performance‑first)**

- **Family:** System UI stack
  `font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, Helvetica, Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji";`

**Option 2 – Expressive (still light)**

- **Headings/UI:** **Space Grotesk** 500/700 (self-hosted `.woff2` from `/public/fonts/SpaceGrotesk-LatinExt-500-700.woff2`) – geometric/tech tone that matches automation, hero stats, pricing tiles.
- **Body/UI copy:** **Inter** 400/500/600 (self-hosted `.woff2` from `/public/fonts/Inter-LatinExt-roman.woff2`) – tall x-height built for dense UI, forms, and paragraphs.
  Both ship under the SIL Open Font License, keep latin-ext coverage for Polish diacritics, and are loaded with `next/font/local` using `display: "swap"` so no Google Fonts round-trips remain on critical paths.

**Polish readability defaults**

- Global body styles enable `text-rendering: optimizeLegibility`, `hyphens: auto`, `word-wrap: break-word`, and `-webkit-font-smoothing: antialiased` so Polish diacritics render crisply.
- Use `main[data-readable="true"]` or the `.pbk-readable` helper (see `app/globals.readability.css`) to clamp copy-heavy layouts to 68 ch with responsive padding while keeping marketing sections full width.
- Navigation links, CTA buttons, helper text, and metric stats inherit dedicated typography helpers in `app/globals.readability.css` so UI text sticks to Inter 500 semantics and headings stay in Space Grotesk 700.

**Type scale (fluid, major third ~1.25)**

Use `clamp` for responsive sizes; example defaults:

| Token          | Desktop | Mobile | Usage          |
| -------------- | ------- | ------ | -------------- |
| `--fs-display` | 48/56   | 34/40  | Landing hero   |
| `--fs-h1`      | 40/48   | 28/36  | Page titles    |
| `--fs-h2`      | 32/40   | 24/32  | Section titles |
| `--fs-h3`      | 24/30   | 18/24  | Subheads       |
| `--fs-body`    | 18/28   | 16/26  | Paragraphs     |
| `--fs-small`   | 14/22   | 14/22  | Meta, captions |
| `--fs-mono`    | 14/22   | 14/22  | Code/labels    |

**Weights**: 700 (bold), 600 (semibold), 500 (medium), 400 (regular).

**Line length**: 45–75 characters.

**Line height**: 1.6 default body (range 1.5–1.7 for longer copy), 1.2–1.3 for headings.

**Link style**: indigo‑600 default → indigo‑700 hover → underline on hover or always in body copy.

---

## E. Grid, spacing, radii, elevation

**Grid**

- **Container widths**: 640 / 768 / 1024 / 1280 / 1440 px.
- **Columns**: 12‑col (desktop), 6‑col (tablet), 4‑col (mobile).
- **Gutters**: 24 px desktop/tablet, 16 px mobile.

**Spacing rhythm (fluid u = 8px)**

Tokens `--space-1..--space-9` clamp between mobile and desktop targets:

- `--space-1`: 0.25–0.5rem (light adjacency)
- `--space-2`: 0.5–1rem (default flow)
- `--space-3`: 0.75–1.25rem (paragraph separation)
- `--space-4`: 1–1.5rem (heading adjacency)
- `--space-5`: 1.5–2rem (component padding)
- `--space-6`: 2–3rem (section joints)
- `--space-7`: 3–4rem (major section prelude)
- `--space-8`: 4–6rem (hero padding)
- `--space-9`: 6–9rem (campaign and hero breathing room)

Apply margin-top for content flow (headings receive more space before than after); heavy blocks (quotes, code, figures, callouts) use `--space-4` above and `--space-3` internal padding.

**Radii**

- `-radius-1: 6px` · `-radius-2: 12px` · `-radius-3: 20px` · `-radius-round: 999px`.
- **Default UI**: 12 px; **pills/buttons**: round.

**Shadows (elevation)**

- `-elev-1`: subtle card `0 1px 2px rgba(2,6,23,.06)`
- `-elev-2`: raised `0 1px 2px rgba(2,6,23,.06), 0 2px 6px rgba(2,6,23,.06)`
- `-elev-3`: popover `0 12px 24px -12px rgba(2,6,23,.18)`

---

## F. Iconography & illustration

**Icons**: Open‑source **Lucide** or **Tabler** for stroke icons.

- Stroke: 1.75 px; rounded caps/joins; corner radius consistent with UI radii.
- Sizes: 16/20/24/32 px (optical alignment to text).
- Color: Slate (`gray-700`) on light; **white** on indigo‑700; do not use mixed hues inside one icon.

**Illustrations**: Minimal, geometric blocks + subtle gradient; avoid skeuomorphism.

**Photography**: Polish context, clean light, generous negative space for overlays; “before/after” frames for Pinterest/YouTube thumbnails.

---

## G. Voice & tone (PL)

**Voice**: „życzliwy instruktor” – konkretnie, po polsku, bez żargonu.

**Tone by context**

- **Tutorial**: spokojny, krok‑po‑kroku, krótkie zdania.
- **Sprzedaż**: rzeczowy, z wynikami („zbudujesz stronę w 2 godziny”).
- **Wsparcie**: empatyczny, oferuj szybkie rozwiązanie + link do tutorialu.

**Style**

- Używaj 2. osoby („zrobisz”, „kliknij”).
- Jedno zdanie = jedna myśl.
- Lista kroków z czasem i efektem.

**Microcopy (PL)**

- CTA: „Pobierz szablon”, „Zbuduj w Webflow”, „Otwórz tutorial”.
- Formularz: „Podaj e‑mail, wyślemy paczkę szablonów.”
- Błędy: „Coś poszło nie tak. Spróbuj ponownie lub napisz do nas.”

---

## H. Core UI components (web)

**Buttons**

- **Primary**: indigo‑700 background, **white** text, hover indigo‑800, focus visible ring mint‑600.
- **Secondary**: outline indigo‑700, text indigo‑700; hover `bg-indigo-50`.
- **Subtle**: surface background (`gray-100`), ink text; hover `gray-200`.
- **Danger**: danger‑700 background, white text.

**Form elements**

- Inputs: 1 px `gray-300`, radius 8 px; focus 2 px ring `#059669` (offset 2 px) + border indigo‑600.
- Error text: danger‑700; help text: slate (`gray-700`) 14 px.

**Navigation**

- Sticky top, 64 px height; logo left, primary CTA right.
- Active link: underline + indigo‑700.

**Cards**

- Surface `white`; border `gray-200`; shadow `-elev-1`; 16–24 px padding.

**Alerts**

- Info: `info-50` tint + border `info-600` + icon `info-700`.
- Success / Warning / Danger follow same pattern.

---

## I. Motion

- **Durations**: 120 ms (snappy), 180–240 ms (UI), 320 ms (overlays).
- **Easing**: ease‑out `cubic-bezier(.2,0,0,1)`, enter; ease‑in for exits `(.4,0,1,1)`.
- **Rules**: never animate color contrast; respect `prefers-reduced-motion`.

---

## J. Accessibility

- **Contrast**: body text ≥ 4.5:1; large text ≥ 3:1 (see pairings above).
- **Focus**: visible **always**; 2 px ring in mint‑600 with 2 px offset.
- **A11y for media**: alt text, captions on YT, transcripts for workshops.
- **Forms**: explicit labels, error messaging tied via `aria-describedby`.

---

## K. Social, video, and OG templates

**Open Graph**

- 1200×630 (1.91:1).
- Layout: left text block on indigo gradient; right “block & spark” motif; logo top‑left; URL bottom‑left.

**YouTube**

- Thumbnail 1280×720; bold H1 (3–5 words), high‑contrast, “przed/po” side‑by‑side.
- Lower‑third overlay: pill with mint‑600 background, ink text.

**Pinterest**

- 1000×1500 and 1080×1920; 5–7‑slide carousel; step numbers in indigo‑700 circles.

**Social post color rules**

- Text on photo: add 40–60% **indigo** overlay; always white text, ≥ AA contrast.

---

## L. Email & docs

**Newsletter**

- One‑column, 640 px max; H1 28/36; body 16/26.
- CTA primary button indigo‑700; footer with address + unsubscribe.

**Workshop deck**

- 16:9; H1 slide with gradient; content slides 4× baseline grid; code panels monospaced 14/22 on `gray-900` background with white text (≥ AAA).

---

## M. Brand tokens (ready for code)

**1) CSS custom properties (light + dark)**

```css
:root {
  /* Colors */
  --indigo-700: #4338ca;
  --indigo-600: #4f46e5;
  --indigo-500: #6366f1;
  --mint-700: #047857;
  --mint-600: #059669;
  --orange-700: #c2410c;
  --orange-600: #ea580c;
  --gray-900: #111827;
  --gray-700: #374151;
  --gray-300: #d1d5db;
  --gray-200: #e5e7eb;
  --gray-100: #f3f4f6;
  --gray-50: #f9fafb;
  --white: #ffffff;

  /* Semantic */
  --success-700: #047857;
  --info-700: #1d4ed8;
  --warning-700: #b45309;
  --danger-700: #b91c1c;

  /* Typography */
  --ff-sans:
    "Space Grotesk", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    Inter, Roboto, "Noto Sans", Arial, "Apple Color Emoji", "Segoe UI Emoji";
  --ff-body:
    "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto,
    "Noto Sans", Arial;

  --fs-display: clamp(2.125rem, 1.2rem + 2.3vw, 3rem);
  --fs-h1: clamp(2rem, 1.2rem + 3vw, 3rem);
  --fs-h2: clamp(1.5rem, 1rem + 2vw, 2.25rem);
  --fs-h3: clamp(1.125rem, 0.95rem + 0.6vw, 1.5rem);
  --fs-body: clamp(1rem, 0.95rem + 0.3vw, 1.125rem);
  --fs-small: 0.875rem;
  --lh-body: 1.6;

  /* Spacing (fluid clamps) */
  --space-1: clamp(0.25rem, 0.18rem + 0.3vw, 0.5rem);
  --space-2: clamp(0.5rem, 0.35rem + 0.6vw, 1rem);
  --space-3: clamp(0.75rem, 0.6rem + 0.6vw, 1.25rem);
  --space-4: clamp(1rem, 0.7rem + 1vw, 1.5rem);
  --space-5: clamp(1.5rem, 1.1rem + 1.5vw, 2rem);
  --space-6: clamp(2rem, 1.6rem + 2vw, 3rem);
  --space-7: clamp(3rem, 2.4rem + 3vw, 4rem);
  --space-8: clamp(4rem, 3.2rem + 4vw, 6rem);
  --space-9: clamp(6rem, 4.8rem + 6vw, 9rem);

  /* Radius & elevation */
  --radius-1: 6px;
  --radius-2: 12px;
  --radius-3: 20px;
  --radius-round: 999px;
  --elev-1: 0 1px 2px rgba(2, 6, 23, 0.06);
  --elev-2: 0 1px 2px rgba(2, 6, 23, 0.06), 0 2px 6px rgba(2, 6, 23, 0.06);
  --elev-3: 0 12px 24px -12px rgba(2, 6, 23, 0.18);

  /* Focus & motion */
  --focus: 0 0 0 2px #0369a1, 0 0 0 4px rgba(3, 105, 161, 0.2);
  --ease-out: cubic-bezier(0.2, 0, 0, 1);
  --t-quick: 120ms;
  --t-ui: 180ms;
  --t-slow: 320ms;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --surface: #0b1220;
    --base: #0b1220;
    --text: #f9fafb;
    --muted: #d1d5db;
    /* Optional: slightly brighter indigo for dark backgrounds */
  }
}
```

**2) Example component CSS**

```css
body {
  font-family: var(--ff-body);
  font-size: var(--fs-body);
  line-height: var(--lh-body);
  color: var(--gray-900);
  background: var(--white);
}
h1,
h2,
h3 {
  font-family: var(--ff-sans);
  font-weight: 700;
  letter-spacing: -0.01em;
}
h1 {
  font-size: var(--fs-h1);
}
h2 {
  font-size: var(--fs-h2);
}
h3 {
  font-size: var(--fs-h3);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-round);
  font-weight: 600;
  transition:
    background var(--t-ui) var(--ease-out),
    box-shadow var(--t-ui) var(--ease-out);
}
.btn:focus-visible {
  outline: none;
  box-shadow: var(--focus);
}
.btn-primary {
  background: var(--indigo-700);
  color: #fff;
}
.btn-primary:hover {
  background: #3730a3;
}
.btn-secondary {
  border: 1px solid var(--indigo-700);
  color: var(--indigo-700);
  background: transparent;
}
.btn-secondary:hover {
  background: #eef2ff;
}
.input {
  width: 100%;
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-2);
  padding: 0.625rem 0.75rem;
  background: #fff;
}
.input:focus {
  outline: none;
  box-shadow: var(--focus);
  border-color: var(--indigo-600);
}
.card {
  background: #fff;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-2);
  box-shadow: var(--elev-1);
  padding: var(--space-7);
}
```

**3) JSON design tokens (starter)**

```json
{
  "color": {
    "brand": {
      "indigo": { "700": "#4338CA", "600": "#4F46E5", "500": "#6366F1" }
    },
    "accent": {
      "mint": { "700": "#047857", "600": "#059669" },
      "orange": { "700": "#C2410C", "600": "#EA580C" }
    },
    "gray": {
      "900": "#111827",
      "700": "#374151",
      "300": "#D1D5DB",
      "200": "#E5E7EB",
      "100": "#F3F4F6",
      "50": "#F9FAFB"
    },
    "semantic": {
      "info700": "#1D4ED8",
      "success700": "#047857",
      "warning700": "#B45309",
      "danger700": "#B91C1C"
    }
  },
  "font": {
    "sans": "Space Grotesk, system-ui, -apple-system, BlinkMacSystemFont",
    "body": "Inter, ui-sans-serif, system-ui"
  },
  "size": {
    "font": {
      "display": "clamp(2.125rem,1.2rem+2.3vw,3rem)",
      "h1": "clamp(1.75rem,1.1rem+1.8vw,2.5rem)",
      "h2": "clamp(1.5rem,1rem+1.5vw,2rem)",
      "h3": "clamp(1.125rem,.95rem+0.6vw,1.5rem)",
      "body": "1rem",
      "small": "0.875rem"
    },
    "radius": { "1": "4px", "2": "8px", "3": "12px", "round": "999px" },
    "space": {
      "1": "2px",
      "2": "4px",
      "3": "8px",
      "4": "12px",
      "5": "16px",
      "6": "24px",
      "7": "32px",
      "8": "40px",
      "9": "48px",
      "10": "64px"
    }
  },
  "shadow": {
    "1": "0 1px 2px rgba(17,24,39,.06),0 1px 1px rgba(17,24,39,.04)",
    "2": "0 6px 12px rgba(17,24,39,.08),0 2px 4px rgba(17,24,39,.06)",
    "3": "0 14px 32px rgba(17,24,39,.12)"
  }
}
```

**4) Tailwind theme snippet (optional)**

```jsx
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        indigo: { 700: "#4338CA", 600: "#4F46E5", 500: "#6366F1" },
        mint: { 700: "#047857", 600: "#059669" },
        orange: { 700: "#C2410C", 600: "#EA580C" },
        gray: {
          900: "#111827",
          700: "#374151",
          300: "#D1D5DB",
          200: "#E5E7EB",
          100: "#F3F4F6",
          50: "#F9FAFB",
        },
      },
      borderRadius: { brand: "8px", pill: "999px" },
      boxShadow: {
        "brand-1": "0 1px 2px rgba(17,24,39,.06),0 1px 1px rgba(17,24,39,.04)",
        "brand-2": "0 6px 12px rgba(17,24,39,.08),0 2px 4px rgba(17,24,39,.06)",
      },
      fontFamily: {
        sans: [
          "Space Grotesk",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
        ],
        body: ["Inter", "system-ui", "-apple-system"],
      },
    },
  },
};
```

---

## N. Favicon & app icons

- Favicon: 16×16, 32×32 (PNG) + **SVG** (preferred).
- Apple Touch Icon: 180×180.
- PWA maskable: 512×512, background indigo‑700, mark centered.
- `theme-color`: `#4338CA`.

---

## O. Print assets (starter specs)

- **Business card** 85×55 mm, 3 mm bleed. Front: mark top‑left, name in indigo‑700; back: gradient with white logo.
- **Letterhead** A4, 12‑col grid, 24 px margins; watermark 4% opacity mark bottom‑right.
- **Roll‑up** 85×200 cm: hero headline, large mark, short CTA.

---

## P. Content patterns & components for the site

**Homepage hero**

- H1 (max 48 ch), supporting sentence, primary CTA (indigo‑700), secondary outline CTA, trust bar (logos of tools you discuss-without implying endorsement).
- Visual: before/after card or 3‑step „zbuduj” diagram.

**Template page**

- Above the fold: name, thumbnail GIF (10–15 s), 2 CTAs: „Pobierz darmowy” + „Zbuduj w Webflow” (/go/webflow).
- Sections: co w środku (list), wymagania, performance checklist, zastosowania, FAQ.

**Tutorial page**

- Progress steps, estimated time, difficulty; sticky table of contents; code/notes blocks.

**Comparison page**

- Feature table (left‑aligned), price ladder, who should choose, affiliate CTAs.

---

## Q. Brand governance

- **One source of truth**: `/brand/` in repo + Figma library „ProjektBezKodu Brand”.
- **Versioning**: semantic (`v1.0.0`), changelog on brand site.
- **Approvals**: visual changes require before/after screenshots + accessibility check (contrast & focus).

---

## R. File & library structure (Figma + repo)

**Figma pages**

1. **Foundations** (colors, type, grid, tokens)
2. **Logos** (clear space, lockups, misuses)
3. **Components Web** (buttons, forms, nav, cards, alerts, modals)
4. **Social & Thumbnails** (Pinterest/YT/OG templates)
5. **Print** (card, letterhead, roll‑up)
6. **Workshop Deck** (master slides)

**Repo**

```
/brand
  /logo/mark.svg
  /logo/lockup-horizontal.svg
  /icons/favicon.svg
  /icons/favicon-32.png
  /icons/apple-touch-icon.png
  /pwa/maskable-512.png
  tokens.css
  tokens.json
  README.md (how to use)

```

---

## S. Do/Don’t quick list

**Do**

- Keep text/background contrast per rules above.
- Use indigo‑700 for actions; mint/orange as supportive highlights.
- Keep rounded 8 px radius and soft shadows.

**Don’t**

- Put small white text on mint‑600 or orange‑600.
- Mix more than two accent colors on one component.
- Use more than two fonts.

---

## T. Launch‑ready snippets

**Fonts via `next/font/local`**

```ts
import localFont from "next/font/local";

export const inter = localFont({
  src: [
    {
      path: "../../public/fonts/Inter-LatinExt-roman.woff2",
      weight: "400 600",
      style: "normal",
    },
  ],
  variable: "--font-body",
  display: "swap",
});

export const spaceGrotesk = localFont({
  src: [
    {
      path: "../../public/fonts/SpaceGrotesk-LatinExt-500-700.woff2",
      weight: "500 700",
      style: "normal",
    },
  ],
  variable: "--font-heading",
  display: "swap",
});
```

Keep `<html lang="pl">` in `app/layout.tsx` and `<meta name="theme-color" content="#4338CA" />` inside the exported `viewport` for correct PWA theming and Polish hyphenation defaults.

**Accessible link & focus**

```css
a {
  color: var(--indigo-600);
  text-underline-offset: 2px;
}
a:hover {
  color: var(--indigo-700);
  text-decoration: underline;
}
:focus-visible {
  outline: none;
  box-shadow: var(--focus);
}
```

**Alert component (info example)**

```html
<div class="alert" role="status" aria-live="polite">
  <svg aria-hidden="true" width="20" height="20">...</svg>
  <div><strong>Porada:</strong> Użyj AVIF/WebP dla obrazów.</div>
</div>
```

```css
.alert {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 8px;
  background: #eff6ff;
  border: 1px solid #2563eb;
  color: #1d4ed8;
}
```

---

## U. Example brand copy (PL)

**Homepage H1**

„Zbuduj **profesjonalną stronę no-code** – krok po kroku po polsku.”

**Support**

„Pobierz gotowe szablony i przejdź przez tutorial – od szkicu do publikacji w 2 godziny.”

**CTA**

„Pobierz darmową paczkę” · „Zobacz jak to działa”
