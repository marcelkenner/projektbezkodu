## AGENT: `app/api`

1. Route handlers must be implemented with the Next.js App Router (`export async function POST/GET`). Keep each handler under 200 lines and move reusable logic into `app/lib`.
2. Always parse `request.formData()` or `request.json()` inside the handler – **never** import client components or browser-only APIs here.
3. When redirecting after a mutation, use `NextResponse.redirect` and include explicit status/error query params so marketing pages can surface aria-live feedback.
4. All newsletter-related endpoints live in `app/api/newsletter/*` and must call `NewsletterManager` for business rules. Do not talk to Listmonk directly from route files.
5. Every handler must gracefully handle missing env vars by letting `getNewsletterConfig()` throw early. Catch `ListmonkError` and map it to user-friendly codes before redirecting.
6. Keep payloads small – we post simple form submissions, so avoid streaming large files or JSON bodies here.
