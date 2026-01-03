# Newsletter + Listmonk on Railway

This app integrates with Listmonk from server-side route handlers under `app/api/newsletter/*`.

## Required variables (Next.js service)

Set these on the **Next.js Railway service** (the service running this repo):

- `LISTMONK_BASE_URL` — the public URL of your Listmonk instance, without a trailing slash.
- `LISTMONK_API_TOKEN` — API credentials in the format `api_user:token` (sent as `Authorization: token api_user:token`).
- `LISTMONK_LIST_ID` — numeric list id (used when creating/updating subscribers).
- `LISTMONK_LIST_UUID` — list uuid (used in confirmation links).

Optional:

- `LISTMONK_TIMEOUT_MS` (default `10000`)
- `LISTMONK_RETRY_ATTEMPTS` (default `2`)
- `LISTMONK_RETRY_MIN_DELAY_MS` (default `250`)
- `LISTMONK_RETRY_MAX_DELAY_MS` (default `2000`)

## Required variables (Listmonk service)

Listmonk must listen on a public interface. In `config.toml` this is `[app].address = "0.0.0.0:9000"`.
Via env variables, the equivalent is `LISTMONK_app__address=0.0.0.0:9000`.

On Railway, also ensure the service binds to the port Railway routes to (depending on how you deploy Listmonk).

## Troubleshooting

- `?error=service-misconfigured`: usually a wrong/missing env var (`LISTMONK_*`), bad `LISTMONK_BASE_URL`, or invalid token/permissions.
- `?error=service-unavailable`: Listmonk is unreachable or returning 5xx.
- `?error=timeout`: Listmonk didn’t respond within `LISTMONK_TIMEOUT_MS`.

Check Railway logs for `Newsletter subscribe failed` / `Newsletter resend failed` / `Newsletter preferences failed` / `Newsletter unsubscribe failed`.
Avoid pasting tokens or passwords into logs or support chats; rotate leaked secrets immediately.

