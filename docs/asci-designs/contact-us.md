┌────────────────────────────────────────────────────────────────────────────┐
│ container │
│ H1 (mt:0 mb:s6): Kontakt │
│ FORM (grid, gap:s3, max 720px) │
│ • <label for="name">Imię i nazwisko</label> [input#name (44px)] │
│ • <label for="email">E‑mail</label> [input#email type="email" (44px)] │
│ • <label for="tel">Telefon (opcjonalnie)</label> [input#tel (44px)] │
│ • <label for="msg">Wiadomość</label> [textarea#msg min-height: s8] │
│ • [checkbox#rodo required] "Zgadzam się na przetwarzanie danych..." │
│ • [PRIMARY type="submit"] "Wyślij" │
│ Info (small, --muted): Odpowiadamy w 24h. Polityka prywatności → │
└────────────────────────────────────────────────────────────────────────────┘

Strona „Dziękujemy”:
┌────────────────────────────────────────────────────────────────────────────┐
│ H1: "Dziękujemy — wiadomość wysłana" │
│ P: "Odpowiemy do 24h. Zobacz w międzyczasie:" │
│ • 3 polecane artykuły (karty 3/2/1) │
│ CTA: [Powrót na stronę główną] │
└────────────────────────────────────────────────────────────────────────────┘
SEO: index dla /kontakt/, noindex dla /kontakt/dziekujemy/.
A11y: kompletne <label>, komunikaty walidacji aria-live="polite".
