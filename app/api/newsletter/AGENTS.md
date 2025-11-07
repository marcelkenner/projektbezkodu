## AGENT: `app/api/newsletter`

1. This folder owns all routes that proxy form submissions to Listmonk. Handlers must stay thin: validate form inputs, invoke `NewsletterManager`, set cookies, and redirect.
2. Expected routes:
   - `POST /api/newsletter/subscribe` – accepts `email` + `consent`, writes the subscriber cookie, and redirects to `/newsletter/potwierdz/`.
   - `POST /api/newsletter/resend` – reads subscriber cookie, enforces resend cooldown via `NEWSLETTER_RESEND_COOKIE`, and redirects back to the confirm page.
   - `POST /api/newsletter/preferences` – requires hidden `subscriberUuid` + `topics[]`. Redirects to `/newsletter/preferencje`.
   - `POST /api/newsletter/unsubscribe` – requires `subscriberUuid`, optional `feedback`. Redirects to `/newsletter/wypisz`.
3. Cookies:
   - Always use helpers from `app/lib/newsletter/cookies` to read/write subscriber + resend cookies. Do not manipulate raw strings.
4. Errors:
   - Catch `ListmonkError` and map to short string codes (`invalid-email`, `listmonk-error`, `missing-subscriber`, etc). Redirects must include `?error=<code>` so UI can show aria-live messages.
5. Never mutate UI copy in these handlers. All text lives in JSON copy; these files are purely orchestration.
