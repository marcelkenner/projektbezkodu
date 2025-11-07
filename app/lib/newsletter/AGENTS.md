## AGENT: `app/lib/newsletter`

1. This folder is **server-only** – each module must start with `import "server-only";` to prevent bundling into the client.
2. `config.ts` is the single source of truth for required env vars:
   - `LISTMONK_BASE_URL`, `LISTMONK_API_TOKEN`, `LISTMONK_LIST_ID`, `LISTMONK_LIST_UUID`, `LISTMONK_TIMEOUT_MS`.
   - Throw immediately if any value is missing so CI/Next builds fail fast.
3. `ListmonkClient` wraps all HTTP calls. When adding endpoints, expose a typed method here rather than calling `fetch` elsewhere.
4. `NewsletterManager` is the only entry point consumed by API routes and pages. Extend it with new high-level actions (subscribe, resend, update preferences, unsubscribe) and keep side effects isolated here.
5. Track UX-related cookies through `cookies.ts`. Any new cookie must expose typed parse/serialize helpers with secure defaults (httpOnly, sameSite=lax, respect NODE_ENV for `secure`).
6. Maintain DTO types (`types.ts`) in this directory and reuse them everywhere to keep API contracts explicit.
