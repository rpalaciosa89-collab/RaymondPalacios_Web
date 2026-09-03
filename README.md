# raymondpalacios.tech

Static-first personal website built with semantic HTML5, modern CSS, and vanilla JavaScript. No frontend framework or hydration layer is required.

## Architecture

```text
public content JSON ──> script.js ──> enhanced EN/ES UI
canonical English HTML ────────────> readable fallback without JS
project gate/contact form ──POST──> api/*.js ──> Supabase PostgreSQL
                                      └─────────> Resend email notification
private-content/projects/* ───────> project-access serverless function only
```

## File map

- `index.html` — semantic one-page interface, public forms and accessible dialog.
- `style.css` — tokens, layout, components, motion, responsive and accessibility.
- `script.js` — language, navigation, project rendering, forms, consent and deferred Three.js.
- `content/` — editable public bilingual content.
- `private-content/` — expanded project cases; excluded from the static build.
- `api/` — serverless endpoints; server secrets only.
- `database/migrations/` — PostgreSQL schema, indexes, RLS and rate-limiter function.
- `scripts/` — development, validation, static checks, build and source audit.
- `tests/` — dependency-free Node tests.
- `MAINTENANCE.md` — operational procedures.
- `PRODUCTION_CHECKLIST.md` — unresolved launch requirements.

## Local development

Requirements: Node 20.

```bash
npm ci
npm run validate
npm run check
npm run dev
```

Open `http://localhost:8080`.

The local static server does **not** emulate `/api/*`. Use your serverless provider's local tooling or test mocks for end-to-end form testing.

## Build

```bash
npm run build
npm run preview
```

`dist/` contains only public static files. `private-content/`, serverless source, database migrations and secrets are deliberately excluded.

## Three.js

The hero dynamically imports pinned Three.js `0.179.1` from cdnjs only when the engine nears the viewport. If WebGL, the network, the import, or motion preferences prevent loading, the CSS fallback remains complete. Update the pinned URL only after preview/testing.

## CONFIGURACIÓN EDITABLE

Public values are centralized in `SITE_CONFIG` at the top of `script.js`:

- contact email
- LinkedIn
- GitHub
- résumé path
- API paths
- privacy-notice version
- 3D feature flag

Do not place private credentials there.

## Backend setup

1. Create a Supabase PostgreSQL project.
2. Run `database/migrations/001_initial.sql` with a privileged role.
3. Set server-only variables from `.env.example` in the hosting provider.
4. Configure a verified sender with Resend (or adapt `sendEmail()` to another provider).
5. Confirm `ALLOWED_ORIGINS`, the professional inbox, and all token secrets.
6. Deploy the static `dist/` output plus serverless `api/` functions.
7. Test valid and invalid forms, rate limits, database outage, email outage, and public read denial.

## Security model

The browser never receives the Supabase service role key. Public database roles have no table read/list/update/delete permission. Form writes go through serverless endpoints, which validate input, enforce origin, apply a DB-backed rate limit using a one-way HMAC anti-abuse key, and use the service role only server-side.

The project-access gate is **not** document security. It records professional interest and unlocks non-confidential expanded content. Confidential material requires proper authentication or signed delivery.

## Privacy

The included privacy text is explicitly a technical draft, not final legal advice. Before production, verify applicable Peru data-protection obligations and any GDPR obligations for European audiences, define retention, confirm the controller/contact channel, and determine whether a Peruvian personal-data bank registration is required.
