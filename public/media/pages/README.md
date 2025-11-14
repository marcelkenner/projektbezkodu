# public/media/pages

Assets for React-managed pages (those without markdown).

- Mirror the route path relative to `app/`. Example: `app/(marketing)/o-nas/page.tsx` → `/media/pages/(marketing)/o-nas/hero.webp`.
- Use absolute `/media/pages/...` URLs inside JSX so the build can fingerprint/cdn-cache correctly.
- Keep images optimized (WebP/SVG) and under repo limits.
