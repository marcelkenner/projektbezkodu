## AGENT: `app/(marketing)/newsletter`

1. These are **pure UI** pages. They must remain server components that render copy from `data/copy/newsletter.json` via `getCopy("newsletter")` and **never** call Listmonk directly.
2. All forms post to `/api/newsletter/*` routes:
   - Landing + homepage CTA ➝ `/api/newsletter/subscribe`
   - Confirm resend button ➝ `/api/newsletter/resend`
   - Preferences ➝ `/api/newsletter/preferences`
   - Unsubscribe ➝ `/api/newsletter/unsubscribe`
3. Every page needs aria-live status paragraphs to read `?status=` and `?error=` query params exposed by the API redirects.
4. Keep components mobile-first and under 200 lines per file. Shared styles belong in `newsletter.module.css`.
5. When surface messages change, update `data/copy/newsletter.json` first—never hardcode copy inside components.
6. Strictly separate responsibilities:
   - Layout/markup lives here.
   - Business logic stays inside `NewsletterManager`.
   - Cookies and cooldown timers go through `ResendButton` and helpers from `app/lib/newsletter/cookies`.
