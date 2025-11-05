# Content & Copy Guidelines

## Tone of Voice

- Pomocny, praktyczny, szybki, po polsku.
- Stosuj bezpośrednie zwroty "Ty" / "Twoja".
- Unikaj żargonu technicznego bez objaśnienia.

## CTAs

- Podstawowe: "Pobierz darmową paczkę", "Zobacz jak to działa", "Dołącz teraz".
- Warianty dla konsultacji: "Umów konsultację", "Zobacz terminy".

## SEO Essentials

- Każda strona: `title`, `description`, `og:title`, `og:description` w języku polskim.
- Dodaj `rel="sponsored"` do linków afiliacyjnych i notkę disclosure (`Alert` z variantem `warning`).
- Strukturalne dane (Product/Review) – wygenerować w kolejnych sprintach.

## Content Blocks

- FAQ: pytanie w `h3`, odpowiedź w `<p>`.
- Porównania: wstępny akapit, tabela, sekcja "Kto powinien wybrać".
- Tutoriale: meta-blok z czasem i trudnością, Stepper dla postępu, callouty `Alert`.

## Implementation Checklist

- Mapuj frontmatter -> hero copy, CTA, meta (TODO: frontmatter schema Section 8).
- Aktualizuj `content/` markdown po każdej zmianie copy.
- Utrzymuj listę CTA i tagline w `data/copy/global.json`.
