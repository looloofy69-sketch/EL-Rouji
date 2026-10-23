# Next-mile readiness plan

**Document status:** current as of October 23, 2026. This document distinguishes verified repository facts from work that remains unverified.

## Product baseline

EL-Rouji is a React/TypeScript/Vite front end with an AppDeploy-hosted backend. The interface offers assistant, research, writing, study, coding and planning modes; English, French and Arabic UI; local conversation history; optional account sync; a built-in tools panel; and supported image/text-file analysis. Research search is designed to use a server-side Tavily key.

The repository source was imported from AppDeploy snapshot `1792755107550` for app `el-rouji-70120b`. The live deployment remains at https://el-rouji-70120b.v2.appdeploy.ai/.

## Current verified position

| Area | Status | Evidence / limits |
|---|---|---|
| Deployed source copied to GitHub | Verified | Selected source files fetched back from the repository after commit. |
| Dependency lockfile | Verified | Committed `package-lock.json`; locked `npm ci` passes. |
| TypeScript | Verified in candidate branch | GitHub Actions run #55 passed `npm run typecheck`. |
| Frontend bundle | Verified in candidate branch | Run #55 Vite build passed using a CI-only `@appdeploy/client` shim. |
| npm audit | Verified for candidate lockfile | Run #55 and the later strict-audit CI run reported zero findings. CI now fails on low-or-higher findings. Earlier Tailwind 3 tree reported 7 (5 high, 2 moderate). |
| Tailwind 4 visual parity | Not verified | Desktop/mobile and Arabic RTL screenshots have not been compared. |
| Hosted authentication/account sync | Not verified by this work | Requires live end-to-end testing with the real AppDeploy runtime. |
| Research/Tavily end-to-end | Not verified by this work | A configured secret entry is not proof of a successful search request. |
| Backend security/privacy | Not fully reviewed | Requires authorization/input-validation, retention/deletion and abuse-control review. |
| Production release | Not ready | PR #10 and release checklist gates remain open; no version tag exists. |

## Priority sequence

### Gate A — land the dependency baseline
- Review and merge PR #10 only after the CSS visual check is complete.
- Confirm CI and npm audit again on the merge commit.
- Keep the CI-only AppDeploy shim isolated from actual deployment flows.
- Update the changelog to describe the merged changes, not planned work.

### Gate B — product smoke test
- Verify language changes and RTL, chat sending/rendering, history, built-in calculator/tool prompts, research source cards, and supported attachment analysis.
- Test local-only mode and the sign-in/sync lifecycle with the real service.
- Test each backend route for validation errors, unauthenticated access where applicable, and visible error handling.

### Gate C — security/privacy
- Review who can read/write/delete a conversation and whether user IDs are enforced server-side.
- Review input-size/type constraints and error handling for chat, research, image/document analysis.
- Review calculator expression filtering and make sure it cannot execute arbitrary code.
- Define how local and cloud conversation data are retained and deleted.
- Validate and rotate secrets through the secure AppDeploy secret manager; do not copy secrets into GitHub.

### Gate D — operational readiness
- Document production deployment and rollback, owner/contact, environment settings, and smoke-test evidence.
- Review dependency updates weekly through Dependabot and rerun npm audit for every release.
- Decide telemetry/error retention and rate-limiting policy before broader rollout.
- Create a release tag only after all applicable items in `docs/RELEASE_CHECKLIST.md` are complete.

## Out of scope until separately implemented

The presence of prompts or a roadmap does not mean the following features exist: voice input/output, scheduled jobs, general third-party integrations, PDF/DOCX/XLSX ingestion, payment processing, or a separate production PWA experience.
