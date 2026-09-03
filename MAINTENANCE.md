# MAINTENANCE.md

| Frequent task | Edit / operate here |
|---|---|
| Update English copy | `content/site.en.json` |
| Update Spanish copy | `content/site.es.json` |
| Add/reorder/hide public projects | `content/projects.json` |
| Edit expanded project case | `private-content/projects/<slug>.<lang>.json` |
| Change project status | `content/projects.json` |
| Replace résumé | `assets/documents/` + `SITE_CONFIG.links.resume` in `script.js` |
| Change email / LinkedIn / GitHub | `SITE_CONFIG.links` in `script.js` |
| Configure receiving inbox | hosting secret `CONTACT_TO_EMAIL` |
| Disable/restore 3D | `SITE_CONFIG.features.threeD` in `script.js` |
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

Use a stable lowercase slug. Add matching public data in `content/projects.json` and both private files. Run `npm run validate`; the build fails when one language or one expanded case is missing. Never claim a maturity level or result that is not verifiable.

## Replace the résumé

Keep a stable public path such as `assets/documents/raymond-palacios-resume.pdf`; replace the file, update the configured path only if necessary, build, preview, and test desktop/mobile. Do not commit a résumé containing private data not intended for public distribution.

## Database operations

Apply migrations in numeric order. Before destructive changes, create a provider backup/export. A rollback should restore the last known migration state from backup and redeploy the previous application commit. Never expose the service role key to the browser.

## Export / correct / delete personal data

Use the protected Supabase dashboard for administrative exports and the verification flow in `api/privacy-request.js` for user-initiated requests. Verify ownership by email before disclosure, correction, or deletion. Record operational completion according to the final legal retention policy.

## Recovery

1. Check domain/DNS and hosting status.
2. Roll back to the last successful deployment.
3. If 3D is implicated, set `features.threeD=false` and redeploy.
4. Validate public content and résumé paths.
5. Verify serverless API health and Supabase connectivity.
6. Verify the notification email provider.
7. Test primary CTA, language switch, project gate and contact form.
