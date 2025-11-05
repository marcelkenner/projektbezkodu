# Style & Conventions

- Follow `AGENTS.md` directives: mobile-first design, strict file/class/function size limits (files <500 lines, classes <200, functions <40), apply OOP thinking with dedicated classes/managers/viewmodels as per manager/coordinator patterns.
- Naming must be descriptive and intention-revealing; avoid generic names. Split responsibilities aggressively (single-responsibility principle, avoid god objects).
- Use composition, dependency injection patterns, and keep code modular and reusable.
- Prefer ASCII-only edits unless file already uses other characters. Add succinct comments only when necessary for complex logic.
- Frontend architecture: Next.js App Router with Tailwind v4 tokens; maintain SEO/metadata, mobile-first layout, and ensure pages adhere to brand system tokens once implemented.
- Keep brand assets/tokens in `/brand/`, and document updates in changelog; governance documents in `docs/brand*` must stay in sync with implementation.
