# Operations runbook

This runbook records the minimum safe operating process for EL-Rouji. It is not a claim that all production operations are already configured.

## Environments and source of truth

- **Hosted runtime:** AppDeploy application `el-rouji-70120b`, URL https://el-rouji-70120b.v2.appdeploy.ai/.
- **Repository:** https://github.com/loolooofy69-sketch/EL-Rouji.
- **Repository CI:** GitHub Actions checks `npm ci`, npm audit summary, `npm run typecheck`, and Vite bundling. It sets `EL_ROUJI_CI_BUILD=1` to alias the platform-injected `@appdeploy/client` SDK to a no-op/build-only shim.
- **Important:** the bundle produced with that shim is for source/CI validation only and must not be deployed. Use the AppDeploy source/deployment workflow for production so the real SDK and backend runtime remain intact.

## Safe code-change flow

1. Create a feature/fix branch; avoid editing `main` directly for significant changes.
2. Make the smallest scoped change and add tests or update the QA plan when behavior changes.
3. Commit source and lockfile changes together when dependencies change.
4. Wait for required GitHub Actions checks to pass. Review audit output rather than skipping it.
5. For UI changes, inspect desktop/mobile and Arabic RTL plus French/English before merge.
6. Merge only after review findings are addressed and the source/visual checks are complete.
7. Deploy via the AppDeploy flow, recording the resulting AppDeploy version and associated Git commit.
8. Run post-deploy smoke tests for the changed path and core chat availability.
9. If a regression appears, stop further rollout and restore the last known-good AppDeploy version after confirming the version identifier.

## Secret handling

- Store `TAVILY_API_KEY` and any future provider tokens only in the AppDeploy secure server-side secret settings.
- Never commit `.env`, access tokens, API keys, account exports, user conversations or production logs.
- A secret entry being present does not prove it is valid. Test research mode with a known non-sensitive query.
- If a credential is exposed, rotate/revoke it first, update the secure secret store, then validate the affected integration.

## Quick diagnostics

### App appears disconnected
- Check AppDeploy deployment status and frontend/backend error summaries.
- Call `/api/health` through the hosted app to determine whether the service reports ready.
- Do not report research capability as available unless the health/capability response confirms it.

### Research requests fail
- Check secure server-side `TAVILY_API_KEY` configuration and provider response/error logs.
- Verify that logs do not contain the key or user-sensitive query content.
- Re-run a single non-sensitive query and record the outcome.

### Account sync fails
- Test local-only behavior separately from signed-in sync.
- Confirm the user/account context is enforced on each backend conversation operation.
- Never manually inspect or paste real user conversation payloads into issues.

### Attachment analysis fails
- Confirm the file extension, MIME type, and current size constraints.
- Retest only the supported image/text types listed in `docs/QA_TEST_PLAN.md`.
- Treat PDFs and Office files as unsupported unless a later feature is explicitly implemented and tested.

## Rollback

1. Identify the last known-good AppDeploy version in the version history.
2. Capture the failed deployment ID and concise error summary without secrets or user data.
3. Restore the last known-good version using AppDeploy's version-restore workflow.
4. Confirm deployment reaches ready and run the core hosted smoke test plus the affected test case.
5. Record the failure, the restored version, and next action in a GitHub issue.

Do not roll back GitHub source alone and assume the deployed app has changed; repository and AppDeploy runtime versions must be tracked independently.

## Escalation and ownership

The repository owner is responsible for choosing a release window, performing live smoke tests, reviewing security/privacy questions, and approving production release. This runbook does not claim the existence of on-call monitoring, SLA, automated backups, rate limits, or incident alerting; document and verify those before public production scale.
