# Changelog

Notable changes to EL-Rouji will be recorded here.

## Unreleased

- Imported the deployed AppDeploy source snapshot into GitHub.
- Added README, architecture/integration docs, contribution/security guidance, issue/PR templates, Dependabot, CI and the CI-only AppDeploy SDK shim.
- Added the npm lockfile and verified `npm ci`, TypeScript and Vite bundling in GitHub Actions.
- Added a blocking production dependency audit while preserving full development-tree audit results for review; run #67 passed on the tree merged to `main`.
- Added the next-mile readiness matrix, hosted QA plan, operations/rollback runbook and release checklist.
- Investigated Tailwind CSS 4.3.3; GitHub-only build passed but AppDeploy's validator rejected the CSS import. The failed trial was rolled back to version `1792755107550`; PR #10 was closed without merge.
- Documented the latest full-tree audit result (3 moderate findings in run #63; earlier run #38 reported 7) and the AppDeploy Tailwind CSS compatibility constraint. No release tag has been created.
