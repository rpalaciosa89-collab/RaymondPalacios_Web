# MAINTENANCE.md

| Frequent task | Edit / operate here |
|---|---|
| Update English copy | `content/site.en.json` |
| Update Spanish copy | `content/site.es.json` |
| Add/reorder/hide public projects | `content/projects.json` |
| Edit expanded project case (EN/ES) | `content/projects.json` → `detail.<lang>` |
| Change project status | `content/projects.json` |
| Replace résumé | `assets/documents/` + `SITE_CONFIG.links.resume` in `script.js` |
| Change email / LinkedIn / GitHub | `SITE_CONFIG.links` in `script.js` |
| Configure receiving inbox | hosting secret `CONTACT_TO_EMAIL` |
| Change privacy notice version | `SITE_CONFIG.privacyNoticeVersion` |
| Run content validation | `npm run validate` |
| Run quality suite | `npm run check` |
| Build production | `npm run build` |
| Create preview | provider preview deployment or `npm run preview` |
| Run/revert migrations | `database/migrations/` using provider SQL tools / backups |
| Review/export leads | protected Supabase dashboard/export, never a public frontend route |
| Handle privacy request | `/api/privacy-request` + verified provider administration |
| Rotate secrets | hosting environment variables, then redeploy and test |

## Publish or retire a project

Use a stable lowercase slug. Add matching public data — including the full EN/ES case study under `detail` — in `content/projects.json`. Run `npm run validate`; the build fails when one language or one expanded case is missing. Never claim a maturity level or result that is not verifiable.

## Replace the résumé

Keep a stable public path such as `assets/documents/raymond-palacios-resume.pdf`; replace the file, update the configured path only if necessary, build, preview, and test desktop/mobile. Do not commit a résumé containing private data not intended for public distribution.

## Database operations

Apply migrations in numeric order. Before destructive changes, create a provider backup/export. A rollback should restore the last known migration state from backup and redeploy the previous application commit. Never expose the service role key to the browser.

Pending cleanup: the project-access removal left the `project_access` table (and its indexes) unused — contact and privacy flows no longer write to it. If no historical exports are needed, drop it in a new migration after backup.

## Export / correct / delete personal data

Use the protected Supabase dashboard for administrative exports and the verification flow in `api/privacy-request.js` for user-initiated requests. Verify ownership by email before disclosure, correction, or deletion. Record operational completion according to the final legal retention policy.

## Recovery

1. Check domain/DNS and hosting status.
2. Roll back to the last successful deployment.
3. Validate public content and résumé paths.
4. Verify serverless API health and Supabase connectivity.
5. Verify the notification email provider.
6. Test primary CTA, language switch, project dialog and contact form (including the `mailto:` fallback).
