# EL-Rouji source sync

Status: deployed source imported; repository CI established; AppDeploy-compatible Tailwind CSS 3 remains the active baseline.

- Source app: `el-rouji-70120b`
- Source snapshot: `1792755107550`
- Target repository: https://github.com/loolooofy69-sketch/EL-Rouji
- Transferred source/config paths: `backend/index.ts`, `index.html`, `package.json`, `postcss.config.js`, `src/App.tsx`, `src/components/BuiltInTools.tsx`, `src/index.css`, `src/main.tsx`, `tailwind.config.js`, `tests/tests.json`, `tsconfig.json`, `vite.config.ts`.
- GitHub Actions includes `npm ci`, full-tree audit summary, production audit gate, TypeScript check and a Vite build using the CI-only AppDeploy SDK shim.
- No secret values were committed.


## Live deployment and source parity check — 24 October 2026

Read-only verification through the connected AppDeploy source/status tools found:

- App `el-rouji-70120b` is currently reported as `ready` at live URL https://el-rouji-70120b.v2.appdeploy.ai/.
- The deployed last-valid snapshot remains `1792755107550`; the tool's latest available QA snapshot is dated 23 October 2026 and reported no frontend errors, network errors, or backend errors. This is not a fresh end-to-end test of every user journey.
- Compared against GitHub `main` at the time of review: `backend/index.ts`, `src/components/BuiltInTools.tsx`, `src/index.css`, `src/main.tsx`, and `index.html` matched exactly. `src/App.tsx` differed only by four unused icon imports and the unused `modeDescriptions` constant present in the deployed snapshot but removed from GitHub source.
- The repository and deployed snapshot are therefore functionally aligned in the inspected paths, but not byte-identical in `src/App.tsx`. No live application code was changed during this verification.

The runtime status and inspected-file parity do not establish correct account isolation, rate limiting, URL-fetch security, retention/deletion behavior, or successful operation of every API. Those remain release checks.

## Source-only URL-fetch mitigation — 24 October 2026

GitHub main now contains security PR #17 and its UI follow-up PR #19. The route rejects direct HTTP(S) URLs before any call to the hosted scraper; normal query-based Tavily search remains supported. The standalone URL helper has regression tests for local/special hostnames, private and reserved IPv4 ranges, alternate IPv4 notation, IPv6 local/mapped/documentation ranges, credentials, schemes, and input length.

- Source commit: `28db184b8d8993c25df8d4a15436fbae635dba0d`.
- Main GitHub Actions run #92 passed: https://github.com/looloofy69-sketch/EL-Rouji/actions/runs/40099318099.
- This is a source and CI result only. No AppDeploy source write, deploy, or live regression test was performed after this change.
- The last verified AppDeploy snapshot remains `1792755107550`. Until a new reviewed deployment is verified, do not claim the safeguard is active in production; assume the hosted app may still allow direct page scraping.
- Before deployment, use the actual AppDeploy backend validation path to confirm that the new helper import resolves, then test both the direct-URL rejection and normal search flow in a controlled environment.

## Tailwind CSS 4 compatibility attempt

- Tailwind 4.3.3 passed the GitHub-only npm audit, typecheck and Vite bundle.
- Applying its `@import "tailwindcss";` entry to the actual AppDeploy app failed platform validation, which requires the Tailwind 3 directive form.
- The failed attempt was restored to AppDeploy version `1792755107550`; status was subsequently verified as `ready`.
- PR #10 was closed without merge. The live app remains on the AppDeploy-compatible Tailwind CSS 3 baseline.

## Still outstanding

- PR #11 merged to `main`; GitHub Actions run #67 passed `npm ci`, production-only audit (zero findings), TypeScript and Vite build on the same tested source tree.
- Latest full dependency-tree audit run #67 reported 3 moderate development/build-tool findings; earlier run #38 reported 7 (5 high, 2 moderate). The production-only audit gate returned zero vulnerabilities. Review and explicitly disposition the full-tree findings in issue #9.
- Complete hosted QA for research, auth/account isolation, history deletion, attachments and multilingual mobile/RTL rendering.
- Review backend authorization, input validation, rate limiting, privacy/retention and rollback procedure.
- No release tag has been created; the release checklist remains incomplete.

## Deployment and source reconciliation — 25 October 2026

A fresh read-only AppDeploy status and stored-source inspection supersedes the older snapshot number recorded in the 24 October entries above.

- **App:** `el-rouji-70120b`
- **Reported status:** `ready`
- **Live URL:** https://el-rouji-70120b.v2.appdeploy.ai/
- **Reported deployed snapshot:** `1792849620557`
- **Latest returned QA snapshot timestamp:** `1792849641837`
- **Reported QA errors:** no frontend errors, network errors, or backend errors. This status result is not a fresh end-to-end test of every route or user journey.
- **Stored source inventory:** includes `backend/index.ts` and `backend/url-safety.ts`; the helper source is byte-for-byte aligned with GitHub `main`. The backend handler has the same non-blank source lines in the inspected content, with one blank-line difference around the research source-bundle section. No behavioral difference was identified in that whitespace discrepancy.
- **Research safety:** stored deployed source contains the direct HTTP(S) query rejection and retains query-based Tavily search. Keep direct page scraping disabled until DNS resolution, redirect, and destination-address controls are independently verified.
- **Cost-control/security follow-up:** source inspection found no route-local `requireAuth()` on `POST /api/chat`, `POST /api/research`, `POST /api/analyze-image`, or `POST /api/analyze-document`. This alone does not prove that edge/platform controls are absent. GitHub issue [#23](https://github.com/looloofy69-sketch/EL-Rouji/issues/23) tracks the explicit decision between authenticated-only use and anonymous access with server-enforced quotas, concurrency limits, and spend controls.

This entry records source/status observations only. No AppDeploy source write, deployment, or live request was performed for this reconciliation. Do not treat the issue as resolved until policy tests pass and the tested source is deployed and rechecked.

