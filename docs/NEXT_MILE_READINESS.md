# Next-mile readiness plan

**Last updated:** October 23, 2026. Verified items are separated from work still requiring hosted QA or an owner decision.

## Product baseline

EL-Rouji is a React/TypeScript/Vite interface with an AppDeploy-hosted backend. Current UI modes are Assistant, Research, Writing, Study, Coding and Planning. The interface supports English, French and Arabic; browser-local conversation history; optional account sync; built-in task tools; research with source links when configured; and image/text analysis.

Current upload support is PNG, JPEG, WebP, TXT, MD, CSV and JSON. PDF/DOCX/XLSX are not supported by the deployed upload flow. Voice input/output, scheduled tasks and general third-party integrations are roadmap ideas, not implemented features.

## Current verified position

| Area | Status | Evidence / limitation |
|---|---|---|
| AppDeploy source imported | Verified | Source snapshot `1792755107550` copied to GitHub; representative files fetched back. |
| npm lockfile | Verified | `package-lock.json` committed; `npm ci` passes in GitHub Actions. |
| TypeScript and frontend bundle | Verified in GitHub Actions | Uses the CI-only shim for AppDeploy's injected client module. |
| Production dependency audit | Hard gate added | CI runs `npm audit --omit=dev --audit-level=low`; passed in run #67 on PR #11's tested tree, which was merged to main. |
| Full development-tree audit | Outstanding risk | Latest run #67 reported 3 moderate; earlier run #38 reported 7 (5 high, 2 moderate). Production-only audit was clean. See `docs/DEPENDENCY_AUDIT.md`. |
| Tailwind 4 migration | Blocked by hosted template | AppDeploy validator rejected `@import "tailwindcss";`. PR #10 was closed without merge. |
| Live deployment recovery | Verified | Failed trial was rolled back to AppDeploy version `1792755107550`; status returned to `ready`. |
| Hosted authentication/account sync | Not verified by this repository work | Requires live tests with separate synthetic accounts. |
| Research/Tavily | Not verified end-to-end | Secure secret configuration alone does not prove provider calls work. |
| Backend security/privacy | Incomplete review | API authorization, input validation, retention/deletion and abuse controls need dedicated testing. |
| Release | Not ready | Product smoke tests, full build-tool audit risk decision and hosted runtime checks are incomplete; no version tag exists. |

## Recommended gates

### Gate A — dependency and CI baseline
- Keep Tailwind CSS 3 syntax compatible with the current AppDeploy validator.
- Require `npm ci`, typecheck, Vite build and the production dependency audit to pass in GitHub Actions.
- Keep the full development audit visible and track the unresolved build-tool advisories rather than claiming a clean full-tree audit.
- Revisit Tailwind CSS 4 only after AppDeploy supports a valid CSS entry and the hosted build passes.

### Gate B — hosted QA
- Verify chat send/render, markdown, language switching and Arabic RTL on desktop and mobile.
- Test each mode and built-in tool, including invalid calculator input.
- Test valid/invalid research configuration and at least one returned source URL.
- Test allowed attachment formats, unsupported formats, oversized files and malformed text/JSON.
- Test local history, sign-in/sync, sign-out, account isolation and delete behavior with synthetic accounts.

### Gate C — security and privacy
- Review server-side ownership checks on conversation read/update/delete endpoints.
- Review input validation/size limits, error leakage, rate limiting and calculator expression handling.
- Decide retention/deletion semantics for local and cloud history.
- Verify all credentials remain in secure server-side settings; rotate any exposed keys.

### Gate D — release and operations
- Record AppDeploy version ID, repository commit and QA results for any real deployment.
- Keep rollback target documented and verify that a rollback reaches `ready`.
- Resolve or formally accept the development-tool advisory risk.
- Create a release tag only after `docs/RELEASE_CHECKLIST.md` is complete.

## Scope caution

This plan does not assert an SLA, on-call service, monitoring, backups, formal privacy certification, or a completed application security audit.
