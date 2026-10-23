# Operations runbook

This is the minimum safe operating procedure documented for EL-Rouji. It is not a claim that monitoring, backups or an on-call service already exist.

## Source of truth and environments

- **Hosted runtime:** AppDeploy app `el-rouji-70120b`, https://el-rouji-70120b.v2.appdeploy.ai/
- **Repository:** https://github.com/loolooofy69-sketch/EL-Rouji
- **CI:** GitHub Actions runs `npm ci`, a full audit summary, a blocking production dependency audit, TypeScript check and Vite build.
- **Important:** the CI-only `@appdeploy/client` shim must never be deployed.
- **CSS platform limit:** AppDeploy's current validator requires Tailwind CSS 3 directives and rejected Tailwind CSS 4's `@import "tailwindcss";`. Tailwind 4 PR #10 was closed without merge and the app was restored to known-good snapshot `1792755107550`.

## Safe code-change flow

1. Create a feature/fix branch.
2. Make small, focused changes and update the relevant docs/tests when behavior changes.
3. Commit dependency manifest and lockfile together.
4. Wait for CI and review the production and full-tree dependency audit outputs.
5. For UI changes, inspect desktop/mobile plus Arabic RTL, French and English before merging.
6. Merge only after review comments and required test findings are resolved.
7. For a production change, deploy through AppDeploy—not by publishing the CI bundle—and record the AppDeploy version plus Git commit.
8. Run the relevant hosted smoke tests and core-chat availability check.
9. On a regression, restore the last known-good AppDeploy version and verify status is `ready`.

## Secrets

- Store `TAVILY_API_KEY` and future provider credentials only in AppDeploy's secure server-side secret settings.
- Never commit `.env`, credentials, private account exports, user conversations or production logs.
- A submitted secret entry does not prove the key works; run a non-sensitive live research query.
- If a secret is exposed, rotate/revoke it first, update the secret store, then re-test.

## Diagnostics

### App appears disconnected
- Check AppDeploy deployment status and frontend/backend errors.
- Use the hosted health endpoint and verify the reported capabilities.
- Do not label research "ready" unless the health response confirms it.

### Research fails
- Check secure `TAVILY_API_KEY` configuration and server-side provider errors.
- Avoid logging secrets or sensitive queries.
- Retest with a simple non-sensitive query.

### Account sync fails
- Test local-only behavior separately.
- Check that every backend conversation operation enforces server-side account ownership.
- Never copy a real user's conversation data into an issue.

### Attachment analysis fails
- Verify extension, MIME type and size.
- Retest only supported formats listed in `docs/QA_TEST_PLAN.md`.
- Treat PDF/Office formats as unsupported unless implemented and verified in a later milestone.

## Rollback

1. Record the failing AppDeploy version and concise error summary without secrets/user data.
2. Identify the last known-good version using AppDeploy version history.
3. Restore that version through the version-restore workflow.
4. Wait until status is `ready`.
5. Run core chat plus the affected QA test.
6. Record the failed version, restored version, symptom and next action in GitHub.

Do not assume a repository revert automatically changes the running AppDeploy source; track repository and hosted version IDs separately.

## Ownership and limits

The repository owner must approve production releases, live QA, security/privacy decisions and any risk acceptance. This runbook does not claim that an SLA, automated backups, rate limits, monitoring or incident alerting exists; verify and document these before scaling public usage.
